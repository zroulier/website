import Stripe from 'stripe';
import { Resend } from 'resend';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Redis } from '@upstash/redis';
import { printsCatalog } from '../../src/data/printsCatalog.js';

/**
 * Required Environment Variables:
 * - STRIPE_SECRET_KEY
 * - STRIPE_WEBHOOK_SECRET
 * - RESEND_API_KEY
 * - AWS_BUCKET_NAME
 * - MY_AWS_ACCESS_KEY_ID
 * - MY_AWS_SECRET_ACCESS_KEY
 * - MY_AWS_REGION
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */

const REQUIRED_ENVS = [
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "RESEND_API_KEY",
    "AWS_BUCKET_NAME",
    "MY_AWS_ACCESS_KEY_ID",
    "MY_AWS_SECRET_ACCESS_KEY",
    "MY_AWS_REGION",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN"
];

// Initialize clients outside handler (where possible) for reuse
// Note: We'll initialize specific clients inside validated blocks to avoid immediate crashes if envs are missing
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req, context) => {
    // 1. Validation: Check for required environment variables
    const missingEnvs = REQUIRED_ENVS.filter(key => !process.env[key]);
    if (missingEnvs.length > 0) {
        console.error(`CRITICAL: Missing environment variables: ${missingEnvs.join(", ")}`);
        return new Response(`Server Configuration Error: Missing ${missingEnvs.join(", ")}`, { status: 500 });
    }

    // Initialize Redis and S3 now that we know envs exist
    const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    const s3Client = new S3Client({
        region: process.env.MY_AWS_REGION,
        credentials: {
            accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
        }
    });

    // 2. Stripe Webhook Verification and Event Construction
    const sig = req.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    try {
        const body = await req.text();
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
        console.error(`Webhook Signature Error: ${err.message}`);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // 3. Handle 'payment_intent.succeeded'
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntentId = event.data.object.id;
        const redisKey = `stripe:processed:${paymentIntentId}`;

        try {
            // 4. Idempotency Check
            const existingRecord = await redis.get(redisKey);
            if (existingRecord) {
                console.log(`[Idempotency] PaymentIntent ${paymentIntentId} already processed. Skipping.`);
                console.log(`[Idempotency] Record:`, existingRecord);
                return new Response(JSON.stringify({ received: true, duplicate: true }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // 5. Fetch Fresh Data (to be safe/consistent with existing flow)
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
                expand: ['latest_charge']
            });

            console.log(`Processing PaymentIntent: ${paymentIntentId}`);

            // 6. Find Email
            const email = paymentIntent.receipt_email ||
                paymentIntent.latest_charge?.receipt_email ||
                paymentIntent.latest_charge?.billing_details?.email;

            if (!email) {
                console.error(`CRITICAL: No email found for ${paymentIntentId}.`);
                // Return 200 to stop retry loops for unfixable data issues
                return new Response(JSON.stringify({ received: true, error: "No email" }), { status: 200 });
            }

            console.log(`Found email: ${email}`);

            // 7. Look up Print Info
            const printId = paymentIntent.metadata.printId;
            const printObject = printsCatalog.find(p => p.id === String(printId));
            const fileName = printObject ? printObject.s3Key : null;

            if (!fileName) {
                console.error(`CRITICAL: No filename mapped for printId: ${printId} (PaymentIntent: ${paymentIntentId})`);
                // Return 200 to stop retry loops
                return new Response(JSON.stringify({ received: true, error: "Invalid printId" }), { status: 200 });
            }

            // 8. Generate S3 Presigned URL
            // We add ResponseContentDisposition to force the browser to download the file
            const command = new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileName,
                ResponseContentDisposition: `attachment; filename="${fileName}"`,
            });
            const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 43200 }); // 12 hours

            // 9. Send Email
            await resend.emails.send({
                from: 'Zachary Roulier <prints@zacharyroulier.com>',
                to: email,
                subject: 'Your Digital Print Download',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h1 style="color: #2A2A2A; font-weight: 300;">Thank you for your purchase!</h1>
                        <p>Here is your secure link to download the high-resolution print:</p>
                        <div style="margin: 40px 0;">
                            <a href="${downloadUrl}" style="padding: 15px 30px; background-color: #2A2A2A; color: white; text-decoration: none; border-radius: 0px; text-transform: uppercase; font-size: 13px; letter-spacing: 2px;">Download Print</a>
                        </div>
                        <p style="font-size: 12px; color: #666;">Note: This link is secure and will expire in 12 hours.</p>
                    </div>
                `
            });

            console.log(`Email successfully sent to ${email} for file: ${fileName}`);

            // 10. Mark as Processed in Redis
            // Store metadata about what happened
            await redis.set(redisKey, {
                paymentIntentId,
                eventId: event.id,
                sentAt: new Date().toISOString(),
                email,
                printId
            }, { ex: 60 * 60 * 24 * 30 }); // Keep record for 30 days

            console.log(`[Idempotency] Marked ${paymentIntentId} as processed.`);

        } catch (error) {
            console.error('Error processing payment:', error);
            // Return 500 to trigger Stripe retry since we haven't marked it as processed yet
            return new Response(`Server Error: ${error.message}`, { status: 500 });
        }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
};
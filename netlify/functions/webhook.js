import Stripe from 'stripe';
import { Resend } from 'resend';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize S3 Client with custom user environment variables
const s3Client = new S3Client({
    region: process.env.MY_AWS_REGION,
    credentials: {
        accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
    }
});

export default async (req, context) => {
    const sig = req.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        const body = await req.text();
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === 'payment_intent.succeeded') {
        const id = event.data.object.id;

        try {
            // 1. FETCH FRESH DATA FROM STRIPE
            const paymentIntent = await stripe.paymentIntents.retrieve(id, {
                expand: ['latest_charge']
            });

            console.log("Full Payment Intent Retrieved");

            // 2. Find the email
            const email = paymentIntent.receipt_email ||
                paymentIntent.latest_charge?.receipt_email ||
                paymentIntent.latest_charge?.billing_details?.email;

            console.log("Found email:", email);

            // 3. Define print S3 filenames
            const printId = paymentIntent.metadata.printId;
            const s3Filenames = {
                "1": "Lake Sunset.jpg",
                "2": "Denver Skyline.jpg",
                "3": "Dolomites Sunset FINAL.jpg"
            };

            const fileName = s3Filenames[printId];

            if (email && fileName) {
                // 4. Generate a Secure Pre-signed URL for the S3 object (valid for 1 hour)
                // We add ResponseContentDisposition to force the browser to download the file
                const command = new GetObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: fileName,
                    ResponseContentDisposition: `attachment; filename="${fileName}"`,
                });

                const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

                // 5. Send secure email
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
                            <p style="font-size: 12px; color: #666;">Note: This link is secure and will expire in 1 hour. Please download your file promptly.</p>
                        </div>
                    `
                });
                console.log(`Email successfully sent to ${email} for file: ${fileName}`);
            } else if (!email) {
                console.error('CRITICAL: No email found.');
            } else if (!fileName) {
                console.error(`CRITICAL: No filename mapped for printId: ${printId}`);
            }

        } catch (error) {
            console.error('Error processing payment:', error);
            return new Response(`Server Error: ${error.message}`, { status: 500 });
        }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
};
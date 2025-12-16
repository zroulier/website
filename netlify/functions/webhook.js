import Stripe from 'stripe';
import { Resend } from 'resend';
import { prints } from '../../src/data/prints.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Handle payment intent succeeded event
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const email = paymentIntent.receipt_email; // Ensure LinkAuthenticationElement is used on frontend
        const printId = paymentIntent.metadata.printId;

        // Lookup print details from shared data
        const print = prints.find(p => p.id.toString() === printId.toString());
        const fileLink = print ? print.src : 'https://imgur.com/yJyNjt6.jpg';

        if (email) {
            try {
                await resend.emails.send({
                    from: 'Zachary Roulier <prints@zacharyroulier.com>', // User needs to verify domain in Resend
                    to: email,
                    subject: 'Your Digital Print Download',
                    html: `
                        <h1>Thank you for your purchase!</h1>
                        <p>Here is the link to download your high-resolution print:</p>
                        <a href="${fileLink}" style="padding: 10px 20px; background-color: #2A2A2A; color: white; text-decoration: none; border-radius: 5px;">Download Print</a>
                        <p>If you ordered a physical print, you will receive another email with shipping details soon.</p>
                    `
                });
                console.log(`Email sent to ${email}`);
            } catch (error) {
                console.error('Error sending email:', error);
            }
        } else {
            console.log('No email found in payment intent');
        }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
};

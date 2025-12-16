import Stripe from 'stripe';
import { Resend } from 'resend';

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

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;

        // --- THE FIX IS HERE ---
        // 1. Try the direct field
        // 2. Try the charges array (where it usually hides in webhooks)
        const email = paymentIntent.receipt_email ||
            paymentIntent.charges?.data?.[0]?.billing_details?.email;

        console.log("Found email:", email); // This will show up in Netlify Function logs

        const printId = paymentIntent.metadata.printId;

        const printLinks = {
            "1": "https://imgur.com/yJyNjt6.jpg",
            "2": "https://imgur.com/another-image.jpg"
        };

        const fileLink = printLinks[printId] || "https://imgur.com/yJyNjt6.jpg";

        if (email) {
            try {
                await resend.emails.send({
                    from: 'Zachary Roulier <prints@zacharyroulier.com>',
                    to: email,
                    subject: 'Your Digital Print Download',
                    html: `
                        <h1>Thank you for your purchase!</h1>
                        <p>Here is the link to download your high-resolution print:</p>
                        <a href="${fileLink}" style="padding: 10px 20px; background-color: #2A2A2A; color: white; text-decoration: none; border-radius: 5px;">Download Print</a>
                    `
                });
                console.log(`Email sent to ${email}`);
            } catch (error) {
                console.error('Error sending email:', error);
                return new Response("Error sending email", { status: 500 });
            }
        } else {
            console.log('No email found in payment intent');
        }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
};
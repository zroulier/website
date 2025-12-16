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

    // Handle session completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const email = session.customer_details.email;
        const printId = session.metadata.printId;

        // In a real app, you'd lookup the specific file URL based on printId
        // For now, we'll send a generic or specific link
        const downloadLinks = {
            '1': 'https://imgur.com/yJyNjt6.jpg', // Replace with real high-res download links
            '2': 'https://imgur.com/aDlwriY.jpg',
            '3': 'https://imgur.com/PpjX5Uw.jpg'
        };

        const fileLink = downloadLinks[printId] || 'https://imgur.com/yJyNjt6.jpg';

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
            // Don't fail the webhook response, just log error
        }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
};

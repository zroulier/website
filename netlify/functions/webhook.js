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
        const id = event.data.object.id;

        try {
            // 1. FETCH FRESH DATA FROM STRIPE
            // This guarantees we get the email, even if the webhook payload was incomplete.
            const paymentIntent = await stripe.paymentIntents.retrieve(id, {
                expand: ['latest_charge']
            });

            console.log("Full Payment Intent Retrieved");

            // 2. Find the email (Look in every possible hiding spot)
            const email = paymentIntent.receipt_email ||
                paymentIntent.latest_charge?.receipt_email ||
                paymentIntent.latest_charge?.billing_details?.email;

            console.log("Found email:", email);

            // 3. Define print links
            const printId = paymentIntent.metadata.printId;
            const printLinks = {
                "1": "https://imgur.com/yJyNjt6.jpg",
                "2": "https://imgur.com/another-image.jpg"
            };
            const fileLink = printLinks[printId] || "https://imgur.com/yJyNjt6.jpg";

            if (email) {
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
                console.log(`Email successfully sent to ${email}`);
            } else {
                console.error('CRITICAL: No email found in PaymentIntent or Charge object.');
            }

        } catch (error) {
            console.error('Error processing payment:', error);
            return new Response(`Server Error: ${error.message}`, { status: 500 });
        }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
};
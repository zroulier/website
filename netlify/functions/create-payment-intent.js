import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (printId) => {
    // SECURITY: Always calculate amounts on server side
    // In a real app, you would look this up in a database
    const prices = {
        '1': 15000, // $150.00 in cents
        '2': 15000,
        '3': 15000
    };
    return prices[printId] || 15000;
};

export default async (req, context) => {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { printId } = await req.json();

        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(printId),
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                printId: printId.toString()
            }
        });

        return new Response(JSON.stringify({
            clientSecret: paymentIntent.client_secret,
        }), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

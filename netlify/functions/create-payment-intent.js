import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (printId) => {
    // SECURITY: Define prices locally on server to prevent import crashes
    const prices = {
        '1': 2500, // $0.50 for testing
        '2': 2500,
        '3': 2500
    };

    // Fallback security price
    return prices[printId] || 2500;
};

export default async (req, context) => {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { printId } = await req.json();

        // Calculate amount
        const amount = calculateOrderAmount(printId);

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
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
            amount: amount, // Return the actual amount to show user
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

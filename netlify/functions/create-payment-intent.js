import Stripe from 'stripe';
import { prints } from '../../src/data/prints.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (printId) => {
    // Look up prince in shared data
    // printId comes in as a string or number, ensure comparison works
    const print = prints.find(p => p.id.toString() === printId.toString());

    if (print) {
        return print.price * 100; // Convert to cents
    }

    // Fallback security price (though validation should ideally happen)
    return 15000;
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

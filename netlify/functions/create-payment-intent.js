import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

import { printsCatalog } from '../../src/data/printsCatalog.js';

const calculateOrderAmount = (printId) => {
    // Find the print in the catalog
    // Convert printId to string to ensure safe comparison
    const print = printsCatalog.find(p => p.id === String(printId));

    // Return the price from the catalog, or null if not found
    return print ? print.priceCents : null;
};

export default async (req, context) => {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { printId } = await req.json();

        // Calculate amount
        const amount = calculateOrderAmount(printId);

        if (!amount) {
            return new Response(JSON.stringify({ error: 'Invalid print ID' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

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

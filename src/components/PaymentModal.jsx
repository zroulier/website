import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    PaymentElement,
    LinkAuthenticationElement,
    Elements,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';

// Initialize Stripe outside of component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/?success=true`,
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            <LinkAuthenticationElement id="link-authentication-element" />
            <PaymentElement id="payment-element" options={{ layout: "tabs" }} />

            {message && (
                <div id="payment-message" className="text-red-500 text-sm font-mono mt-2">
                    {message}
                </div>
            )}

            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full bg-[#2A2A2A] text-[#F2F0EB] py-4 text-xs uppercase tracking-[0.2em] hover:bg-[#7D7259] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        Processing...
                    </span>
                ) : (
                    "Pay Now"
                )}
            </button>

            <button
                type="button"
                onClick={onClose}
                className="w-full text-xs uppercase tracking-widest hover:opacity-50 mt-2"
            >
                Cancel
            </button>
        </form>
    );
};

const PaymentModal = ({ print, onClose }) => {
    const [clientSecret, setClientSecret] = useState("");
    const [isLoadingSecret, setIsLoadingSecret] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        if (print) {
            setIsLoadingSecret(true);
            setError(null); // Clear any previous errors
            fetch("/.netlify/functions/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ printId: print.id }),
            })
                .then((res) => {
                    if (!res.ok) {
                        console.error("Backend response not OK:", res);
                        throw new Error(`Backend Error: ${res.statusText}`);
                    }
                    return res.json();
                })
                .then((data) => {
                    if (data.error) {
                        console.error("Error from backend data:", data.error);
                        throw new Error(data.error);
                    }
                    setClientSecret(data.clientSecret);
                    setIsLoadingSecret(false);
                })
                .catch((err) => {
                    console.error("Error fetching payment intent:", err);
                    setError("Could not load checkout. Ensure you are running with 'netlify dev' or the backend is deployed.");
                    setIsLoadingSecret(false);
                });
        } else {
            // If print is not available, reset states
            setClientSecret("");
            setIsLoadingSecret(false);
            setError("No print selected for payment.");
        }
    }, [print]);

    const appearance = {
        theme: 'flat',
        variables: {
            colorPrimary: '#7D7259',
            colorBackground: '#F2F0EB', // Background of inputs
            colorText: '#2A2A2A',
            colorDanger: '#df1b41',
            fontFamily: 'Manrope, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '0px',
        },
        rules: {
            '.Input': {
                border: '1px solid #2A2A2A',
                backgroundColor: 'transparent',
            },
            '.Label': {
                textTransform: 'uppercase',
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                color: '#2A2A2A',
                opacity: '0.7',
            }
        }
    };

    const options = {
        clientSecret,
        appearance,
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#F2F0EB] w-full max-w-lg p-8 md:p-12 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-8 text-center">
                    <h3 className="font-serif italic text-3xl mb-2">{print.title}</h3>
                    <p className="text-xs uppercase tracking-widest opacity-60">Total: ${print.price}</p>
                </div>

                {isLoadingSecret && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2A2A2A]"></div>
                    </div>
                )}

                {error && (
                    <div className="text-center py-8">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button onClick={onClose} className="text-xs uppercase underline">Close</button>
                    </div>
                )}

                {!isLoadingSecret && !error && clientSecret && (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm onClose={onClose} />
                    </Elements>
                )}
            </motion.div>
        </motion.div>
    );
};

export default PaymentModal;

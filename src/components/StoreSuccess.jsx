import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const StoreSuccess = ({ setView }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#F2F0EB] text-[#2A2A2A] flex items-center justify-center p-6 text-center"
        >
            <div className="max-w-lg">
                <h2 className="font-serif italic text-5xl md:text-6xl mb-6">Thank You</h2>
                <p className="font-sans text-sm uppercase tracking-widest leading-loose mb-10">
                    Your order has been confirmed. <br />
                    You will receive an email shortly with your digital download link and receipt.
                </p>
                <button
                    onClick={() => setView('home')}
                    className="border-b border-[#2A2A2A] pb-1 hover:opacity-50 transition-opacity uppercase text-xs tracking-[0.2em]"
                >
                    Back to Home
                </button>
            </div>
        </motion.div>
    );
};

export default StoreSuccess;

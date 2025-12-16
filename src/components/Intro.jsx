import React from 'react';
import { motion } from 'framer-motion';
import { DATA } from '../data/projects';

const Intro = ({ onComplete }) => {
    return (
        <motion.div
            className="fixed inset-0 z-50 bg-[#F2F0EB] flex flex-col items-center justify-center pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }}
            onAnimationComplete={() => {
                // We can trigger onComplete here if we want to wait for exit animation, 
                // but the original code calls onComplete from a timeout in App.
                // We'll keep the original logic for now, but this component is just the UI.
            }}
        >
            <div className="overflow-hidden">
                {[DATA.intro.line1, DATA.intro.line2, DATA.intro.line3].map((line, i) => (
                    <div key={i} className="overflow-hidden h-12 md:h-20 flex items-center justify-center">
                        <motion.h1
                            className="font-serif text-3xl md:text-5xl text-[#2A2A2A] italic tracking-tight"
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1, delay: i * 0.4, ease: [0.76, 0, 0.24, 1] }}
                        >
                            {line}
                        </motion.h1>
                    </div>
                ))}
            </div>

            <motion.div
                className="mt-12 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
            >
                <img
                    src="/signature.png"
                    alt="Zachary Roulier"
                    className="w-80 md:w-96 h-auto opacity-80 brightness-0"
                />
            </motion.div>
        </motion.div>
    );
};

export default Intro;

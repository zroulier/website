import React from 'react';
import { motion } from 'framer-motion';

const About = ({ onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 bg-[#F2F0EB] flex flex-col md:flex-row"
        >
            <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden">
                <img
                    src="https://i.imgur.com/rf7sYeA.jpeg"
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-80"
                    alt="Profile"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F2F0EB] to-transparent opacity-50 md:opacity-0 md:bg-gradient-to-r" />
            </div>

            <div className="w-full md:w-1/2 h-1/2 md:h-full p-8 md:p-20 flex flex-col justify-center relative">
                <button onClick={onClose} className="absolute top-8 right-8 text-xs uppercase tracking-widest hover:line-through">Close</button>

                <h2 className="text-sm uppercase tracking-widest text-neutral-400 mb-8">Philosophy</h2>
                <p className="font-serif text-2xl md:text-4xl leading-relaxed text-[#2A2A2A] mb-8">
                    Operating drones since 2017. <br />
                    I chase the beauty in nature from the silence of the skies.
                </p>
                <div className="flex flex-col gap-4 text-sm text-neutral-600 font-light max-w-md">
                    <p>
                        Based in Denver, operating globally.
                    </p>
                    <p>

                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default About;

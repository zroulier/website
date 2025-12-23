import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHint } from '../../context/HintContext';
import { Lightbulb } from 'lucide-react';

const HintTab = () => {
    const { openHint, hasSeenGuide } = useHint();

    return (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="fixed top-32 left-0 z-50 pointer-events-auto"
        >
            <motion.button
                layoutId="hint-container"
                onClick={openHint}
                whileHover={{ x: 5 }} // Slight outward movement
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(event, info) => {
                    if (info.offset.x > 100) {
                        openHint();
                    }
                }}
                className="group relative flex items-center bg-white text-[#7D7259] px-3 py-2 rounded-r-lg shadow-[2px_0_8px_rgba(0,0,0,0.1)] transition-colors duration-300 pointer-events-auto cursor-grab active:cursor-grabbing"
            >
                {/* Filler to maintain edge connection during hover */}
                <div className="absolute top-0 bottom-0 right-full w-10 bg-white" />

                <motion.div layoutId="hint-content" className="relative flex items-center">
                    <div className="relative">
                        <Lightbulb size={18} className="relative z-10" />
                    </div>
                </motion.div>
            </motion.button>
        </motion.div>
    );
};

export default HintTab;

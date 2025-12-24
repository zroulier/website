import React, { useEffect, useState, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHint } from '../../context/HintContext';
import { Lightbulb } from 'lucide-react';

const HintTab = () => {
    const { openHint, hasSeenGuide } = useHint();
    const [topPosition, setTopPosition] = useState(128); // Default fallback
    const [isPositioned, setIsPositioned] = useState(false);

    // Use useLayoutEffect to attempt synchronous measurement before paint
    // However, since we rely on other elements, we might still need a check loop
    useLayoutEffect(() => {
        const updatePosition = () => {
            // Only relevant for desktop layout
            if (!window.matchMedia('(min-width: 768px)').matches) {
                setTopPosition(128);
                setIsPositioned(true);
                return;
            }

            const logo = document.getElementById('signature-anchor');
            const projectStart = document.getElementById('project-list-start');

            if (logo && projectStart) {
                const logoRect = logo.getBoundingClientRect();
                const projectRect = projectStart.getBoundingClientRect();

                const midpoint = logoRect.bottom + ((projectRect.top - logoRect.bottom) / 2);
                const safeTop = Math.max(logoRect.bottom + 20, midpoint);

                setTopPosition(safeTop - 20);
                setIsPositioned(true);
            }
        };

        // Attempt immediate measurement
        updatePosition();

        // Fallback: If not ready, retry briefly (handles race conditions with layout rendering)
        // Using a short polling since we want "instant" feel without long timers
        let retryCount = 0;
        const retryTimer = setInterval(() => {
            if (retryCount > 10) { // Give up after ~200ms
                clearInterval(retryTimer);
                setIsPositioned(true); // Show anyway to avoid permanent hidden state
                return;
            }
            const logo = document.getElementById('signature-anchor');
            if (logo) {
                updatePosition();
                clearInterval(retryTimer);
            }
            retryCount++;
        }, 20);

        // Resize listener
        let resizeTimer;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updatePosition, 50);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(retryTimer);
            clearTimeout(resizeTimer);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // If not yet positioned/measured on desktop, keep invisible to prevent shake/jump
    if (!isPositioned) {
        return null; // Or <div className="hidden" />
    }

    return (
        <motion.div
            // Removed "animate" for top to prevent Framer Motion from interpolating on mount
            // We use simple inline style or CSS class transition for resize events
            className="fixed left-0 z-50 pointer-events-auto transition-[top] duration-300 ease-out"
            style={{ top: topPosition }}
        >
            <motion.button
                layoutId="hint-container"
                onClick={openHint}
                whileHover={{ x: 5 }}
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

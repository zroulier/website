import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHint } from '../../context/HintContext';
import { X, Map, Layout, Wallet, ArrowRight, ChevronLeft, Check } from 'lucide-react';

const steps = [
    {
        title: "Quick Guide",
        description: "Welcome to my portfolio. This quick guide will help you navigate the main features.",
        icon: Layout,
        color: "text-[#2A2A2A]"
    },
    {
        title: "Coordinates",
        description: "Interact with each project's coordinates to view its map location. Zoom out to explore other locations, and click on their pin to navigate to their placement on the website.",
        icon: Map,
        color: "text-[#7D7259]"
    },
    {
        title: "Gallery",
        description: "Scroll below the project pages to view the photo gallery. Hovering over a photo will change the page's coordinates to that photo's location.",
        icon: Layout,
        color: "text-[#2A2A2A]"
    },
    {
        title: "Prints",
        description: "Interested in purchasing digital photo file(s)? Use the prints button to explore the options.",
        icon: Wallet,
        color: "text-[#7D7259]"
    }
];

const HintModal = () => {
    const { isHintOpen, closeHint, activeStep, nextStep, prevStep, markGuideSucccess } = useHint();

    if (!isHintOpen) return null;

    const currentStepData = steps[activeStep];
    const isFirstStep = activeStep === 0;
    const isLastStep = activeStep === steps.length - 1;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
            onClick={closeHint}
        >
            <motion.div
                layoutId="hint-modal"
                className="bg-[#F2F0EB] w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border border-[#2A2A2A]/10 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header / Progress */}
                <div className="flex items-center justify-between p-4 pb-2">
                    <div className="flex gap-1">
                        {steps.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1 rounded-full transition-all duration-300 ${idx <= activeStep ? 'w-6 bg-[#7D7259]' : 'w-2 bg-[#2A2A2A]/10'
                                    }`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={closeHint}
                        className="p-1 hover:bg-[#2A2A2A]/5 rounded-full transition-colors text-[#2A2A2A]/50 hover:text-[#2A2A2A]"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-6 pt-2 flex-1 min-h-[200px] flex flex-col items-center text-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col items-center"
                        >
                            <div className={`p-4 rounded-full bg-[#7D7259]/10 mb-4 ${currentStepData.color}`}>
                                <currentStepData.icon size={32} />
                            </div>
                            <h2 className="text-xl font-light text-[#2A2A2A] mb-2">
                                {currentStepData.title}
                            </h2>
                            <p className="text-sm text-neutral-500 leading-relaxed max-w-[260px]">
                                {currentStepData.description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer / Navigation */}
                <div className="p-4 border-t border-[#2A2A2A]/5 flex items-center justify-between">
                    <button
                        onClick={prevStep}
                        disabled={isFirstStep}
                        className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2
                            ${isFirstStep
                                ? 'opacity-0 pointer-events-none'
                                : 'text-neutral-500 hover:text-[#2A2A2A] hover:bg-[#2A2A2A]/5'
                            }
                        `}
                    >
                        <ChevronLeft size={16} />
                        Back
                    </button>

                    <button
                        onClick={isLastStep ? markGuideSucccess : nextStep}
                        className="bg-[#2A2A2A] text-[#F2F0EB] text-sm font-medium px-6 py-2 rounded-lg hover:bg-[#7D7259] transition-colors flex items-center gap-2 shadow-lg shadow-[#2A2A2A]/10"
                    >
                        {isLastStep ? (
                            <>
                                Got it
                                <Check size={16} />
                            </>
                        ) : (
                            <>
                                Next
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default HintModal;

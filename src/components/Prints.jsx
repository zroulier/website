import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PaymentModal from './PaymentModal';
import { printsCatalog } from '../data/printsCatalog';

const Prints = () => {
    const navigate = useNavigate();

    const [selectedPrint, setSelectedPrint] = React.useState(null);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 bg-[#F2F0EB] text-[#2A2A2A] overflow-y-auto"
        >
            <div className="min-h-screen px-6 py-20 md:p-20 flex flex-col relative">
                <button
                    onClick={() => navigate('/')}
                    className="fixed top-8 right-8 z-50 flex items-center gap-2 text-xs uppercase tracking-widest hover:gap-4 transition-all mix-blend-difference text-[#2A2A2A]"
                >
                    Close <div className="w-8 h-[1px] bg-current" />
                </button>

                <div className="max-w-7xl mx-auto w-full">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-20 text-center"
                    >
                        <h2 className="font-sans text-4xl md:text-6xl uppercase tracking-[0.2em] font-light mb-4 text-[#2A2A2A]">Selected Works</h2>
                        <p className="font-serif italic text-xl md:text-2xl text-[#2A2A2A]/60">Drone Photography Prints</p>
                    </motion.div>

                    <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-12 block">
                        {printsCatalog.map((print, i) => (
                            <motion.div
                                key={print.id}
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 + (i * 0.1), duration: 0.8 }}
                                className="group cursor-pointer break-inside-avoid mb-10"
                                onClick={() => setSelectedPrint(print)}
                            >
                                <div className="bg-[#E5E3DD] mb-6 relative overflow-hidden">
                                    {print.imageSrc ? (
                                        <img
                                            src={print.imageSrc}
                                            alt={print.title}
                                            className="w-full h-auto block"
                                        />
                                    ) : (
                                        <div className="min-h-[400px] flex items-center justify-center text-neutral-400 opacity-30 font-serif italic text-4xl">
                                            Frame {print.id}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/5 transition-colors duration-500" />
                                </div>
                                <div className="flex justify-between items-baseline border-t border-[#2A2A2A]/20 pt-4">
                                    <span className="font-serif italic text-xl">{print.title}</span>
                                    <span className="text-xs font-mono opacity-60">{print.edition}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Purchase Modal */}
            <AnimatePresence>
                {selectedPrint && (
                    <PaymentModal
                        key="payment-modal"
                        print={selectedPrint}
                        onClose={() => setSelectedPrint(null)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Prints;

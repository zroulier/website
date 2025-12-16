import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Prints = ({ onClose }) => {
    const prints = [
        { id: 1, title: 'Mountain Lake Sunset', edition: '1', price: 150, src: 'https://imgur.com/yJyNjt6.jpg' },
        { id: 2, title: 'City Skyline', edition: '2', price: 150, src: 'https://imgur.com/aDlwriY.jpg' },
        { id: 3, title: 'Dolomiti Sunset', edition: '3', price: 150, src: 'https://imgur.com/PpjX5Uw.jpg' }
    ];

    const [selectedPrint, setSelectedPrint] = React.useState(null);
    const [isProcessing, setIsProcessing] = React.useState(false);

    const handlePurchase = async (print) => {
        setIsProcessing(true);
        try {
            const response = await fetch('/.netlify/functions/create-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    printId: print.id,
                    title: print.title,
                    price: print.price,
                    image: print.src
                }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error('No checkout URL returned');
                setIsProcessing(false);
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
            setIsProcessing(false);
        }
    };

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
                    onClick={onClose}
                    className="fixed top-8 right-8 z-50 text-xs uppercase tracking-widest hover:line-through mix-blend-difference text-[#2A2A2A]"
                >
                    Close
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
                        {prints.map((print, i) => (
                            <motion.div
                                key={print.id}
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 + (i * 0.1), duration: 0.8 }}
                                className="group cursor-pointer break-inside-avoid mb-10"
                                onClick={() => setSelectedPrint(print)}
                            >
                                <div className="bg-[#E5E3DD] mb-6 relative overflow-hidden">
                                    {print.src ? (
                                        <img
                                            src={print.src}
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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                        onClick={() => setSelectedPrint(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#F2F0EB] w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Image Side */}
                            <div className="w-full md:w-1/2 bg-[#E5E3DD]">
                                {selectedPrint.src && (
                                    <img
                                        src={selectedPrint.src}
                                        alt={selectedPrint.title}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>

                            {/* Content Side */}
                            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-serif italic text-4xl md:text-5xl mb-4">{selectedPrint.title}</h3>
                                    <p className="text-xs uppercase tracking-widest opacity-60 mb-8">Edition {selectedPrint.edition}</p>

                                    <div className="space-y-4 text-sm font-light text-[#2A2A2A]/80 mb-12">
                                        <p>High-quality fine art print on archival paper. Signed and numbered by the artist.</p>
                                        <p>Dimensions: 24" x 36" (Framing available upon request)</p>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-8 border-b border-[#2A2A2A]/10 pb-4">
                                        <span className="font-sans text-sm uppercase tracking-widest">Price</span>
                                        <span className="font-serif text-2xl">${selectedPrint.price}</span>
                                    </div>

                                    <button
                                        onClick={() => handlePurchase(selectedPrint)}
                                        disabled={isProcessing}
                                        className="w-full bg-[#2A2A2A] text-[#F2F0EB] py-4 text-xs uppercase tracking-[0.2em] hover:bg-[#7D7259] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isProcessing ? 'Processing...' : 'Purchase Print'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Prints;

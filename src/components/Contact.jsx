import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Mountain, Camera } from 'lucide-react';

const Contact = ({ onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2A2A2A] text-[#F2F0EB] flex items-center justify-center p-6"
        >
            <button onClick={onClose} className="absolute top-8 right-8 text-xs uppercase tracking-widest hover:opacity-50 text-[#F2F0EB] z-50">Close</button>


            {/* Background Image Placeholder */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://imgur.com/8RxhNF1.jpeg"
                    alt="Contact Background"
                    className="w-full h-full object-cover opacity-50"
                />
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 relative z-10">
                <div>
                    <h2 className="font-serif text-5xl md:text-7xl italic mb-12">Let's work<br />together.</h2>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xs uppercase tracking-widest opacity-50 mb-2">Capabilities</h3>
                            <ul className="space-y-2 text-lg font-light">
                                <li className="flex items-center gap-3"><Wind size={16} /> Drone Cinematography</li>
                                <li className="flex items-center gap-3"><Mountain size={16} /> Extreme Sports Filming</li>
                                <li className="flex items-center gap-3"><Camera size={16} /> Real Estate Filming & Photography</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xs uppercase tracking-widest opacity-50 mb-2">Direct</h3>
                            <a href="#" className="text-xl border-b border-[#F2F0EB]/30 pb-1 hover:border-[#F2F0EB] transition-colors">zwroulierbusiness@gmail.com</a>
                        </div>
                    </div>
                </div>

                <form className="flex flex-col gap-8 pt-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="group">
                        <label className="block text-xs uppercase tracking-widest opacity-50 mb-2 group-focus-within:text-white transition-colors">Name</label>
                        <input type="text" className="w-full bg-transparent border-b border-[#F2F0EB]/20 py-2 outline-none focus:border-[#F2F0EB] transition-colors font-serif text-xl" />
                    </div>
                    <div className="group">
                        <label className="block text-xs uppercase tracking-widest opacity-50 mb-2 group-focus-within:text-white transition-colors">Inquiry Type</label>
                        <select className="w-full bg-transparent border-b border-[#F2F0EB]/20 py-2 outline-none focus:border-[#F2F0EB] transition-colors font-serif text-xl appearance-none rounded-none">
                            <option className="text-black">Select...</option>
                            <option className="text-black">Project Commission</option>
                            <option className="text-black">Print Inquiry</option>
                            <option className="text-black">Collaboration</option>
                        </select>
                    </div>
                    <div className="group">
                        <label className="block text-xs uppercase tracking-widest opacity-50 mb-2 group-focus-within:text-white transition-colors">Message</label>
                        <textarea rows="3" className="w-full bg-transparent border-b border-[#F2F0EB]/20 py-2 outline-none focus:border-[#F2F0EB] transition-colors font-serif text-xl resize-none"></textarea>
                    </div>

                    <button className="self-start mt-4 px-8 py-3 border border-[#F2F0EB]/30 hover:bg-[#F2F0EB] hover:text-[#2A2A2A] transition-all duration-300 uppercase text-xs tracking-[0.2em]">
                        Send Request
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default Contact;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Motorbike, Mountain, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        inquiryType: 'Select...',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.inquiryType === 'Select...') return;

        setStatus('loading');
        try {
            const response = await fetch('/.netlify/functions/send-contact-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', inquiryType: 'Select...', message: '' });
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                const errorData = await response.json();
                console.error('Backend Error:', errorData);
                setStatus('error');
            }
        } catch (error) {
            console.error('Network or Server Error:', error);
            setStatus('error');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#FBFBFB] text-[#1A1A1A] overflow-y-auto"
        >
            <div className="flex flex-col md:flex-row min-h-screen">
                {/* Left Side: Visual (Sticky for Desktop) */}
                <div className="hidden md:block w-5/12 h-screen sticky top-0 bg-[#F5F5F5] overflow-hidden">
                    <img
                        src="https://imgur.com/8RxhNF1.jpeg"
                        alt="Contact Background"
                        className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-black/5" />
                </div>

                {/* Right Side: Content */}
                <div className="w-full md:w-7/12 flex flex-col p-8 md:p-24 lg:p-32">
                    {/* Mobile Hero Image */}
                    <div className="md:hidden w-full aspect-[16/9] mb-12 rounded-lg overflow-hidden shadow-sm">
                        <img
                            src="https://imgur.com/8RxhNF1.jpeg"
                            alt="Contact Background Mobile"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className="fixed top-8 right-8 md:top-12 md:right-12 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] hover:gap-4 transition-all text-[#1A1A1A] z-50 group"
                    >
                        <span className="opacity-60 group-hover:opacity-100 transition-opacity">Close</span>
                        <div className="w-8 h-[1px] bg-[#1A1A1A] opacity-20 group-hover:opacity-100 transition-all" />
                    </button>

                    <div className="max-w-xl">
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="font-serif text-5xl md:text-7xl italic leading-tight mb-16"
                        >
                            Let's work<br />together
                        </motion.h2>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-16"
                        >
                            <div>
                                <h3 className="text-[10px] uppercase tracking-[0.2em] mb-6 opacity-40">Capabilities</h3>
                                <ul className="space-y-4 text-base font-light tracking-wide">
                                    <li className="flex items-center gap-4 group cursor-default">
                                        <div className="w-4 h-[1px] bg-black/20 group-hover:w-8 group-hover:bg-black transition-all" />
                                        <Motorbike size={14} className="opacity-40" />
                                        <span>Car & Motorcycle Filming</span>
                                    </li>
                                    <li className="flex items-center gap-4 group cursor-default">
                                        <div className="w-4 h-[1px] bg-black/20 group-hover:w-8 group-hover:bg-black transition-all" />
                                        <Mountain size={14} className="opacity-40" />
                                        <span>Sports Filming</span>
                                    </li>
                                    <li className="flex items-center gap-4 group cursor-default">
                                        <div className="w-4 h-[1px] bg-black/20 group-hover:w-8 group-hover:bg-black transition-all" />
                                        <Camera size={14} className="opacity-40" />
                                        <span>Real Estate Video & Photography</span>
                                    </li>
                                </ul>
                            </div>

                            <form className="flex flex-col gap-12" onSubmit={handleSubmit}>
                                <div className="group relative">
                                    <label className="block text-[10px] uppercase tracking-[0.2em] mb-3 opacity-40 group-focus-within:opacity-100 transition-opacity">Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Your name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-transparent border-b border-black/10 py-3 outline-none focus:border-black transition-colors font-serif text-xl placeholder:text-black/10"
                                    />
                                </div>
                                <div className="group relative">
                                    <label className="block text-[10px] uppercase tracking-[0.2em] mb-3 opacity-40 group-focus-within:opacity-100 transition-opacity">Inquiry Type</label>
                                    <div className="relative">
                                        <select
                                            required
                                            value={formData.inquiryType}
                                            onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                                            className="w-full bg-transparent border-b border-black/10 py-3 outline-none focus:border-black transition-colors font-serif text-xl appearance-none rounded-none cursor-pointer"
                                        >
                                            <option value="Select..." disabled>Select...</option>
                                            <option value="Project Commission">Project Commission</option>
                                            <option value="Print Inquiry">Print Inquiry</option>
                                            <option value="Collaboration">Collaboration</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity">
                                            <div className="w-2 h-2 border-r border-b border-black rotate-45" />
                                        </div>
                                    </div>
                                </div>
                                <div className="group relative">
                                    <label className="block text-[10px] uppercase tracking-[0.2em] mb-3 opacity-40 group-focus-within:opacity-100 transition-opacity">Message</label>
                                    <textarea
                                        required
                                        rows="2"
                                        placeholder="How can I help?"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-transparent border-b border-black/10 py-3 outline-none focus:border-black transition-colors font-serif text-xl resize-none placeholder:text-black/10"
                                    ></textarea>
                                </div>

                                <div className="flex flex-col gap-6 pt-4">
                                    <button
                                        disabled={status === 'loading'}
                                        className="self-start px-12 py-4 bg-[#1A1A1A] text-white hover:bg-black transition-all duration-300 uppercase text-[10px] tracking-[0.3em] disabled:opacity-50 relative overflow-hidden group/btn"
                                    >
                                        <span className="relative z-10">
                                            {status === 'loading' ? 'Sending...' : 'Message Me'}
                                        </span>
                                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                    </button>

                                    <AnimatePresence mode="wait">
                                        {status === 'success' && (
                                            <motion.p
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="text-[10px] uppercase tracking-widest text-[#1A1A1A] italic"
                                            >
                                                — Message received.
                                            </motion.p>
                                        )}
                                        {status === 'error' && (
                                            <motion.p
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="text-[10px] uppercase tracking-widest text-red-500 max-w-sm"
                                            >
                                                Error sending message. Please contact me directly at: <a href="mailto:zwroulierbusiness@gmail.com" className="border-b border-current">zwroulierbusiness@gmail.com</a>
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Contact;

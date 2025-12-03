import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MediaFrame from './MediaFrame';

const ProjectDetail = ({ project }) => {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Get current details based on active image, fallback to first image if available
    const currentDetails = project.images[activeImageIndex]?.details || project.images[0]?.details || {};

    return (
        <div className="w-full min-h-[200vh] pb-40">
            <motion.div
                className="w-full h-[85vh] relative overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Hero Video (Local) */}
                <motion.video
                    src={project.previewVideo}
                    className="absolute inset-0 w-full h-[110%] object-cover"
                    style={{ y }}
                    autoPlay
                    loop
                    muted
                    playsInline
                />

                <div className="absolute inset-0 bg-black/20" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
                    <motion.p
                        className="text-xs md:text-sm tracking-[0.3em] mb-4 uppercase"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        {project.subtitle} — {project.year}
                    </motion.p>
                    <motion.h1
                        layoutId={`title-${project.id}`}
                        className="text-6xl md:text-9xl font-serif italic tracking-tighter"
                    >
                        {project.title}
                    </motion.h1>
                </div>
            </motion.div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-40">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

                    <div className="md:col-span-4 sticky top-32 h-fit">
                        <h3 className="text-xs uppercase tracking-widest text-neutral-400 mb-4">The Narrative</h3>
                        <p className="font-serif text-2xl md:text-3xl leading-relaxed text-[#2A2A2A]">
                            {project.description}
                        </p>
                        <div className="mt-12 flex gap-4">
                            <div className="h-[1px] w-12 bg-neutral-300 mt-3" />
                            <ul className="text-xs uppercase tracking-widest space-y-2 text-neutral-500 transition-all duration-300">
                                <li>Drone: {currentDetails.drone}</li>
                                <li>Settings: <span className="lowercase">{currentDetails.settings}</span></li>
                                <li>Post Processing: <span className="lowercase">{currentDetails.postProcessing}</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="md:col-span-8 flex flex-col gap-24">
                        {project.images.map((img, idx) => (
                            <motion.div
                                key={idx}
                                onViewportEnter={() => setActiveImageIndex(idx)}
                                viewport={{ margin: "-20% 0px -60% 0px" }}
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-10%" }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <MediaFrame src={img.src} className="w-full shadow-2xl shadow-neutral-200" />
                                    <div className="flex justify-between mt-4 text-xs font-mono text-neutral-400">
                                        <span>FRAME 0{idx + 1}</span>
                                        <span>ISO auto</span>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}

                        {/* Video Section */}
                        {project.videoUrl && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 0.8 }}
                                className="w-full aspect-video bg-black shadow-2xl shadow-neutral-200"
                            >
                                <iframe
                                    src={project.videoUrl}
                                    className="w-full h-full"
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    allowFullScreen
                                    loading="lazy"
                                    title={`${project.title} Video`}
                                />
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;

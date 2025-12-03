import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { DATA } from '../data/projects';

const Home = ({ setView, setActiveProject }) => {
    const [hoveredProject, setHoveredProject] = useState(null);

    // Scroll to top on mount
    React.useEffect(() => {
        const main = document.querySelector('main');
        if (main) main.scrollTo(0, 0);
    }, []);

    // Background Image Fade
    return (
        <>
            {/* Hero Section */}
            <section className="relative w-full h-screen snap-start snap-always flex flex-col justify-center px-6 md:px-10">
                {/* Dynamic Background */}
                <div className="fixed inset-0 z-0 pointer-events-none bg-[#F2F0EB]">
                    {DATA.projects.map((project) => {
                        const isHovered = hoveredProject === project.id;
                        const isVimeo = project.previewVideo?.includes('vimeo.com');

                        return (
                            <div
                                key={project.id}
                                className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                                style={{ opacity: isHovered ? 0.5 : 0 }}
                            >
                                <video
                                    src={project.previewVideo}
                                    className="w-full h-full object-cover scale-110"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    preload="auto"
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Project List Container */}
                <div className="relative z-10 flex gap-10 items-stretch">
                    {/* List */}
                    <div className="flex flex-col items-center md:items-start gap-8 md:gap-4">
                        {DATA.projects.map((project, i) => (
                            <motion.div
                                key={project.id}
                                onMouseEnter={() => {
                                    setHoveredProject(project.id);
                                    setActiveProject(project);
                                }}
                                onMouseLeave={() => {
                                    setHoveredProject(null);
                                    setActiveProject(null);
                                }}
                                onClick={() => {
                                    setActiveProject(project);
                                    setView('project');
                                }}
                                className="group cursor-pointer w-full md:w-auto relative"
                            >
                                {/* Numbering */}
                                <span className="hidden md:inline-block absolute -left-8 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-900 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-4 group-hover:translate-x-0">
                                    0{i + 1}
                                </span>

                                {/* Title */}
                                <motion.h2
                                    layoutId={`title-${project.id}`}
                                    className="text-5xl md:text-8xl lg:text-9xl font-serif italic text-transparent text-stroke-thin md:text-stroke hover:text-[#2A2A2A] transition-colors duration-500 ease-out text-center md:text-left"
                                    style={{
                                        WebkitTextStroke: hoveredProject === project.id ? '0px' : '1.25px #2A2A2A'
                                    }}
                                >
                                    {project.title}
                                </motion.h2>

                                {/* Subtitle Reveal */}
                                <div className="h-0 overflow-hidden group-hover:h-8 transition-all duration-500 flex justify-center md:justify-start items-center gap-4">
                                    <span className="text-xs tracking-widest uppercase text-neutral-900 mt-2 block">{project.subtitle}</span>
                                    <ArrowRight size={14} className="mt-2 text-neutral-400 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 delay-100" />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Side Image */}
                    <div className={`hidden md:block flex-1 relative transition-opacity duration-700 ease-in-out ${hoveredProject ? 'opacity-0' : 'opacity-100'}`}>
                        <img
                            src="https://imgur.com/PTrMzX0.jpg"
                            alt="Decorative"
                            className="w-full h-full object-cover rounded-sm"
                        />
                    </div>
                </div>
            </section>

            {/* Collage Section */}
            <section className="relative w-full min-h-screen snap-start snap-always bg-[#F2F0EB] p-6 md:p-20 flex flex-col justify-center">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                    {DATA.gallery.map((item, i) => (
                        <div key={item.id} className="break-inside-avoid">
                            <img
                                src={item.src}
                                alt={item.location}
                                className="w-full h-auto object-cover pointer-events-none select-none"
                                onContextMenu={(e) => e.preventDefault()}
                                draggable="false"
                            />

                            <div className="flex justify-between mt-2">
                                <span className="text-neutral-900 font-mono text-xs">
                                    0{i + 1} {item.location.toUpperCase()}
                                </span>
                                <span className="text-neutral-900 font-mono text-xs">
                                    {item.year}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default Home;

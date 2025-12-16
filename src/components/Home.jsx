import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { DATA } from '../data/projects';

const Home = ({ setView, setActiveProject }) => {
    const [hoveredProject, setHoveredProject] = useState(null);
    const [isSideImageHovered, setIsSideImageHovered] = useState(false);
    const mobileSectionsRef = React.useRef([]);

    // Scroll to top on mount
    React.useEffect(() => {
        const main = document.querySelector('main');
        if (main) main.scrollTo(0, 0);
    }, []);

    // Mobile: Update active project on scroll
    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const projectId = entry.target.getAttribute('data-project-id');
                        const project = DATA.projects.find(p => p.id === projectId);
                        if (project) {
                            setActiveProject(project);
                        }
                    }
                });
            },
            {
                threshold: 0.5, // Trigger when 50% of the section is visible
            }
        );

        mobileSectionsRef.current.forEach((section) => {
            if (section) observer.observe(section);
        });

        return () => {
            mobileSectionsRef.current.forEach((section) => {
                if (section) observer.unobserve(section);
            });
        };
    }, [setActiveProject]);

    // Background Image Fade
    return (
        <>
            {/* Mobile View: Full Screen Projects */}
            <div className="md:hidden">
                {DATA.projects.map((project, i) => {
                    const isVimeo = project.previewVideo?.includes('vimeo.com');
                    const vimeoId = isVimeo ? project.previewVideo.split('/').pop() : null;

                    return (
                        <section
                            key={project.id}
                            data-project-id={project.id}
                            ref={el => mobileSectionsRef.current[i] = el}
                            className="relative w-full h-screen snap-start snap-always flex flex-col justify-center items-center overflow-hidden"
                            onClick={() => {
                                setActiveProject(project);
                                setView('project');
                            }}
                        >
                            {/* Background Video */}
                            <div className="absolute inset-0 z-0">
                                {isVimeo ? (
                                    <iframe
                                        src={`https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0`}
                                        className="w-full h-full object-cover scale-[1.35] pointer-events-none"
                                        frameBorder="0"
                                        allow="autoplay; fullscreen; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <video
                                        src={project.previewVideo}
                                        className="w-full h-full object-cover scale-110"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        preload="auto"
                                    />
                                )}
                                {/* Overlay for readability */}
                                <div className="absolute inset-0 bg-black/20" />
                            </div >

                            {/* Content */}
                            < div className="relative z-10 text-center px-6" >
                                <span className="block text-xs font-mono text-[#F2F0EB] mb-4 tracking-widest">
                                    0{i + 1}
                                </span>
                                <h2 className="text-6xl font-serif italic text-[#F2F0EB]">
                                    {project.title}
                                </h2>
                                <p className="text-xs tracking-widest uppercase text-[#F2F0EB] mt-4 opacity-80">
                                    {project.subtitle}
                                </p>
                            </div >
                        </section >
                    );
                })}
            </div >

            {/* Desktop View: Original Layout */}
            < section className="hidden md:flex relative w-full h-screen snap-start snap-always flex-col justify-center px-6 md:px-10" >
                {/* Dynamic Background */}
                < div className="fixed inset-0 z-0 pointer-events-none bg-[#F2F0EB]" >
                    {
                        DATA.projects.map((project) => {
                            const isHovered = hoveredProject === project.id;
                            const isVimeo = project.previewVideo?.includes('vimeo.com');
                            const vimeoId = isVimeo ? project.previewVideo.split('/').pop() : null;

                            return (
                                <div
                                    key={project.id}
                                    className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                                    style={{ opacity: isHovered ? 0.5 : 0 }}
                                >
                                    {isVimeo ? (
                                        <iframe
                                            src={`https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0`}
                                            className="w-full h-full object-cover scale-110 pointer-events-none"
                                            frameBorder="0"
                                            allow="autoplay; fullscreen; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <video
                                            src={project.previewVideo}
                                            className="w-full h-full object-cover scale-110"
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            preload="auto"
                                        />
                                    )}
                                </div>
                            );
                        })
                    }
                </div >

                {/* Project List Container */}
                < div className="relative z-10 flex gap-10 items-stretch" >
                    {/* List */}
                    < div className="flex flex-col items-center md:items-start gap-8 md:gap-4" >
                        {
                            DATA.projects.map((project, i) => (
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
                            ))
                        }
                    </div >



                    {/* Side Image */}
                    <div
                        className={`hidden md:block flex-1 relative transition-opacity duration-700 ease-in-out ${hoveredProject ? 'opacity-0' : 'opacity-100'}`}
                        onMouseEnter={() => setIsSideImageHovered(true)}
                        onMouseLeave={() => setIsSideImageHovered(false)}
                    >
                        <div className="relative w-full h-full overflow-hidden rounded-sm">
                            <motion.img
                                src="https://imgur.com/xz0ymyK.jpg"
                                alt="Decorative Main"
                                className="absolute inset-0 w-full h-full object-cover"
                                initial={{ opacity: 1, scale: 1 }}
                                animate={{
                                    opacity: isSideImageHovered ? 0 : 1,
                                    scale: isSideImageHovered ? 1.1 : 1
                                }}
                                transition={{ duration: 0.7, ease: "easeInOut" }}
                            />
                            <motion.img
                                src="https://imgur.com/PTrMzX0.jpg"
                                alt="Decorative Hover"
                                className="absolute inset-0 w-full h-full object-cover"
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{
                                    opacity: isSideImageHovered ? 1 : 0,
                                    scale: isSideImageHovered ? 1 : 1.1
                                }}
                                transition={{ duration: 0.7, ease: "easeInOut" }}
                            />
                        </div>
                    </div>
                </div >
            </section >

            {/* Collage Section */}
            < section id="gallery-section" className="relative w-full min-h-screen snap-start snap-always bg-[#F2F0EB] p-6 md:p-20 flex flex-col justify-center" >
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
            </section >
        </>
    );
};

export default Home;

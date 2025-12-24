import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DATA } from '../data/projects';
import { getVimeoId } from '../utils/video';

const Home = ({ setActiveProject }) => {
    const navigate = useNavigate();
    const [hoveredProject, setHoveredProject] = useState(null);
    const [isSideImageHovered, setIsSideImageHovered] = useState(false);

    // Warm cache: Store IDs of projects that should have their background loaded
    const [warmedProjectIds, setWarmedProjectIds] = useState([]);

    // Track which project is visible on mobile to lazy load video
    const [mobileVisibleId, setMobileVisibleId] = useState(null);
    // Track adjacent buffer IDs for seamless mobile scrolling
    const [mobileBufferIds, setMobileBufferIds] = useState([]);

    const mobileSectionsRef = useRef([]);
    const galleryItemsRef = useRef([]);
    const resetTimeoutRef = useRef(null);
    const desktopFirstProjectRef = useRef(null);

    // Scroll to top on mount
    useEffect(() => {
        const main = document.querySelector('main');
        if (main) main.scrollTo(0, 0);
    }, []);

    // Desktop: Preload all projects (Staggered)
    useEffect(() => {
        // Only preload on desktop (md and up)
        if (!window.matchMedia('(min-width: 768px)').matches) return;

        const timeouts = [];
        DATA.projects.forEach((p, index) => {
            // Stagger preload to avoid network/CPU spike
            // Start after 1s, then every 1s
            const delay = 1000 + (index * 1000);

            const t = setTimeout(() => {
                setWarmedProjectIds(prev => {
                    if (prev.includes(p.id)) return prev;
                    return [...prev, p.id];
                });
            }, delay);
            timeouts.push(t);
        });

        return () => timeouts.forEach(clearTimeout);
    }, []);

    // Mobile: Update active project on scroll & track visibility using IntersectioObserver with preload margin
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Preload buffer logic:
                    // When a section enters the "preload zone" (via rootMargin), we add it to buffer
                    // But we only set 'visible' ID for strict focus updating if fully intersecting.

                    const projectId = entry.target.getAttribute('data-project-id');
                    if (projectId) {
                        if (entry.isIntersecting) {
                            // Determine main visible project
                            // If entry ratio is high enough, set strict visibility
                            // Note: Threshold 0.5 below handles the primary visibility switch
                        }
                    }
                });
            },
            {
                threshold: 0.1, // Trigger loosely for buffer
                rootMargin: "50% 0px 50% 0px" // Preload adjacent sections well before they arrive
            }
        );

        // Strict observer for current active item logic
        // On mobile, we use a "center line" trigger (rootMargin -50%) to ensure focus is only updated
        // when the item crosses the exact center of the screen.
        // On desktop, we keep the original threshold logic.
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const strictObserverOptions = isMobile
            ? { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
            : { threshold: 0.5 };

        const strictObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const projectId = entry.target.getAttribute('data-project-id');
                        if (projectId) {
                            setMobileVisibleId(projectId);

                            // Buffer logic: current, prev, next
                            const currentIndex = DATA.projects.findIndex(p => p.id === projectId);
                            const buffer = [projectId];
                            if (currentIndex > 0) buffer.push(DATA.projects[currentIndex - 1].id);
                            if (currentIndex < DATA.projects.length - 1) buffer.push(DATA.projects[currentIndex + 1].id);

                            setMobileBufferIds(prev => {
                                // Simple efficient compare
                                if (prev.length === buffer.length && prev.every(id => buffer.includes(id))) return prev;
                                return buffer;
                            });

                            const project = DATA.projects.find(p => p.id === projectId);
                            if (project) {
                                setActiveProject(project);
                            }
                        }

                        // Gallery logic
                        const galleryId = entry.target.getAttribute('data-gallery-id');
                        if (galleryId) {
                            const item = DATA.gallery.find(g => String(g.id) === galleryId);
                            if (item) {
                                setActiveProject({ ...item, title: item.location });
                            }
                        }
                    }
                });
            },
            strictObserverOptions
        );

        mobileSectionsRef.current.forEach((section) => {
            if (section) {
                // observer.observe(section); // Can use buffer observer if we want complex preloading
                strictObserver.observe(section);
            }
        });

        galleryItemsRef.current.forEach((item) => {
            if (item) strictObserver.observe(item);
        });

        return () => {
            observer.disconnect();
            strictObserver.disconnect();
        };
    }, [setActiveProject]);

    // Auto-scroll side image
    useEffect(() => {
        const interval = setInterval(() => {
            setIsSideImageHovered(prev => !prev);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Helper to render Vimeo Iframe
    const renderVimeoBackground = (previewVideoUrl, isMobile = false) => {
        const vimeoId = getVimeoId(previewVideoUrl);
        if (!vimeoId) return null;

        // Base classes
        let className = "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none ";

        if (isMobile) {
            // Mobile: Cover the vertical height fully, and scale width to maintain aspect ratio (16:9)
            // h-full = fills the section height (controlled by parent container)
            // min-w-full = ensures it covers width
            // w-[177.78vh] = aspect ratio forced width based on height (16/9 * 100)
            // We use 177.78% of the height effectively.
            className += "h-full w-[177.78vh] min-w-full max-w-none";
        } else {
            // Desktop: Force 16:9 Aspect Ratio to Cover Viewport (Standard "Cover" Hack for Iframes)
            // w = 100vw, h = 56.25vw (9/16) -> Base 16:9
            // min-h = 100vh -> Ensures height covers screen
            // min-w = 177.78vh (16/9 * 100vh) -> Ensures width covers if height is constrained to screen height
            className += "w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.78vh]";
        }

        return (
            <iframe
                src={`https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&playsinline=1`}
                className={className}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                title="Project Preview"
                loading="lazy"
            />
        );
    };

    return (
        <>
            {/* Mobile View: Full Screen Projects */}
            <div className="md:hidden">
                {DATA.projects.map((project, i) => {
                    const isVimeo = project.previewVideo?.includes('vimeo.com');

                    // Logic: Render if actively visible OR if inside buffer window (prev/next)
                    // If not in buffer, unmount to save memory.
                    // This creates a rolling window of max 3 active iframes.
                    const shouldRenderVideo = mobileVisibleId === project.id || mobileBufferIds.includes(project.id);

                    // If buffer logic failed for some reason, fallback to visible only to ensure something shows
                    const safeRender = shouldRenderVideo || mobileVisibleId === project.id;

                    return (
                        <section
                            key={project.id}
                            data-project-id={project.id}
                            ref={el => mobileSectionsRef.current[i] = el}
                            className="relative w-full h-screen snap-start snap-always flex flex-col justify-center items-center overflow-hidden"
                            onClick={() => {
                                navigate(`/project/${project.id}`);
                            }}
                        >
                            {/* Background Video */}
                            {/* We keep container always rendered, but conditionally render content */}
                            {/* Note: if shouldRenderVideo is false, we might want to keep the LAST frame or an image fallback */}
                            {/* For now, the request asks to keep video mounted for buffer to avoid black screens */}
                            <div className={`absolute inset-0 z-0 bg-neutral-900 pointer-events-none overflow-hidden transition-opacity duration-500 ${safeRender ? 'opacity-100' : 'opacity-0'}`}>
                                {safeRender && (
                                    isVimeo ? (
                                        renderVimeoBackground(project.previewVideo, true)
                                    ) : (
                                        <video
                                            src={project.previewVideo}
                                            className="w-full h-full object-cover"
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            // Lighter preload strategy
                                            preload="metadata"
                                        />
                                    )
                                )}
                                {/* Overlay for readability */}
                                <div className="absolute inset-0 bg-black/20" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 text-center px-6">
                                <span className="block text-xs font-mono text-[#F2F0EB] mb-4 tracking-widest">
                                    0{i + 1}
                                </span>
                                <h2 className="text-6xl font-serif italic text-[#F2F0EB]">
                                    {project.title}
                                </h2>
                                <p className="text-xs tracking-widest uppercase text-[#F2F0EB] mt-4 opacity-80">
                                    {project.subtitle}
                                </p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/project/${project.id}`);
                                    }}
                                    className="mt-12 px-8 py-3 bg-[#F2F0EB]/10 backdrop-blur-lg border border-[#F2F0EB]/20 rounded-full text-xs tracking-widest uppercase text-[#F2F0EB] shadow-lg active:scale-95 transition-all duration-300"
                                >
                                    Open Project {project.title}
                                </button>
                            </div>

                            {/* Scroll Hint */}
                            <div className="absolute bottom-24 left-0 w-full flex flex-col items-center z-10 pointer-events-none">
                                <span className="text-[10px] tracking-[0.2em] uppercase text-[#F2F0EB] opacity-70 mb-2">Scroll to Explore More</span>
                                <motion.div
                                    animate={{ y: [0, 5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <ArrowDown size={14} className="text-[#F2F0EB] opacity-70" />
                                </motion.div>
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* Desktop View: Optimized Layout */}
            <section className="hidden md:flex relative w-full h-screen snap-start snap-always flex-col justify-center px-6 md:px-10">
                {/* Dynamic Background */}
                <div className="fixed inset-0 z-0 pointer-events-none bg-[#F2F0EB] overflow-hidden">
                    {
                        DATA.projects.map((project) => {
                            // Logic: Render if warmed or hovered. 
                            // Note: warmed list includes hovered project ID by the useEffect logic.
                            const shouldMount = warmedProjectIds.includes(project.id) || hoveredProject === project.id;

                            if (!shouldMount) return null;

                            const isHovered = hoveredProject === project.id;
                            const isVimeo = project.previewVideo?.includes('vimeo.com');

                            return (
                                <div
                                    key={project.id}
                                    className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                                    style={{ opacity: isHovered ? 0.5 : 0 }}
                                >
                                    {isVimeo ? (
                                        renderVimeoBackground(project.previewVideo)
                                    ) : (
                                        <video
                                            src={project.previewVideo}
                                            className="w-full h-full object-cover scale-110"
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            preload="metadata"
                                        />
                                    )}
                                </div>
                            );
                        })
                    }
                </div>

                {/* Project List Container */}
                <div className="relative z-10 flex gap-10 items-stretch">
                    {/* List */}
                    <div className="flex flex-col items-center md:items-start gap-8 md:gap-4">
                        {
                            DATA.projects.map((project, i) => (
                                <motion.div
                                    key={project.id}
                                    onMouseEnter={() => {
                                        if (resetTimeoutRef.current) {
                                            clearTimeout(resetTimeoutRef.current);
                                        }
                                        setHoveredProject(project.id);
                                        setActiveProject(project);
                                    }}
                                    onMouseLeave={() => {
                                        setHoveredProject(null);
                                        // Delay resetting the active project coordinates
                                        resetTimeoutRef.current = setTimeout(() => {
                                            setActiveProject(null);
                                        }, 3000);
                                    }}
                                    onClick={() => {
                                        navigate(`/project/${project.id}`);
                                    }}
                                    className="group cursor-pointer w-full md:w-auto relative"
                                    ref={i === 0 ? desktopFirstProjectRef : null}
                                    id={i === 0 ? "project-list-start" : null}
                                >
                                    {/* Numbering */}
                                    <span className="hidden md:inline-block absolute -left-8 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-900 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-4 group-hover:translate-x-0">
                                        0{i + 1}
                                    </span>

                                    {/* Title */}
                                    <motion.h2
                                        layoutId={`title-${project.id}`}
                                        className="text-5xl md:text-8xl lg:text-9xl font-serif italic text-transparent text-stroke-thin md:text-stroke group-hover:text-[#2A2A2A] transition-colors duration-500 ease-out text-center md:text-left"
                                        style={{
                                            WebkitTextStroke: hoveredProject === project.id ? '0px' : '1.25px #2A2A2A'
                                        }}
                                    >
                                        {project.title}
                                    </motion.h2>

                                    {/* Subtitle Reveal */}
                                    <div className="h-0 overflow-hidden group-hover:h-8 transition-all duration-500 flex justify-center md:justify-start items-center gap-4">
                                        <span className="text-xs tracking-widest uppercase text-neutral-900 mt-2 block">{project.subtitle}</span>
                                        <ArrowRight size={14} className="mt-2 text-neutral-900 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 delay-100" />
                                    </div>
                                </motion.div>
                            ))
                        }
                    </div>

                    {/* Side Image */}
                    <div
                        className={`hidden md:block flex-1 relative transition-opacity duration-700 ease-in-out ${hoveredProject ? 'opacity-0' : 'opacity-100'}`}
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
                                transition={{ duration: 1.1, ease: "easeInOut" }}
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
                                transition={{ duration: 1.1, ease: "easeInOut" }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Collage Section */}
            <section id="gallery-section" className="relative w-full min-h-screen snap-start snap-always bg-[#F2F0EB] px-6 pt-20 pb-32 md:px-20 md:pt-20 md:pb-40 flex flex-col justify-center">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                    {DATA.gallery.map((item, i) => (
                        <div
                            key={item.id}
                            id={`gallery-item-${item.id}`}
                            data-gallery-id={item.id}
                            ref={el => galleryItemsRef.current[i] = el}
                            className="break-inside-avoid group relative"
                            onMouseEnter={() => {
                                if (resetTimeoutRef.current) {
                                    clearTimeout(resetTimeoutRef.current);
                                }
                                setActiveProject({ ...item, title: item.location });
                            }}
                            onMouseLeave={() => {
                                resetTimeoutRef.current = setTimeout(() => {
                                    setActiveProject(null);
                                }, 3000);
                            }}
                        >
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

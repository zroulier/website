import React from 'react';
import { motion } from 'framer-motion';

const MainLayout = ({ children, currentView, setView, activeProject }) => {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isBottom, setIsBottom] = React.useState(false);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const bottomThreshold = 50;

        // Mobile Logic for Header Visibility
        if (window.innerWidth < 768 && currentView === 'home') {
            const gallerySection = document.getElementById('gallery-section');
            if (gallerySection) {
                const galleryRect = gallerySection.getBoundingClientRect();
                // Hide header when gallery is near the top of the viewport (entering view)
                setIsScrolled(galleryRect.top <= 100);
            } else {
                setIsScrolled(scrollTop > 50);
            }
        } else {
            // Desktop / Other Views Logic
            const scrolledThreshold = 50;
            setIsScrolled(scrollTop > scrolledThreshold);
        }

        setIsBottom(Math.abs(scrollHeight - clientHeight - scrollTop) < bottomThreshold);
    };

    return (
        <div className="min-h-screen bg-[#F2F0EB] text-[#2A2A2A] selection:bg-[#2A2A2A] selection:text-[#F2F0EB] font-sans overflow-hidden">

            {/* Top Left: Identity */}
            <div
                className={`fixed top-6 left-6 md:top-10 md:left-10 z-40 mix-blend-difference text-[#F2F0EB] transition-opacity duration-500 ${currentView === 'project' ? 'opacity-0 pointer-events-none' : (isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100')}`}
            >
                <button
                    onClick={() => setView('home')}
                    className="text-sm font-bold tracking-widest uppercase hover:opacity-50 transition-opacity"
                >
                    Zachary Roulier
                </button>
            </div>

            {/* Top Right: Coordinates / Context (Fades out on scroll) */}
            <div
                className={`fixed top-6 right-6 md:top-10 md:right-10 z-40 text-neutral-900 text-right transition-opacity duration-500 ${currentView === 'project' ? 'opacity-0 pointer-events-none' : (isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100')}`}
            >
                <p
                    className="text-xs font-mono opacity-80"
                >
                    {activeProject ? activeProject.coords : '39.73° N, 104.99° W'}
                </p>
                <p className="text-xs uppercase tracking-widest font-light mt-1">
                    {activeProject ? activeProject.title : 'Home'}
                </p>
            </div>

            {/* Bottom Right: Coordinates / Context (Fades in at bottom) */}
            <div
                className={`hidden md:block fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 text-neutral-900 text-right transition-opacity duration-500 ${currentView === 'project' ? 'opacity-0 pointer-events-none' : (isBottom ? 'opacity-100' : 'opacity-0 pointer-events-none')}`}
            >
                <p
                    className="text-xs font-mono opacity-80"
                >
                    {activeProject ? activeProject.coords : '39.73° N, 104.99° W'}
                </p>
                <p className="text-xs uppercase tracking-widest font-light mt-1">
                    {activeProject ? activeProject.title : 'Home'}
                </p>
            </div>

            {/* Bottom Left: Menu (Desktop) */}
            <div className="hidden md:flex fixed bottom-10 left-10 z-40 flex-col items-start gap-2 text-neutral-900">
                <button
                    onClick={() => setView('about')}
                    className="text-xs uppercase tracking-[0.2em] hover:italic transition-all"
                >
                    [ About ]
                </button>
                <button
                    onClick={() => setView('contact')}
                    className="text-xs uppercase tracking-[0.2em] hover:italic transition-all"
                >
                    [ Contact ]
                </button>
            </div>

            {/* Mobile Bottom Bar */}
            <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-[#F2F0EB]/90 backdrop-blur-sm border-t border-neutral-200 py-4 px-6 flex justify-between items-center text-neutral-900">
                <button
                    onClick={() => setView('about')}
                    className="text-xs uppercase tracking-[0.2em]"
                >
                    [ About ]
                </button>
                <button
                    onClick={() => setView('contact')}
                    className="text-xs uppercase tracking-[0.2em]"
                >
                    [ Contact ]
                </button>
            </div>

            {/* Bottom Right: Status / Scroll Indicator */}
            <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 mix-blend-difference text-[#F2F0EB]">
                {currentView === 'home' ? (
                    <div className={`transition-opacity duration-500 ${!isScrolled ? 'opacity-100' : 'opacity-0'}`}>
                        <span className="animate-pulse text-xs tracking-widest">SCROLL TO EXPLORE</span>
                    </div>
                ) : (
                    <button
                        onClick={() => setView('home')}
                        className="flex items-center gap-2 text-xs uppercase tracking-widest hover:gap-4 transition-all"
                    >
                        Close <div className="w-8 h-[1px] bg-current" />
                    </button>
                )}
            </div>

            {/* Main Content Area */}
            <main
                onScroll={handleScroll}
                className="relative w-full h-screen overflow-y-auto overflow-x-hidden no-scrollbar snap-y snap-mandatory scroll-smooth"
            >
                {children}
            </main>
        </div>
    );
};

export default MainLayout;

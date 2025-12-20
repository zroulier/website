import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import MapModal from '../components/MapModal';
import { parseCoords } from '../utils/coords';

const MainLayout = ({ children, activeProject }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isBottom, setIsBottom] = React.useState(false);
    const [isMapOpen, setIsMapOpen] = React.useState(false);
    const [frozenMapData, setFrozenMapData] = React.useState(null);

    const currentCoords = activeProject ? activeProject.coords : '39.73° N, 104.99° W';
    const currentTitle = activeProject ? activeProject.title : 'Home';
    const hasValidCoords = !!parseCoords(currentCoords);

    const handleOpenMap = () => {
        setFrozenMapData({ coords: currentCoords, title: currentTitle });
        setIsMapOpen(true);
    };

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const bottomThreshold = 50;

        // Mobile Logic for Header Visibility
        if (window.innerWidth < 768 && currentPath === '/') {
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
                className={`fixed top-6 left-6 md:top-10 md:left-10 z-40 mix-blend-difference text-[#F2F0EB] transition-opacity duration-500 ${currentPath.startsWith('/project') ? 'opacity-0 pointer-events-none' : (isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100')}`}
            >
                <button
                    onClick={() => navigate('/')}
                    className="block"
                >
                    <img
                        src="/signature.png"
                        alt="Zachary Roulier"
                        className="h-8 md:h-10 w-auto brightness-0 invert"
                    />
                </button>
            </div>

            {/* Top Right: Coordinates / Context (Fades out on scroll) */}
            <div
                className={`fixed top-6 right-6 md:top-10 md:right-10 z-40 text-neutral-900 text-right transition-opacity duration-500 ${currentPath.startsWith('/project') ? 'opacity-0 pointer-events-none' : (isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100')}`}
            >
                {hasValidCoords ? (
                    <button
                        onClick={handleOpenMap}
                        className="text-xs font-mono opacity-80 hover:opacity-100 transform transition-transform duration-1000 hover:scale-110 origin-right"
                    >
                        {currentCoords}
                    </button>
                ) : (
                    <p className="text-xs font-mono opacity-80">
                        {currentCoords}
                    </p>
                )}
                <p className="text-xs uppercase tracking-widest font-light mt-1">
                    {currentTitle}
                </p>
            </div>

            {/* Bottom Right: Coordinates / Context (Fades in at bottom) */}
            <div
                className={`hidden md:block fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 text-neutral-900 text-right transition-opacity duration-500 ${currentPath.startsWith('/project') ? 'opacity-0 pointer-events-none' : (isBottom ? 'opacity-100' : 'opacity-0 pointer-events-none')}`}
            >
                {hasValidCoords ? (
                    <button
                        onClick={handleOpenMap}
                        className="text-xs font-mono opacity-80 hover:opacity-100 transform transition-transform duration-1000 hover:scale-110 origin-right"
                    >
                        {currentCoords}
                    </button>
                ) : (
                    <p className="text-xs font-mono opacity-80">
                        {currentCoords}
                    </p>
                )}
                <p className="text-xs uppercase tracking-widest font-light mt-1">
                    {currentTitle}
                </p>
            </div>

            {/* Bottom Left: Menu (Desktop) */}
            <div className="hidden md:flex fixed bottom-10 left-10 z-40 flex-col items-start gap-2 text-neutral-900">
                <button
                    onClick={() => navigate('/about')}
                    className="text-xs uppercase tracking-[0.2em] hover:italic transition-all"
                >
                    [ About ]
                </button>
                <button
                    onClick={() => navigate('/contact')}
                    className="text-xs uppercase tracking-[0.2em] hover:italic transition-all"
                >
                    [ Contact ]
                </button>
            </div>

            {/* Prints Trigger - Desktop (Bottom Center) */}
            <div className="hidden md:flex fixed bottom-10 left-1/2 -translate-x-1/2 z-40 text-[#7D7259]">
                <button
                    onClick={() => navigate('/prints')}
                    className="group relative flex items-center justify-center"
                >
                    <motion.div
                        whileHover={{ rotate: 180, scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                        className="p-2"
                    >
                        <Sparkles size={25} className="text-[#7D7259]" />
                    </motion.div>

                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                        Purchase Prints
                    </span>
                </button>
            </div>

            {/* Mobile Bottom Bar */}
            <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-[#F2F0EB]/90 backdrop-blur-sm border-t border-neutral-200 py-4 px-6 flex justify-between items-center text-neutral-900">
                <div className="flex gap-6">
                    <button
                        onClick={() => navigate('/about')}
                        className="text-xs uppercase tracking-[0.2em]"
                    >
                        [ About ]
                    </button>
                    <button
                        onClick={() => navigate('/contact')}
                        className="text-xs uppercase tracking-[0.2em]"
                    >
                        [ Contact ]
                    </button>
                </div>
                <button
                    onClick={() => navigate('/prints')}
                    className="text-xs uppercase tracking-[0.2em]"
                >
                    <Sparkles size={16} />
                </button>
            </div>

            {/* Bottom Right: Status / Scroll Indicator */}
            <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 mix-blend-difference text-[#F2F0EB]">
                {currentPath === '/' ? (
                    <div className={`transition-opacity duration-500 ${!isScrolled ? 'opacity-100' : 'opacity-0'}`}>
                        <span className="animate-pulse text-xs tracking-widest">SCROLL TO EXPLORE</span>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/')}
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
            <MapModal
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                coordsString={isMapOpen && frozenMapData ? frozenMapData.coords : currentCoords}
                title={isMapOpen && frozenMapData ? frozenMapData.title : currentTitle}
            />
        </div>
    );
};

export default MainLayout;

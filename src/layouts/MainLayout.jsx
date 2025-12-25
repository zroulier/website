import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DATA } from '../data/projects'; // Added this import based on the provided snippet
import MapModal from '../components/MapModal';
import { formatCoords } from '../utils/coords';
import HintSystem from '../components/HintSystem/HintSystem';
import { useHint } from '../context/HintContext';

const MainLayout = ({ children, activeProject }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname; // Kept for consistency with original code's usage

    // UI State
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isBottom, setIsBottom] = React.useState(false);
    const [isMapOpen, setIsMapOpen] = React.useState(false);
    const [frozenMapData, setFrozenMapData] = React.useState(null);
    const coordsRef = React.useRef(null);
    const bottomSentinelRef = React.useRef(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsBottom(entry.isIntersecting);
            },
            {
                threshold: 0,
                rootMargin: '0px' // Trigger immediately as spacer enters viewport (under footer)
            }
        );
        if (bottomSentinelRef.current) observer.observe(bottomSentinelRef.current);
        return () => observer.disconnect();
    }, []);

    const currentCoords = activeProject ? activeProject.coords : { lat: 39.7300, lng: -104.9900 };
    const currentTitle = activeProject ? activeProject.title : 'Home';
    const hasValidCoords = !!currentCoords && typeof currentCoords.lat === 'number';

    const handleOpenMap = () => {
        setFrozenMapData({ coords: currentCoords, title: currentTitle });
        setIsMapOpen(true);
    };

    const handleScroll = (e) => {
        const { scrollTop } = e.target;
        const scrolledThreshold = 50;

        setIsScrolled(scrollTop > scrolledThreshold);
    };

    return (
        <div className="min-h-screen bg-[#F2F0EB] text-[#2A2A2A] selection:bg-[#2A2A2A] selection:text-[#F2F0EB] font-sans overflow-hidden">
            <HintSystem />


            {/* Mobile Glass Header Background */}
            <div
                className={`md:hidden fixed top-0 left-0 w-full h-20 z-30 transition-opacity duration-500 backdrop-blur-xl bg-[#F2F0EB]/20 backdrop-brightness-110 border-b border-[#F2F0EB]/20 shadow-sm ${currentPath.startsWith('/project') ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            />

            {/* Top Left: Identity */}
            <div
                id="signature-anchor"
                className={`fixed top-6 left-6 md:top-10 md:left-10 z-40 md:mix-blend-difference md:text-[#F2F0EB] transition-opacity duration-500 ${currentPath.startsWith('/project') ? 'opacity-100 md:opacity-0 md:pointer-events-none' : (isScrolled ? 'opacity-100 md:opacity-0 md:pointer-events-none' : 'opacity-100')}`}
            >
                <button
                    onClick={() => navigate('/')}
                    className="block"
                >
                    <img
                        src="/signature.png"
                        alt="Zachary Roulier"
                        className="h-8 md:h-10 w-auto md:brightness-0 md:invert"
                    />
                </button>
            </div>

            {/* Desktop Glass Footer Background */}
            <div
                className={`hidden md:block fixed bottom-0 left-0 w-full h-20 z-30 transition-opacity duration-500 backdrop-blur-xl bg-[#F2F0EB]/20 backdrop-brightness-110 border-t border-[#F2F0EB]/20 shadow-sm ${currentPath.startsWith('/project') ? 'opacity-0 pointer-events-none' : ((isScrolled && !isBottom) ? 'opacity-100' : 'opacity-0 pointer-events-none')}`}
            />

            {/* Top Right: Coordinates / Context (Fades out on scroll) */}
            <div
                className={`fixed top-6 right-6 md:top-10 md:right-10 z-40 text-black md:text-neutral-900 text-right transition-opacity duration-500 flex items-center justify-end gap-2 h-8 md:h-auto md:block md:gap-0 ${currentPath.startsWith('/project') ? 'opacity-100 md:opacity-0 md:pointer-events-none' : (isScrolled ? 'opacity-100 md:opacity-0 md:pointer-events-none' : 'opacity-100')}`}
            >
                {hasValidCoords ? (
                    <button
                        onClick={handleOpenMap}
                        className="text-xs font-mono opacity-100 md:opacity-80 hover:opacity-100 transform transition-transform duration-1000 hover:scale-110 origin-right"
                    >
                        {formatCoords(currentCoords)}
                    </button>
                ) : (
                    <p className="text-xs font-mono opacity-100 md:opacity-80">
                        {formatCoords(currentCoords)}
                    </p>
                )}

                <span className="md:hidden text-xs font-light">||</span>

                <p className="text-xs uppercase tracking-widest font-light md:mt-1">
                    {currentTitle}
                </p>
            </div>

            {/* Bottom Right: Coordinates / Context (Fades in at bottom) */}
            <div
                className={`hidden md:block fixed bottom-6 right-6 md:right-10 z-40 text-neutral-900 text-right transition-opacity duration-500 ${currentPath.startsWith('/project') ? 'opacity-0 pointer-events-none' : (isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none')}`}
            >
                {hasValidCoords ? (
                    <button
                        onClick={handleOpenMap}
                        className="text-xs font-mono opacity-80 hover:opacity-100 transform transition-transform duration-1000 hover:scale-110 origin-right"
                    >
                        {formatCoords(currentCoords)}
                    </button>
                ) : (
                    <p className="text-xs font-mono opacity-80">
                        {formatCoords(currentCoords)}
                    </p>
                )}
                <p className="text-xs uppercase tracking-widest font-light mt-1">
                    {currentTitle}
                </p>
            </div>

            {/* Bottom Left: Menu (Desktop) */}
            <div className="hidden md:flex fixed bottom-6 left-10 z-40 flex-col items-start gap-2 text-neutral-900">
                <button
                    onClick={() => navigate('/about')}
                    className="text-xs uppercase tracking-[0.2em] opacity-100 md:opacity-80 hover:opacity-100 transform transition-transform duration-1000 hover:scale-110 origin-left"
                >
                    [ About ]
                </button>
                <button
                    onClick={() => navigate('/contact')}
                    className="text-xs uppercase tracking-[0.2em] opacity-100 md:opacity-80 hover:opacity-100 transform transition-transform duration-1000 hover:scale-110 origin-left"
                >
                    [ Contact ]
                </button>
            </div>

            {/* Prints Trigger - Desktop (Bottom Center) */}
            <div className="hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-40 text-[#7D7259]">
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

                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 px-4 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg">
                        Purchase Prints
                    </span>
                </button>
            </div>

            {/* Mobile Bottom Bar */}
            <div className={`md:hidden fixed bottom-0 left-0 w-full z-50 py-4 px-6 flex justify-between items-center text-black border-t-0 outline-none transition-colors duration-500 ${isBottom ? 'bg-[#F2F0EB]' : 'backdrop-blur-xl bg-[#F2F0EB]/20 backdrop-brightness-110'}`}>
                <div className="flex gap-6">
                    <button
                        onClick={() => navigate('/about')}
                        className="text-xs uppercase tracking-[0.2em] opacity-100"
                    >
                        [ About ]
                    </button>
                    <button
                        onClick={() => navigate('/contact')}
                        className="text-xs uppercase tracking-[0.2em] opacity-100"
                    >
                        [ Contact ]
                    </button>
                </div>
                <button
                    onClick={() => navigate('/prints')}
                    className="text-xs uppercase tracking-[0.2em] opacity-100"
                >
                    <Sparkles size={16} />
                </button>
            </div>

            {/* Bottom Right: Status / Scroll Indicator */}
            <div className="fixed bottom-6 right-6 md:right-10 z-40 mix-blend-difference text-[#F2F0EB]">
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
                <div ref={bottomSentinelRef} className="w-full h-40 pointer-events-none opacity-0" />
            </main>
            <MapModal
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                coords={isMapOpen && frozenMapData ? frozenMapData.coords : currentCoords}
                title={isMapOpen && frozenMapData ? frozenMapData.title : currentTitle}
            />
        </div>
    );
};

export default MainLayout;

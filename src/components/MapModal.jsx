import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, MapPin } from 'lucide-react';
import { parseCoords } from '../utils/coords';

const MAP_STYLES = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e5e5e5"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dadada"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e5e5e5"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#c9c9c9"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    }
];

const MapModal = ({ isOpen, onClose, coordsString, title }) => {
    const mapRef = useRef(null);
    const googleMapRef = useRef(null);
    const [mapError, setMapError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const parsedCoords = parseCoords(coordsString);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            // Clean up any global listeners if added
        };
    }, [isOpen]);

    // Handle Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen || !parsedCoords) return;

        const initMap = () => {
            try {
                if (!window.google || !window.google.maps) {
                    // Try to load script if not present
                    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
                    if (!apiKey) {
                        console.error("No Google Maps API Key found");
                        setMapError(true);
                        setIsLoading(false);
                        return;
                    }

                    // Check if script is already loading
                    if (!document.querySelector(`script[src*="maps.googleapis.com"]`)) {
                        const script = document.createElement('script');
                        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
                        script.async = true;
                        script.defer = true;
                        script.onload = () => {
                            initMapInstance();
                        };
                        script.onerror = () => {
                            setMapError(true);
                            setIsLoading(false);
                        };
                        document.head.appendChild(script);
                    } else {
                        // Wait for global callback or check interval
                        const interval = setInterval(() => {
                            if (window.google && window.google.maps) {
                                clearInterval(interval);
                                initMapInstance();
                            }
                        }, 100);
                    }
                } else {
                    initMapInstance();
                }
            } catch (err) {
                console.error(err);
                setMapError(true);
                setIsLoading(false);
            }
        };

        const initMapInstance = () => {
            if (!mapRef.current) return;

            setIsLoading(false);

            try {
                const mapOptions = {
                    center: parsedCoords,
                    zoom: 11,
                    styles: MAP_STYLES,
                    disableDefaultUI: true, // Minimal UI
                    zoomControl: true,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                };

                googleMapRef.current = new window.google.maps.Map(mapRef.current, mapOptions);

                const svgMarker = {
                    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                    fillColor: "#7D7259",
                    fillOpacity: 1,
                    strokeWeight: 0,
                    rotation: 0,
                    scale: 2,
                    anchor: new window.google.maps.Point(12, 22),
                };

                new window.google.maps.Marker({
                    position: parsedCoords,
                    map: googleMapRef.current,
                    title: title,
                    icon: svgMarker
                });
            } catch (error) {
                console.error("Map init error:", error);
                setMapError(true);
            }
        };

        initMap();

    }, [isOpen, coordsString]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        className="relative w-full max-w-4xl bg-[#121212] border border-neutral-800 shadow-2xl overflow-hidden rounded-md flex flex-col"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6 border-b border-black/5 bg-white/70 backdrop-blur-md shadow-sm">
                            <div>
                                <h3 className="text-[#2A2A2A] font-sans text-xl md:text-2xl tracking-tight font-light">{title}</h3>
                                <p className="text-xs font-mono text-neutral-600 mt-1">{coordsString}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordsString)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600 hover:text-[#2A2A2A] transition-colors"
                                >
                                    <span>Open Maps</span>
                                    <ExternalLink size={14} />
                                </a>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-black/5 rounded-full transition-colors text-[#2A2A2A]"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Map Container */}
                        <div className="w-full h-[50vh] md:h-[60vh] relative bg-[#212121]">
                            {mapError ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400 gap-4">
                                    <MapPin size={32} />
                                    <p className="text-sm uppercase tracking-widest">Map Unavailable</p>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordsString)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs underline hover:text-white"
                                    >
                                        Open in Google Maps
                                    </a>
                                </div>
                            ) : (
                                <div ref={mapRef} className="w-full h-full" />
                            )}
                        </div>

                        {/* Mobile Footer Action */}
                        <div className="md:hidden p-4 border-t border-neutral-800 bg-[#1A1A1A] flex justify-center">
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordsString)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-[#F2F0EB] transition-colors"
                            >
                                <span>Open in Google Maps</span>
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MapModal;

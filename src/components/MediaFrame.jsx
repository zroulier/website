import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MediaFrame = ({ src, className, isVideo = false }) => {
    return (
        <div
            className={`relative overflow-hidden bg-[#E5E2D9] ${className}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <motion.img
                src={src}
                alt="Drone Footage"
                className="w-full h-auto block"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            />
        </div>
    );
};

export default MediaFrame;

import React from 'react';
import { motion } from 'framer-motion';

const images = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop', // Beach
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1948&auto=format&fit=crop', // Nature
    'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?q=80&w=2070&auto=format&fit=crop', // Hills
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2076&auto=format&fit=crop', // Forest
];

const SlideshowBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
            <motion.div
                className="flex h-full"
                animate={{
                    x: ['0%', '-100%'],
                }}
                transition={{
                    duration: 60,
                    ease: 'linear',
                    repeat: Infinity,
                }}
                style={{ width: `${images.length * 100}%` }}
            >
                {/* Duplicate images to create seamless loop */}
                {[...images, ...images].map((src, index) => (
                    <div
                        key={index}
                        className="w-full h-full flex-shrink-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${src})` }}
                    >
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default SlideshowBackground;

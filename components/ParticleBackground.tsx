'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const DROP_COUNT = 100;

export default function RainStreaks() {
    const dropsRef = useRef<HTMLDivElement[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const animateDrops = () => {
        const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
        const containerHeight = containerRef.current?.offsetHeight || window.innerHeight;

        dropsRef.current.forEach((drop) => {
            const delay = Math.random() * 5;
            const duration = Math.random() * 1.5 + 0.5;
            const left = Math.random() * containerWidth;

            gsap.set(drop, {
                left,
                top: -50,
                opacity: Math.random() * 0.5 + 0.3,
                height: Math.random() * 30 + 10,
            });

            gsap.to(drop, {
                top: containerHeight + 50,
                duration,
                delay,
                repeat: -1,
                ease: 'none',
            });
        });
    };

    useGSAP(() => {
        animateDrops();
    }, []);

    // Resize listener
    useEffect(() => {
        const handleResize = () => {
            gsap.killTweensOf(dropsRef.current); // Stop existing animations
            animateDrops(); // Restart with new sizes
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="rain-container" ref={containerRef}>
            {Array.from({ length: DROP_COUNT }).map((_, i) => (
                <div
                    key={i}
                    className="rain-drop"
                    ref={(el) => {
                        if (el) dropsRef.current[i] = el;
                    }}
                />
            ))}
        </div>
    );
}

'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function RainStreaks() {
    const containerRef = useRef<HTMLDivElement>(null);
    const dropsRef = useRef<HTMLDivElement[]>([]);
    const [dropCount, setDropCount] = useState(100);

    const animateDrops = useCallback(() => {
        const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
        const containerHeight = containerRef.current?.offsetHeight || window.innerHeight;
        const isMobile = window.innerWidth < 768;

        dropsRef.current.forEach((drop) => {
            const delay = Math.random() * 5;
            const duration = Math.random() * (isMobile ? 1 : 1.5) + 0.5;
            const left = Math.random() * containerWidth;

            gsap.set(drop, {
                left,
                top: -50,
                opacity: Math.random() * 0.5 + 0.3,
                height: Math.random() * (isMobile ? 15 : 30) + 10,
            });

            gsap.to(drop, {
                top: containerHeight + 50,
                duration,
                delay,
                repeat: -1,
                ease: 'none',
            });
        });
    }, []);

    useGSAP(() => animateDrops(), [dropCount]);

    useEffect(() => {
        setDropCount(window.innerWidth < 768 ? 40 : 100);

        let timeout: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                setDropCount(window.innerWidth < 768 ? 40 : 100);
                gsap.killTweensOf(dropsRef.current);
                animateDrops();
            }, 200);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [animateDrops]);

    return (
        <div className="rain-container" ref={containerRef}>
            {Array.from({ length: dropCount }, (_, i) => (
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

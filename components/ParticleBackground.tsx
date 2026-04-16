'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function RainStreaks() {
    const containerRef = useRef<HTMLDivElement>(null);
    const dropsRef = useRef<HTMLDivElement[]>([]);
    const [dropCount, setDropCount] = useState(0);

    const animateDrops = useCallback(() => {
        if (!dropsRef.current.length) return;

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

    useGSAP(() => {
        if (!dropCount) return;
        animateDrops();
    }, [dropCount]);

    useEffect(() => {
        const getDropCount = () => {
            const prefersReducedMotion = window.matchMedia(
                '(prefers-reduced-motion: reduce)',
            ).matches;

            if (prefersReducedMotion) {
                return 0;
            }

            const hasLimitedCpu =
                typeof navigator.hardwareConcurrency === 'number' &&
                navigator.hardwareConcurrency <= 4;

            if (window.innerWidth < 768) {
                return hasLimitedCpu ? 4 : 6;
            }

            return hasLimitedCpu ? 16 : 24;
        };

        setDropCount(getDropCount());

        let timeout: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                setDropCount(getDropCount());
                gsap.killTweensOf(dropsRef.current);
                animateDrops();
            }, 200);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            clearTimeout(timeout);
            window.removeEventListener('resize', handleResize);
        };
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

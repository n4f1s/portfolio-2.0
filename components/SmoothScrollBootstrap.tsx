'use client';

import { useEffect } from 'react';

const SmoothScrollBootstrap = () => {
    useEffect(() => {
        let lenis: { destroy: () => void; raf: (_time: number) => void } | null =
            null;
        let rafId = 0;
        let isCancelled = false;

        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;

        if (prefersReducedMotion) {
            return;
        }

        const initializeLenis = async () => {
            const { default: Lenis } = await import('lenis');

            if (isCancelled) return;

            lenis = new Lenis({
                lerp: 0.1,
                duration: 1.4,
            });

            const animate = (time: number) => {
                lenis?.raf(time);
                rafId = window.requestAnimationFrame(animate);
            };

            rafId = window.requestAnimationFrame(animate);
            window.dispatchEvent(new Event('resize'));
        };

        const timer = window.setTimeout(() => {
            void initializeLenis();
        }, 300);

        return () => {
            isCancelled = true;
            window.clearTimeout(timer);

            if (rafId) {
                window.cancelAnimationFrame(rafId);
            }

            lenis?.destroy();
        };
    }, []);

    return null;
};

export default SmoothScrollBootstrap;

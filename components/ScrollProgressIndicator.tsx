'use client';
import React, { useEffect, useRef } from 'react';

const ScrollProgressIndicator = () => {
    const scrollBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let rafId = 0;

        const updateProgress = () => {
            rafId = 0;

            if (scrollBarRef.current) {
                const { scrollHeight, clientHeight } = document.documentElement;
                const scrollableHeight = scrollHeight - clientHeight;

                if (scrollableHeight <= 0) {
                    scrollBarRef.current.style.transform = 'translateY(-100%)';
                    return;
                }

                const scrollY = window.scrollY;
                const scrollProgress = Math.min(
                    Math.max((scrollY / scrollableHeight) * 100, 0),
                    100,
                );

                scrollBarRef.current.style.transform = `translateY(-${
                    100 - scrollProgress
                }%)`;
            }
        };

        const handleScroll = () => {
            if (rafId) return;
            rafId = window.requestAnimationFrame(updateProgress);
        };

        updateProgress();

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });

        return () => {
            if (rafId) {
                window.cancelAnimationFrame(rafId);
            }
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    return (
        <div
            aria-hidden="true"
            className="fixed top-[50svh] right-[2%] -translate-y-1/2 w-1.5 h-[100px] rounded-full bg-background-light overflow-hidden"
        >
            <div
                className="w-full bg-primary rounded-full h-full"
                ref={scrollBarRef}
            ></div>
        </div>
    );
};

export default ScrollProgressIndicator;

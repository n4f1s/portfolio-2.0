'use client'

import SectionTitle from '@/components/SectionTitle';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const LeetCodeStats = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const rafId = window.requestAnimationFrame(() => {
            ScrollTrigger.refresh();
        });

        return () => window.cancelAnimationFrame(rafId);
    }, []);

    useGSAP(
        () => {
            gsap.to('.leetcode-stats', {
                y: 0,
                opacity: 1,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse',
                    invalidateOnRefresh: true,
                },
            });
        },
        { scope: containerRef },
    );
    return (
        <section className="pb-[250px]" id="leet-code-stats">
            <div className="container" ref={containerRef}>
                <SectionTitle title="LeetCode Stats" />

                <div className="leetcode-stats scroll-reveal-bottom flex w-full items-center justify-center">
                    <a
                        href="https://leetcode.com/n4f1s"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-target"
                    >
                        <img
                            src="https://leetcard.jacoblin.cool/n4f1s?theme=chartreuse&ext=heatmap"
                            alt="LeetCode Stats"
                            width="500"
                            onLoad={() => ScrollTrigger.refresh()}
                        />
                    </a>
                </div>

                {/* <HackerRankCard /> */}
            </div>
        </section>
    )
}

export default LeetCodeStats

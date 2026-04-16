'use client'

import SectionTitle from '@/components/SectionTitle';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const LeetCodeStats = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [shouldLoadCard, setShouldLoadCard] = useState(false);

    useEffect(() => {
        const rafId = window.requestAnimationFrame(() => {
            ScrollTrigger.refresh();
        });

        return () => window.cancelAnimationFrame(rafId);
    }, []);

    useEffect(() => {
        const container = containerRef.current;

        if (!container || shouldLoadCard) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                setShouldLoadCard(true);
                observer.disconnect();
            },
            {
                rootMargin: '300px 0px',
            },
        );

        observer.observe(container);

        return () => observer.disconnect();
    }, [shouldLoadCard]);

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
                        {shouldLoadCard ? (
                            <Image
                                src="https://leetcard.jacoblin.cool/n4f1s?theme=chartreuse&ext=heatmap"
                                alt="LeetCode Stats"
                                width={500}
                                height={248}
                                unoptimized
                                sizes="(max-width: 768px) 100vw, 500px"
                                className="h-auto max-w-full"
                                onLoad={() => ScrollTrigger.refresh()}
                            />
                        ) : (
                            <div
                                aria-hidden="true"
                                className="w-full max-w-[500px] aspect-[500/248] rounded-md bg-background-light"
                            />
                        )}
                    </a>
                </div>

                {/* <HackerRankCard /> */}
            </div>
        </section>
    )
}

export default LeetCodeStats

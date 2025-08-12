'use client'

import HackerRankCard from '@/components/HackeRankCard';
import SectionTitle from '@/components/SectionTitle';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useRef } from 'react';


gsap.registerPlugin(useGSAP, ScrollTrigger);


const LeetCodeStats = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 60%',
                    end: 'bottom 50%',
                    toggleActions: 'restart none none reverse',
                    scrub: 1,
                },
            });

            tl.from('.leetcode-stats', {
                y: 50,
                opacity: 0,
                stagger: 0.3,
            });
        },
        { scope: containerRef },
    );

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'bottom 50%',
                    end: 'bottom 20%',
                    scrub: 1,
                },
            });

            tl.to(containerRef.current, {
                y: -150,
                opacity: 0,
            });
        },
        { scope: containerRef },
    );
    return (
        <section className="py-section" id="leet-code-stats">
            <div className="container" ref={containerRef}>
                <SectionTitle title="LeetCode Stats" />

                <div className='items-center flex justify-center w-full leetcode-stats'>
                    <a
                        href="https://leetcode.com/n4f1s"
                        target="_blank"
                        rel="noopener noreferrer"
                        className='cursor-target'
                    >
                        <img
                            src="https://leetcard.jacoblin.cool/n4f1s?theme=chartreuse&ext=heatmap"
                            alt="LeetCode Stats"
                            width="500"
                        />
                    </a>
                </div>

                {/* <HackerRankCard /> */}

            </div>
        </section>
    )
}

export default LeetCodeStats
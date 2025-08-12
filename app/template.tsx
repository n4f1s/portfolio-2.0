'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

export default function Template({ children }: { children: React.ReactNode }) {
    useGSAP(() => {
        const tl = gsap.timeline();

        // Animate the colored panel from bottom to top, then hide the background
        tl.fromTo(
            '.page-transition--inner',
            { yPercent: 100 }, // start fully below viewport
            { yPercent: 0, duration: 0.2 }
        )
            .to('.page-transition--inner', {
                yPercent: -100, // move fully above viewport
                duration: 0.2,
            })
            .to('.page-transition', {
                yPercent: -100, // move background above viewport
                duration: 0.2,
            });
    });

    return (
        <div>
            {/* Background container */}
            <div className="page-transition w-screen h-screen fixed top-0 left-0 bg-background-light z-[5]">
                {/* Primary color panel */}
                <div className="page-transition--inner w-screen h-screen fixed top-0 left-0 bg-primary z-[5]" />
            </div>

            {children}
        </div>
    );
}

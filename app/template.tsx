'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

export default function Template({ children }: { children: React.ReactNode }) {
    useGSAP(() => {
        const shouldAnimate =
            typeof window !== 'undefined' &&
            window.sessionStorage.getItem('page-transition') === 'pending';

        gsap.set('.page-transition', { yPercent: shouldAnimate ? 0 : 100 });
        gsap.set('.page-transition--inner', { yPercent: 100 });

        if (!shouldAnimate) return;

        window.sessionStorage.removeItem('page-transition');

        const tl = gsap.timeline();

        tl.fromTo(
            '.page-transition--inner',
            { yPercent: 100 },
            { yPercent: 0, duration: 0.2 }
        )
            .to('.page-transition--inner', {
                yPercent: -100,
                duration: 0.2,
            })
            .to('.page-transition', {
                yPercent: -100,
                duration: 0.2,
            });
    });

    return (
        <div>
            <div className="page-transition fixed left-0 top-0 z-[5] h-screen w-screen translate-y-full bg-background-light">
                <div className="page-transition--inner fixed left-0 top-0 z-[5] h-screen w-screen translate-y-full bg-primary" />
            </div>

            {children}
        </div>
    );
}

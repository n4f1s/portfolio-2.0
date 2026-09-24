'use client';

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const COLUMNS = 5;
const LAYERS = ['bg-primary', 'bg-background'];
const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';
const DURATION = 340;
const STAGGER = 25;
const LAYER_OFFSET = 55;
// Reveal anyway if the route never changes (failed or cancelled navigation).
const FALLBACK_REVEAL_MS = 6000;

type Phase = 'idle' | 'covering' | 'covered' | 'revealing';

interface Controller {
    cover: (_label?: string) => Promise<void> | null;
}

let controller: Controller | null = null;

/**
 * Covers the screen and resolves once it is fully hidden. Returns null when a
 * transition is already running so callers can ignore repeated clicks.
 */
export const coverPage = (label?: string) =>
    controller ? controller.cover(label) : Promise.resolve();

const nextFrame = () =>
    new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );

const PageTransition = () => {
    const pathname = usePathname();
    const rootRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const labelTextRef = useRef<HTMLSpanElement>(null);
    const phaseRef = useRef<Phase>('idle');
    const coverPromiseRef = useRef<Promise<void> | null>(null);
    const coveredPathRef = useRef<string | null>(null);
    const fallbackRef = useRef<number>();

    const animateBars = (mode: 'cover' | 'reveal') => {
        const bars =
            rootRef.current?.querySelectorAll<HTMLElement>('[data-bar]') ?? [];

        return Promise.all(
            Array.from(bars).map((bar) => {
                const col = Number(bar.dataset.col);
                const layer = Number(bar.dataset.layer);
                // Cover: green leads, dark follows. Reveal: dark leaves first.
                const layerOrder = mode === 'cover' ? layer : 1 - layer;

                bar.getAnimations().forEach((animation) => animation.cancel());
                bar.style.transformOrigin =
                    mode === 'cover' ? 'bottom' : 'top';

                return bar
                    .animate(
                        mode === 'cover'
                            ? [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }]
                            : [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }],
                        {
                            duration: DURATION,
                            delay: col * STAGGER + layerOrder * LAYER_OFFSET,
                            easing: EASE,
                            fill: 'both',
                        },
                    )
                    .finished.catch(() => {});
            }),
        );
    };

    const animateLabel = (mode: 'in' | 'out') => {
        const label = labelRef.current;
        if (!label) return;

        // Continue from wherever an interrupted intro left the label.
        label.getAnimations().forEach((animation) => {
            animation.commitStyles();
            animation.cancel();
        });

        label.animate(
            mode === 'in'
                ? [
                      { transform: 'translateY(110%)', opacity: 0 },
                      { transform: 'translateY(0)', opacity: 1 },
                  ]
                : [{ transform: 'translateY(-110%)', opacity: 0 }],
            {
                duration: mode === 'in' ? 380 : 280,
                delay: mode === 'in' ? LAYER_OFFSET + 120 : 0,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                fill: 'both',
            },
        );
    };

    const reveal = async () => {
        if (phaseRef.current === 'idle' || phaseRef.current === 'revealing')
            return;

        await coverPromiseRef.current;
        if (phaseRef.current !== 'covered') return;

        phaseRef.current = 'revealing';
        window.clearTimeout(fallbackRef.current);

        // Let the new route paint underneath before lifting the curtain.
        await nextFrame();

        animateLabel('out');
        await animateBars('reveal');

        const root = rootRef.current;
        if (root) {
            root.querySelectorAll<HTMLElement>('[data-bar]').forEach((bar) =>
                bar.getAnimations().forEach((animation) => animation.cancel()),
            );
            labelRef.current
                ?.getAnimations()
                .forEach((animation) => animation.cancel());
            labelRef.current?.removeAttribute('style');
            root.style.visibility = 'hidden';
            root.style.pointerEvents = 'none';
        }

        phaseRef.current = 'idle';
        coveredPathRef.current = null;
        coverPromiseRef.current = null;
    };

    const revealRef = useRef(reveal);
    revealRef.current = reveal;

    useEffect(() => {
        const cover = (label?: string) => {
            if (phaseRef.current !== 'idle') return null;

            const root = rootRef.current;
            const prefersReducedMotion = window.matchMedia(
                '(prefers-reduced-motion: reduce)',
            ).matches;

            if (!root || prefersReducedMotion) return Promise.resolve();

            phaseRef.current = 'covering';
            coveredPathRef.current = window.location.pathname;

            if (labelTextRef.current) labelTextRef.current.textContent = label ?? '';
            if (labelRef.current)
                labelRef.current.style.display = label ? '' : 'none';

            root.style.visibility = 'visible';
            root.style.pointerEvents = 'auto';

            if (label) animateLabel('in');

            const promise = animateBars('cover').then(() => {
                phaseRef.current = 'covered';
                fallbackRef.current = window.setTimeout(
                    () => revealRef.current(),
                    FALLBACK_REVEAL_MS,
                );
            });

            coverPromiseRef.current = promise;
            return promise;
        };

        const instance: Controller = { cover };
        controller = instance;

        return () => {
            if (controller === instance) controller = null;
            window.clearTimeout(fallbackRef.current);
        };
    }, []);

    useEffect(() => {
        if (
            coveredPathRef.current !== null &&
            coveredPathRef.current !== pathname
        ) {
            void revealRef.current();
        }
    }, [pathname]);

    return (
        <div
            ref={rootRef}
            aria-hidden="true"
            className="pointer-events-none invisible fixed inset-0 z-[5] overflow-hidden"
        >
            {LAYERS.map((color, layer) => (
                <div key={color} className="absolute inset-0 flex">
                    {Array.from({ length: COLUMNS }, (_, col) => (
                        <div
                            key={col}
                            data-bar
                            data-col={col}
                            data-layer={layer}
                            className={cn(
                                'h-full flex-1 -mr-px scale-y-0 last:mr-0',
                                color,
                            )}
                        />
                    ))}
                </div>
            ))}

            <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-4">
                <span
                    ref={labelRef}
                    className="block translate-y-[110%] text-center font-anton text-[clamp(2.75rem,9vw,8rem)] uppercase leading-none text-foreground opacity-0"
                >
                    <span ref={labelTextRef} />
                    <span className="text-primary">.</span>
                </span>
            </div>
        </div>
    );
};

export default PageTransition;

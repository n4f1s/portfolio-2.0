'use client';

import Button from '@/components/Button';
import SectionTitle from '@/components/SectionTitle';
import {
    LEETCODE_PROFILE_URL,
    type CalendarYear,
    type DifficultyKey,
    type LeetCodeStatsData,
    type TagTier,
} from '@/lib/leetcode';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Image from 'next/image';
import {
    useMemo,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
} from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const DIFFICULTIES: {
    key: DifficultyKey;
    label: string;
    color: string;
    xp: number;
}[] = [
    { key: 'easy', label: 'Easy', color: 'hsl(var(--primary))', xp: 1 },
    { key: 'medium', label: 'Medium', color: 'hsl(42 100% 56%)', xp: 3 },
    { key: 'hard', label: 'Hard', color: 'hsl(352 100% 64%)', xp: 5 },
];

const TIERS: TagTier[] = ['fundamental', 'intermediate', 'advanced'];
const SEGMENTS = 24;
const XP_PER_LEVEL = 100;
const RING_RADII = [108, 88, 68];
const HEAT_LEVELS = [
    'bg-foreground/[0.07]',
    'bg-primary/25',
    'bg-primary/50',
    'bg-primary/75',
    'bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)]',
];
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*<>/';
const DAY = 86_400;

const format = (value: number, decimals = 0) =>
    value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });

const percent = (part: number, whole: number) =>
    whole ? (part / whole) * 100 : 0;

const formatDay = (ts: number) =>
    new Date(ts * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
    });

const heatLevel = (count: number) =>
    count === 0 ? 0 : count <= 2 ? 1 : count <= 6 ? 2 : count <= 12 ? 3 : 4;

function buildYearGrid(calendar: CalendarYear) {
    const start = Date.UTC(calendar.year, 0, 1) / 1000;
    const end = Date.UTC(calendar.year, 11, 31) / 1000;
    const gridStart = start - new Date(start * 1000).getUTCDay() * DAY;

    const weeks: { ts: number; count: number; inYear: boolean }[][] = [];
    const months: (string | null)[] = [];
    let total = 0;
    let bestDay = 0;

    for (let weekStart = gridStart; weekStart <= end; weekStart += 7 * DAY) {
        const week = Array.from({ length: 7 }, (_, d) => {
            const ts = weekStart + d * DAY;
            const inYear = ts >= start && ts <= end;
            const count = inYear ? (calendar.days[String(ts)] ?? 0) : 0;
            total += count;
            bestDay = Math.max(bestDay, count);
            return { ts, count, inYear };
        });

        const firstOfMonth = week.find(
            (day) => day.inYear && new Date(day.ts * 1000).getUTCDate() === 1,
        );
        months.push(
            firstOfMonth
                ? new Date(firstOfMonth.ts * 1000).toLocaleDateString('en-US', {
                      month: 'short',
                      timeZone: 'UTC',
                  })
                : null,
        );
        weeks.push(week);
    }

    return { weeks, months, total, bestDay };
}

/** Renders a number that GSAP counts up from zero during the boot sequence. */
const Count = ({
    value,
    decimals = 0,
    className,
}: {
    value: number;
    decimals?: number;
    className?: string;
}) => (
    <span
        className={cn('lc-count tabular-nums', className)}
        data-value={value}
        data-decimals={decimals}
    >
        {format(value, decimals)}
    </span>
);

const HudCorners = () => (
    <>
        {[
            '-left-px -top-px border-l-2 border-t-2',
            '-right-px -top-px border-r-2 border-t-2',
            '-bottom-px -left-px border-b-2 border-l-2',
            '-bottom-px -right-px border-b-2 border-r-2',
        ].map((position) => (
            <span
                key={position}
                aria-hidden="true"
                className={cn(
                    'lc-corner pointer-events-none absolute h-4 w-4 border-primary',
                    position,
                )}
            />
        ))}
    </>
);

const PanelLabel = ({ children }: { children: string }) => (
    <p
        className="lc-scramble text-xs uppercase tracking-[0.25em] text-muted-foreground"
        data-text={children}
    >
        {children}
    </p>
);

const LeetCodeArena = ({ stats }: { stats: LeetCodeStatsData }) => {
    const sectionRef = useRef<HTMLElement>(null);
    const hudRef = useRef<HTMLDivElement>(null);
    const tiltRef = useRef<HTMLDivElement>(null);
    const centerValueRef = useRef<HTMLSpanElement>(null);
    const centerMetaRef = useRef<HTMLDivElement>(null);
    const burstRef = useRef<HTMLDivElement>(null);
    const comboRef = useRef<HTMLSpanElement>(null);
    const heatPanelRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const heatScrollRef = useRef<HTMLDivElement>(null);

    const booted = useRef(false);
    const reducedMotion = useRef(false);
    const centerValue = useRef(stats.solved);
    const combo = useRef(0);
    const comboReset = useRef<gsap.core.Tween | null>(null);
    const centerTween = useRef<gsap.core.Tween | null>(null);
    const scrambleTweens = useRef(new WeakMap<HTMLElement, gsap.core.Tween>());

    const [hovered, setHovered] = useState<DifficultyKey | null>(null);
    const [locked, setLocked] = useState<DifficultyKey | null>(null);
    const [tier, setTier] = useState<TagTier>('fundamental');
    const [yearIndex, setYearIndex] = useState(0);

    const focus = hovered ?? locked;
    const focusMeta = DIFFICULTIES.find((d) => d.key === focus);

    const xp = DIFFICULTIES.reduce(
        (sum, d) => sum + stats.difficulties[d.key].solved * d.xp,
        0,
    );
    const level = Math.floor(xp / XP_PER_LEVEL) + 1;
    const levelProgress = xp % XP_PER_LEVEL;

    const activeDays = stats.calendar.reduce((sum, y) => sum + y.activeDays, 0);
    const bestStreak = Math.max(0, ...stats.calendar.map((y) => y.bestStreak));
    const acceptance = percent(stats.acceptedSubmissions, stats.submissions);

    const tiles: {
        label: string;
        value: number;
        decimals?: number;
        suffix?: string;
        hint: string;
    }[] = [
        {
            label: 'Acceptance',
            value: acceptance,
            decimals: 1,
            suffix: '%',
            hint: `${format(stats.acceptedSubmissions)} accepted runs`,
        },
        {
            label: 'Submissions',
            value: stats.submissions,
            hint: 'Total attempts fired',
        },
        ...(stats.calendar.length
            ? [
                  {
                      label: 'Active Days',
                      value: activeDays,
                      hint: `Across ${stats.calendar.length} season${stats.calendar.length > 1 ? 's' : ''}`,
                  },
                  {
                      label: 'Best Streak',
                      value: bestStreak,
                      suffix: 'd',
                      hint: 'Days in a row',
                  },
              ]
            : [
                  {
                      label: 'Player XP',
                      value: xp,
                      hint: 'Easy ×1 · Med ×3 · Hard ×5',
                  },
                  {
                      label: 'Level',
                      value: level,
                      hint: `${levelProgress}/${XP_PER_LEVEL} to next`,
                  },
              ]),
    ];

    const tags = stats.tags[tier].slice(0, 6);
    const maxTag = Math.max(1, ...tags.map((t) => t.solved));

    const activeYear = stats.calendar[yearIndex];
    const grid = useMemo(
        () => (activeYear ? buildYearGrid(activeYear) : null),
        [activeYear],
    );

    // ---------------------------------------------------------------- boot
    useGSAP(
        (_, contextSafe) => {
            const q = gsap.utils.selector(sectionRef);
            const mm = gsap.matchMedia();

            mm.add('(prefers-reduced-motion: reduce)', () => {
                reducedMotion.current = true;
                booted.current = true;
                return () => {
                    reducedMotion.current = false;
                };
            });

            mm.add('(prefers-reduced-motion: no-preference)', () => {
                const counts = q('.lc-count') as HTMLElement[];
                const arcs = q('.lc-arc') as unknown as SVGCircleElement[];

                gsap.set(q('.lc-corner'), { scale: 0, opacity: 0 });
                gsap.set(q('.lc-reveal'), { y: 40, opacity: 0 });
                gsap.set(q('.lc-seg-on'), { scaleY: 0, opacity: 0 });
                gsap.set(q('.lc-bar'), { scaleX: 0 });
                gsap.set(q('.lc-cell'), { scale: 0, opacity: 0 });
                gsap.set(arcs, {
                    strokeDashoffset: (_i: number, el: SVGCircleElement) =>
                        Number(el.dataset.circ),
                });
                counts.forEach((el) => {
                    el.textContent = format(0, Number(el.dataset.decimals));
                });

                const tl = gsap.timeline({
                    paused: true,
                    defaults: { ease: 'power3.out' },
                    onComplete: () => {
                        booted.current = true;
                    },
                });

                tl.fromTo(
                    q('.lc-beam'),
                    { yPercent: -100, opacity: 1 },
                    { yPercent: 900, duration: 1.4, ease: 'power2.inOut' },
                )
                    .to(q('.lc-beam'), { opacity: 0, duration: 0.3 }, '>-0.3')
                    .to(
                        q('.lc-corner'),
                        {
                            scale: 1,
                            opacity: 1,
                            duration: 0.5,
                            stagger: 0.03,
                            ease: 'back.out(3)',
                        },
                        0,
                    )
                    .to(
                        q('.lc-reveal'),
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.8,
                            stagger: 0.07,
                            clearProps: 'transform',
                        },
                        0.1,
                    )
                    .add(() => {
                        (q('.lc-scramble') as HTMLElement[]).forEach((el, i) =>
                            scramble(el, 0.6 + i * 0.04),
                        );
                    }, 0.15)
                    .to(
                        arcs,
                        {
                            strokeDashoffset: (_i: number, el: SVGCircleElement) =>
                                Number(el.dataset.offset),
                            duration: 1.8,
                            stagger: 0.15,
                            ease: 'expo.out',
                        },
                        0.35,
                    )
                    .add(() => {
                        counts.forEach((el) => {
                            const target = Number(el.dataset.value);
                            const decimals = Number(el.dataset.decimals);
                            const proxy = { v: 0 };
                            gsap.to(proxy, {
                                v: target,
                                duration: 1.6,
                                ease: 'power3.out',
                                onUpdate: () => {
                                    el.textContent = format(proxy.v, decimals);
                                },
                            });
                        });
                    }, 0.35)
                    .to(
                        q('.lc-seg-on'),
                        {
                            scaleY: 1,
                            opacity: 1,
                            duration: 0.25,
                            stagger: 0.035,
                            ease: 'back.out(3)',
                            clearProps: 'transform,opacity',
                        },
                        0.6,
                    )
                    .to(
                        q('.lc-bar'),
                        {
                            scaleX: 1,
                            duration: 1.1,
                            stagger: 0.06,
                            ease: 'expo.out',
                            clearProps: 'transform',
                        },
                        0.7,
                    )
                    .to(
                        q('.lc-cell'),
                        {
                            scale: 1,
                            opacity: 1,
                            duration: 0.35,
                            ease: 'back.out(2)',
                            stagger: { amount: 1 },
                            clearProps: 'transform,opacity',
                        },
                        0.9,
                    );

                ScrollTrigger.create({
                    trigger: hudRef.current,
                    start: 'top 75%',
                    once: true,
                    onEnter: () => tl.play(),
                });

                // idle radar sweep, only while the HUD is on screen
                const radar = gsap.to(q('.lc-radar'), {
                    rotation: 360,
                    duration: 24,
                    ease: 'none',
                    repeat: -1,
                    paused: true,
                });
                ScrollTrigger.create({
                    trigger: hudRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    onToggle: (self) =>
                        self.isActive ? radar.play() : radar.pause(),
                });

                return () => {
                    counts.forEach((el) => {
                        el.textContent = format(
                            Number(el.dataset.value),
                            Number(el.dataset.decimals),
                        );
                    });
                };
            });

            // 3D tilt on the core panel for mouse users
            mm.add(
                '(pointer: fine) and (prefers-reduced-motion: no-preference)',
                () => {
                    const panel = tiltRef.current;
                    const target = panel?.querySelector('.lc-tilt');
                    if (!panel || !target) return;

                    gsap.set(target, { transformPerspective: 900 });
                    // layered depth so the core floats above the rings while tilting
                    gsap.set(panel.querySelectorAll('.lc-depth-back'), { z: -30 });
                    gsap.set(panel.querySelectorAll('.lc-core, .lc-burst'), { z: 40 });
                    const rotateX = gsap.quickTo(target, 'rotationX', {
                        duration: 0.6,
                        ease: 'power3',
                    });
                    const rotateY = gsap.quickTo(target, 'rotationY', {
                        duration: 0.6,
                        ease: 'power3',
                    });

                    const onMove = contextSafe!((e: PointerEvent) => {
                        const rect = panel.getBoundingClientRect();
                        rotateY(((e.clientX - rect.left) / rect.width - 0.5) * 18);
                        rotateX(-((e.clientY - rect.top) / rect.height - 0.5) * 18);
                    });
                    const onLeave = contextSafe!(() => {
                        rotateX(0);
                        rotateY(0);
                    });

                    panel.addEventListener('pointermove', onMove);
                    panel.addEventListener('pointerleave', onLeave);
                    return () => {
                        panel.removeEventListener('pointermove', onMove);
                        panel.removeEventListener('pointerleave', onLeave);
                    };
                },
            );

            return () => mm.revert();
        },
        { scope: sectionRef },
    );

    const { contextSafe } = useGSAP({ scope: sectionRef });

    const scramble = (el: HTMLElement, duration = 0.5) => {
        const text = el.dataset.text ?? '';
        const proxy = { p: 0 };
        scrambleTweens.current.get(el)?.kill();
        const tween = gsap.to(proxy, {
            p: 1,
            duration,
            ease: 'none',
            onUpdate: () => {
                const revealed = Math.floor(proxy.p * text.length);
                el.textContent = text
                    .split('')
                    .map((char, i) =>
                        i < revealed || char === ' '
                            ? char
                            : SCRAMBLE_CHARS[
                                  Math.floor(Math.random() * SCRAMBLE_CHARS.length)
                              ],
                    )
                    .join('');
            },
            onComplete: () => {
                el.textContent = text;
            },
        });
        scrambleTweens.current.set(el, tween);
    };

    const scrambleWithin = contextSafe((container: HTMLElement) => {
        if (reducedMotion.current) return;
        container
            .querySelectorAll<HTMLElement>('.lc-scramble')
            .forEach((el) => scramble(el, 0.4));
    });

    // ------------------------------------------- core counter on focus change
    useGSAP(
        () => {
            const el = centerValueRef.current;
            const target = focus ? stats.difficulties[focus].solved : stats.solved;
            if (!el || !booted.current) return;

            if (reducedMotion.current) {
                el.textContent = format(target);
                centerValue.current = target;
                return;
            }

            const proxy = { v: centerValue.current };
            centerTween.current?.kill();
            centerTween.current = gsap.to(proxy, {
                v: target,
                duration: 0.7,
                ease: 'power3.out',
                onUpdate: () => {
                    centerValue.current = proxy.v;
                    el.textContent = format(proxy.v);
                },
            });
            gsap.fromTo(
                centerMetaRef.current,
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' },
            );
        },
        { scope: sectionRef, dependencies: [focus] },
    );

    // --------------------------------------------------- skill tree tab swap
    useGSAP(
        () => {
            if (!booted.current || reducedMotion.current) return;
            gsap.fromTo(
                '.lc-tag',
                { x: -20, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.45,
                    stagger: 0.05,
                    ease: 'power3.out',
                    clearProps: 'transform,opacity',
                },
            );
            gsap.fromTo(
                '.lc-tag .lc-bar',
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: 0.9,
                    stagger: 0.05,
                    ease: 'expo.out',
                    clearProps: 'transform',
                },
            );
        },
        { scope: sectionRef, dependencies: [tier] },
    );

    // ------------------------------------------------------ heatmap season swap
    useGSAP(
        () => {
            // on narrow screens, bring the latest activity of the season into view
            const scroller = heatScrollRef.current;
            const cells = scroller?.querySelectorAll<HTMLElement>(
                '[data-count]:not([data-count="0"])',
            );
            const last = cells?.[cells.length - 1];
            if (scroller && last && scroller.scrollWidth > scroller.clientWidth) {
                const lastLeft =
                    last.getBoundingClientRect().left -
                    scroller.getBoundingClientRect().left +
                    scroller.scrollLeft;
                scroller.scrollLeft = Math.max(
                    0,
                    lastLeft - scroller.clientWidth + 48,
                );
            }

            if (!booted.current || reducedMotion.current) return;
            gsap.fromTo(
                '.lc-cell',
                { scale: 0, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.3,
                    ease: 'back.out(2)',
                    stagger: { amount: 0.7 },
                    clearProps: 'transform,opacity',
                },
            );
            if (heatPanelRef.current) scrambleWithin(heatPanelRef.current);
        },
        { scope: sectionRef, dependencies: [yearIndex] },
    );

    // ------------------------------------------------------------ interactions
    const chargeRow = contextSafe((row: HTMLElement) => {
        if (reducedMotion.current) return;
        gsap.fromTo(
            row.querySelectorAll('.lc-seg-on'),
            { opacity: 0.15 },
            {
                opacity: 1,
                duration: 0.2,
                stagger: 0.03,
                overwrite: true,
                clearProps: 'opacity',
            },
        );
    });

    const tapCore = contextSafe(() => {
        const host = burstRef.current;
        const comboEl = comboRef.current;
        if (!host || !comboEl) return;

        const color = focusMeta?.color ?? 'hsl(var(--primary))';
        const gain = focusMeta?.xp ?? 1;
        combo.current += 1;
        comboEl.textContent = `Combo x${combo.current}`;

        comboReset.current?.kill();
        comboReset.current = gsap.delayedCall(1.4, () => {
            combo.current = 0;
            gsap.to(comboEl, { opacity: 0, y: -6, duration: 0.3 });
        });

        if (reducedMotion.current) {
            gsap.set(comboEl, { opacity: 1, y: 0 });
            return;
        }

        gsap.fromTo(
            comboEl,
            { opacity: 1, scale: 1.35, y: 0 },
            { scale: 1, duration: 0.4, ease: 'back.out(3)' },
        );
        gsap.fromTo(
            '.lc-core',
            { scale: 0.9 },
            { scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.35)' },
        );
        gsap.fromTo(
            '.lc-shock',
            { scale: 0.5, opacity: 0.9, borderColor: color },
            { scale: 1.9, opacity: 0, duration: 0.7, ease: 'power2.out' },
        );

        const particles = 14;
        for (let i = 0; i < particles; i++) {
            const dot = document.createElement('span');
            dot.className =
                'pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full';
            dot.style.background = color;
            host.appendChild(dot);

            const angle = (i / particles) * Math.PI * 2 + gsap.utils.random(-0.2, 0.2);
            const distance = gsap.utils.random(80, 140);
            gsap.fromTo(
                dot,
                { x: 0, y: 0, xPercent: -50, yPercent: -50, scale: 1.4, opacity: 1 },
                {
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    scale: 0,
                    opacity: 0,
                    duration: gsap.utils.random(0.6, 1),
                    ease: 'power3.out',
                    onComplete: () => dot.remove(),
                },
            );
        }

        const floater = document.createElement('span');
        floater.className =
            'pointer-events-none absolute left-1/2 top-1/2 font-anton text-2xl whitespace-nowrap';
        floater.style.color = color;
        floater.textContent = `+${gain} XP`;
        host.appendChild(floater);
        gsap.fromTo(
            floater,
            { xPercent: -50, x: gsap.utils.random(-30, 30), y: -40, opacity: 1 },
            {
                y: -120,
                opacity: 0,
                duration: 1,
                ease: 'power2.out',
                onComplete: () => floater.remove(),
            },
        );
    });

    const showCellTooltip = contextSafe((e: ReactPointerEvent) => {
        const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-ts]');
        const panel = heatPanelRef.current;
        const tip = tooltipRef.current;
        if (!cell || !panel || !tip) return;

        const count = Number(cell.dataset.count);
        tip.textContent = `${count} submission${count === 1 ? '' : 's'} · ${formatDay(Number(cell.dataset.ts))}`;

        const cellRect = cell.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const half = tip.offsetWidth / 2;
        const x = gsap.utils.clamp(
            half,
            panelRect.width - half,
            cellRect.left - panelRect.left + cellRect.width / 2,
        );

        gsap.to(tip, {
            x,
            y: cellRect.top - panelRect.top - 8,
            xPercent: -50,
            yPercent: -100,
            opacity: 1,
            duration: 0.15,
            overwrite: true,
        });
    });

    const hideCellTooltip = contextSafe(() => {
        gsap.to(tooltipRef.current, { opacity: 0, duration: 0.15, overwrite: true });
    });

    return (
        <section className="pb-[250px]" id="leet-code-stats" ref={sectionRef}>
            <div className="container">
                <SectionTitle title="LeetCode Stats" />

                <div
                    ref={hudRef}
                    className="relative border border-border bg-background-light/20 p-4 xs:p-6 md:p-10"
                >
                    <HudCorners />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-[0.035]"
                        style={{
                            backgroundImage:
                                'repeating-linear-gradient(0deg, hsl(var(--foreground)) 0 1px, transparent 1px 4px)',
                        }}
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 overflow-hidden"
                    >
                        <div className="lc-beam absolute inset-x-0 top-0 h-[12%] bg-gradient-to-b from-transparent via-primary/15 to-transparent opacity-0" />
                    </div>

                    {/* ---------------------------------------------- header */}
                    <div className="lc-reveal relative flex flex-wrap items-end justify-between gap-6 border-b border-border pb-6">
                        <div className="flex items-center gap-4">
                            <span className="flex h-12 w-12 items-center justify-center border border-primary font-anton text-xl text-primary">
                                P1
                            </span>
                            <div>
                                <PanelLabel>Player</PanelLabel>
                                <p
                                    className="lc-scramble mt-1.5 font-anton text-4xl uppercase leading-none sm:text-5xl"
                                    data-text={stats.username}
                                >
                                    {stats.username}
                                </p>
                            </div>
                        </div>

                        <div className="sm:text-right">
                            <PanelLabel>Global Rank</PanelLabel>
                            <p className="mt-1.5 font-anton text-4xl leading-none sm:text-5xl">
                                <span className="text-primary">#</span>
                                <Count value={stats.ranking} />
                            </p>
                        </div>

                        <p className="flex w-full items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                            </span>
                            {stats.isFallback
                                ? 'Offline snapshot'
                                : 'Live sync · leetcode.com'}
                        </p>
                    </div>

                    {/* ------------------------------------ core + difficulty */}
                    <div className="relative mt-8 grid gap-10 md:grid-cols-12 md:gap-8">
                        <div
                            ref={tiltRef}
                            className="lc-reveal flex flex-col items-center md:col-span-5"
                        >
                            <div className="lc-tilt relative aspect-square w-full max-w-[300px] [transform-style:preserve-3d]">
                                <div
                                    aria-hidden="true"
                                    className="lc-depth-back pointer-events-none absolute inset-0 overflow-hidden rounded-full"
                                >
                                    <svg
                                        viewBox="0 0 240 240"
                                        className="lc-radar h-full w-full text-foreground/25"
                                    >
                                        {Array.from({ length: 60 }, (_, i) => (
                                            <line
                                                key={i}
                                                x1="120"
                                                y1="1"
                                                x2="120"
                                                y2={i % 5 === 0 ? 8 : 4}
                                                stroke={
                                                    i === 0
                                                        ? 'hsl(var(--primary))'
                                                        : 'currentColor'
                                                }
                                                strokeWidth={i === 0 ? 2 : 1}
                                                transform={`rotate(${i * 6} 120 120)`}
                                            />
                                        ))}
                                    </svg>
                                </div>

                                <svg
                                    viewBox="0 0 240 240"
                                    className="pointer-events-none absolute inset-[6%] h-[88%] w-[88%] -rotate-90 overflow-visible"
                                    role="img"
                                    aria-label={DIFFICULTIES.map(
                                        (d) =>
                                            `${d.label} ${stats.difficulties[d.key].solved} of ${stats.difficulties[d.key].total}`,
                                    ).join(', ')}
                                >
                                    {DIFFICULTIES.map((d, i) => {
                                        const r = RING_RADII[i];
                                        const circ = 2 * Math.PI * r;
                                        const { solved, total } =
                                            stats.difficulties[d.key];
                                        const offset =
                                            circ * (1 - Math.min(1, solved / (total || 1)));
                                        const dimmed = focus && focus !== d.key;

                                        return (
                                            <g key={d.key}>
                                                <circle
                                                    cx="120"
                                                    cy="120"
                                                    r={r}
                                                    fill="none"
                                                    stroke="hsl(var(--foreground))"
                                                    strokeOpacity={0.08}
                                                    strokeWidth={12}
                                                />
                                                <circle
                                                    className="lc-arc transition-[opacity,filter] duration-300"
                                                    data-circ={circ}
                                                    data-offset={offset}
                                                    cx="120"
                                                    cy="120"
                                                    r={r}
                                                    fill="none"
                                                    stroke={d.color}
                                                    strokeWidth={12}
                                                    strokeLinecap="round"
                                                    strokeDasharray={circ}
                                                    strokeDashoffset={offset}
                                                    style={{
                                                        opacity: dimmed ? 0.15 : 1,
                                                        filter:
                                                            focus === d.key
                                                                ? `drop-shadow(0 0 6px ${d.color})`
                                                                : undefined,
                                                    }}
                                                />
                                            </g>
                                        );
                                    })}
                                </svg>

                                <div
                                    ref={burstRef}
                                    className="lc-burst pointer-events-none absolute inset-0"
                                >
                                    <span className="lc-shock absolute inset-[27%] rounded-full border-2 border-primary opacity-0" />
                                </div>

                                <button
                                    type="button"
                                    onClick={tapCore}
                                    aria-label="Tap the core to gain XP"
                                    className="lc-core cursor-target absolute inset-[27%] flex flex-col items-center justify-center rounded-full outline-none transition-colors hover:bg-foreground/[0.04] focus-visible:ring-2 focus-visible:ring-primary"
                                >
                                    <span
                                        ref={centerValueRef}
                                        className="lc-count font-anton text-5xl leading-none tabular-nums sm:text-6xl"
                                        data-value={stats.solved}
                                        data-decimals={0}
                                        style={{ color: focusMeta?.color }}
                                    >
                                        {format(stats.solved)}
                                    </span>
                                    <div
                                        ref={centerMetaRef}
                                        className="mt-1.5 text-center text-[11px] uppercase leading-tight tracking-[0.2em] text-muted-foreground"
                                    >
                                        {focusMeta ? focusMeta.label : 'Solved'}
                                        <br />/{' '}
                                        {format(
                                            focus
                                                ? stats.difficulties[focus].total
                                                : stats.totalQuestions,
                                        )}
                                    </div>
                                </button>

                                <span
                                    ref={comboRef}
                                    aria-live="polite"
                                    className="pointer-events-none absolute -top-2 inset-x-0 text-center whitespace-nowrap font-anton text-xl uppercase tracking-wider text-primary opacity-0"
                                />
                            </div>

                            <p className="mt-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                                <span className="text-primary motion-safe:animate-pulse">
                                    ▸
                                </span>{' '}
                                Tap the core
                            </p>

                            <div className="mt-6 w-full max-w-[340px]">
                                <div className="flex items-end justify-between">
                                    <p className="font-anton text-2xl uppercase leading-none">
                                        Lvl <Count value={level} className="text-primary" />
                                    </p>
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                        {levelProgress}/{XP_PER_LEVEL} XP
                                    </p>
                                </div>
                                <div className="mt-2.5 h-2 overflow-hidden bg-foreground/10">
                                    <div
                                        className="lc-bar h-full origin-left bg-primary"
                                        style={{ width: `${levelProgress}%` }}
                                    />
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    {format(xp)} XP earned · Easy ×1 · Medium ×3 ·
                                    Hard ×5
                                </p>
                            </div>
                        </div>

                        <div
                            className="flex flex-col justify-center gap-4 md:col-span-7"
                            onMouseLeave={() => setHovered(null)}
                        >
                            <div className="lc-reveal flex items-center justify-between">
                                <PanelLabel>Select Difficulty</PanelLabel>
                                {locked && (
                                    <button
                                        type="button"
                                        onClick={() => setLocked(null)}
                                        className="cursor-target text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        Reset ×
                                    </button>
                                )}
                            </div>

                            {DIFFICULTIES.map((d) => {
                                const stat = stats.difficulties[d.key];
                                const cleared = percent(stat.solved, stat.total);
                                const filled =
                                    stat.solved > 0
                                        ? Math.max(1, Math.round((cleared / 100) * SEGMENTS))
                                        : 0;
                                const isActive = focus === d.key;

                                return (
                                    <button
                                        key={d.key}
                                        type="button"
                                        aria-pressed={locked === d.key}
                                        aria-label={`${d.label}: ${stat.solved} of ${stat.total} solved`}
                                        onClick={() =>
                                            setLocked((prev) =>
                                                prev === d.key ? null : d.key,
                                            )
                                        }
                                        onMouseEnter={(e) => {
                                            setHovered(d.key);
                                            chargeRow(e.currentTarget);
                                        }}
                                        onFocus={() => setHovered(d.key)}
                                        onBlur={() => setHovered(null)}
                                        className={cn(
                                            'lc-reveal cursor-target group relative w-full border border-border p-4 text-left outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-primary sm:p-5',
                                            isActive && 'bg-foreground/[0.03]',
                                        )}
                                        style={{
                                            borderColor: isActive ? d.color : undefined,
                                        }}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-y-0 left-0 w-1 origin-top transition-transform duration-300"
                                            style={{
                                                background: d.color,
                                                transform: `scaleY(${isActive ? 1 : 0})`,
                                            }}
                                        />
                                        <span className="flex items-end justify-between gap-4">
                                            <span
                                                className="font-anton text-3xl uppercase leading-none sm:text-4xl"
                                                style={{ color: d.color }}
                                            >
                                                {d.label}
                                            </span>
                                            <span className="font-anton text-2xl leading-none sm:text-3xl">
                                                <Count value={stat.solved} />
                                                <span className="text-base text-muted-foreground">
                                                    {' '}
                                                    / {format(stat.total)}
                                                </span>
                                            </span>
                                        </span>

                                        <span
                                            aria-hidden="true"
                                            className="mt-4 flex gap-[3px]"
                                        >
                                            {Array.from({ length: SEGMENTS }, (_, i) => (
                                                <span
                                                    key={i}
                                                    className={cn(
                                                        'h-2.5 flex-1 origin-bottom',
                                                        i < filled
                                                            ? 'lc-seg-on'
                                                            : 'bg-foreground/10',
                                                    )}
                                                    style={
                                                        i < filled
                                                            ? { background: d.color }
                                                            : undefined
                                                    }
                                                />
                                            ))}
                                        </span>

                                        <span className="mt-3 flex justify-between text-xs uppercase tracking-[0.15em] text-muted-foreground">
                                            <span>{format(cleared, 1)}% cleared</span>
                                            <span>
                                                {format(
                                                    percent(
                                                        stat.acceptedSubmissions,
                                                        stat.submissions,
                                                    ),
                                                    1,
                                                )}
                                                % accuracy
                                            </span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ----------------------------------------------- tiles */}
                    <div className="relative mt-10 grid grid-cols-2 !gap-3 sm:!gap-4 lg:grid-cols-4">
                        {tiles.map((tile) => (
                            <div
                                key={tile.label}
                                onMouseEnter={(e) => scrambleWithin(e.currentTarget)}
                                className="lc-reveal cursor-target group relative border border-border p-4 transition-colors duration-300 hover:border-foreground/30 sm:p-5"
                            >
                                <PanelLabel>{tile.label}</PanelLabel>
                                <p className="mt-3 font-anton text-3xl leading-none sm:text-4xl">
                                    <Count value={tile.value} decimals={tile.decimals} />
                                    {tile.suffix && (
                                        <span className="text-primary">{tile.suffix}</span>
                                    )}
                                </p>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    {tile.hint}
                                </p>
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100"
                                />
                            </div>
                        ))}
                    </div>

                    {/* ------------------------------------ skills + loadout */}
                    <div className="relative mt-10 grid !gap-10 md:grid-cols-12 md:!gap-8">
                        <div className="lc-reveal md:col-span-8">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <PanelLabel>Skill Tree</PanelLabel>
                                <div
                                    role="group"
                                    aria-label="Skill tier"
                                    className="flex w-full border border-border xs:w-auto"
                                >
                                    {TIERS.map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            aria-pressed={tier === t}
                                            onClick={() => setTier(t)}
                                            className={cn(
                                                'cursor-target flex-1 px-2 py-1.5 text-[10px] uppercase tracking-[0.1em] outline-none xs:px-3 xs:text-[11px] xs:tracking-[0.15em] transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
                                                tier === t
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'text-muted-foreground hover:text-foreground',
                                            )}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <ul className="mt-5 space-y-3.5">
                                {tags.map((tag) => (
                                    <li key={`${tier}-${tag.name}`} className="lc-tag">
                                        <div className="flex justify-between text-sm">
                                            <span>{tag.name}</span>
                                            <span className="font-anton tabular-nums text-primary">
                                                {tag.solved}
                                            </span>
                                        </div>
                                        <div className="mt-1.5 h-1.5 bg-foreground/10">
                                            <div
                                                className="lc-bar h-full origin-left bg-primary"
                                                style={{
                                                    width: `${(tag.solved / maxTag) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="lc-reveal flex flex-col gap-8 md:col-span-4">
                            <div>
                                <PanelLabel>Main Weapon</PanelLabel>
                                {stats.languages[0] && (
                                    <>
                                        <p className="mt-3 font-anton text-4xl uppercase leading-none">
                                            {stats.languages[0].name}
                                        </p>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {stats.languages[0].solved} problems slain
                                            {stats.languages.length > 1 &&
                                                ` · also ${stats.languages
                                                    .slice(1, 3)
                                                    .map((l) => l.name)
                                                    .join(', ')}`}
                                        </p>
                                    </>
                                )}
                            </div>

                            {stats.badges.length > 0 && (
                                <div>
                                    <PanelLabel>Achievements</PanelLabel>
                                    <ul className="mt-3 flex flex-wrap gap-3">
                                        {stats.badges.map((badge) => (
                                            <li
                                                key={badge.name}
                                                className="cursor-target group flex items-center gap-3 border border-border py-2 pl-2 pr-4 transition-colors hover:border-primary"
                                            >
                                                <Image
                                                    src={badge.icon}
                                                    alt=""
                                                    width={44}
                                                    height={44}
                                                    unoptimized
                                                    className="h-11 w-11 object-contain transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110"
                                                />
                                                <span className="text-sm leading-tight">
                                                    {badge.name}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ---------------------------------------------- heatmap */}
                    {grid && activeYear && (
                        <div
                            ref={heatPanelRef}
                            className="lc-reveal relative mt-10 border-t border-border pt-8"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <PanelLabel>Activity Log</PanelLabel>
                                {stats.calendar.length > 1 && (
                                    <div
                                        role="group"
                                        aria-label="Season"
                                        className="flex border border-border"
                                    >
                                        {stats.calendar.map((y, i) => (
                                            <button
                                                key={y.year}
                                                type="button"
                                                aria-pressed={yearIndex === i}
                                                onClick={() => setYearIndex(i)}
                                                className={cn(
                                                    'cursor-target px-3 py-1.5 font-anton text-sm tracking-wider outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
                                                    yearIndex === i
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'text-muted-foreground hover:text-foreground',
                                                )}
                                            >
                                                {y.year}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 font-anton text-xl uppercase leading-none">
                                <p>
                                    <span className="text-primary">{format(grid.total)}</span>{' '}
                                    <span className="font-roboto-flex text-xs tracking-[0.2em] text-muted-foreground">
                                        submissions
                                    </span>
                                </p>
                                <p>
                                    <span className="text-primary">{activeYear.activeDays}</span>{' '}
                                    <span className="font-roboto-flex text-xs tracking-[0.2em] text-muted-foreground">
                                        active days
                                    </span>
                                </p>
                                <p>
                                    <span className="text-primary">{activeYear.bestStreak}</span>{' '}
                                    <span className="font-roboto-flex text-xs tracking-[0.2em] text-muted-foreground">
                                        best streak
                                    </span>
                                </p>
                                <p>
                                    <span className="text-primary">{grid.bestDay}</span>{' '}
                                    <span className="font-roboto-flex text-xs tracking-[0.2em] text-muted-foreground">
                                        best day
                                    </span>
                                </p>
                            </div>

                            <div
                                ref={heatScrollRef}
                                className="mt-5 overflow-x-auto pb-2"
                                onScroll={hideCellTooltip}
                            >
                                <div
                                    role="img"
                                    aria-label={`${format(grid.total)} submissions across ${activeYear.activeDays} active days in ${activeYear.year}`}
                                    className="min-w-[680px]"
                                    onPointerOver={showCellTooltip}
                                    onPointerLeave={hideCellTooltip}
                                >
                                    <div aria-hidden="true" className="mb-1.5 flex gap-[3px]">
                                        {grid.months.map((month, i) => (
                                            <span
                                                key={i}
                                                className="h-3 flex-1 overflow-visible whitespace-nowrap text-[10px] uppercase leading-none tracking-wider text-muted-foreground"
                                            >
                                                {month}
                                            </span>
                                        ))}
                                    </div>
                                    <div aria-hidden="true" className="flex gap-[3px]">
                                        {grid.weeks.map((week, w) => (
                                            <div key={w} className="flex flex-1 flex-col gap-[3px]">
                                                {week.map((day) =>
                                                    day.inYear ? (
                                                        <span
                                                            key={`${activeYear.year}-${day.ts}`}
                                                            data-ts={day.ts}
                                                            data-count={day.count}
                                                            className={cn(
                                                                'lc-cell relative aspect-square w-full rounded-[2px] transition-transform duration-150 hover:z-10 hover:scale-150',
                                                                HEAT_LEVELS[heatLevel(day.count)],
                                                            )}
                                                        />
                                                    ) : (
                                                        <span
                                                            key={day.ts}
                                                            className="aspect-square w-full"
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                                Less
                                {HEAT_LEVELS.map((cls) => (
                                    <span
                                        key={cls}
                                        className={cn('h-2.5 w-2.5 rounded-[2px]', cls)}
                                    />
                                ))}
                                More
                            </div>

                            <div
                                ref={tooltipRef}
                                role="presentation"
                                className="pointer-events-none absolute left-0 top-0 z-20 whitespace-nowrap border border-primary bg-background px-2.5 py-1.5 text-xs opacity-0"
                            />
                        </div>
                    )}

                    {/* ----------------------------------------------- footer */}
                    <div className="lc-reveal relative mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-border pt-8">
                        <p className="max-w-[420px] text-sm text-muted-foreground">
                            Grinding data structures & algorithms one problem at a
                            time. Stats refresh automatically from LeetCode.
                        </p>
                        <Button
                            as="link"
                            href={LEETCODE_PROFILE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="primary"
                            className="cursor-target max-xs:w-full"
                        >
                            Open Profile
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LeetCodeArena;

'use client';
import SectionTitle from '@/components/SectionTitle';
import { PROJECTS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import Project from './Project';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ProjectList = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageContainer = useRef<HTMLDivElement>(null);
    const containerRectRef = useRef<DOMRect | null>(null);
    const imageHeightRef = useRef(0);
    const [selectedProject, setSelectedProject] = useState<string | null>(
        PROJECTS[0].slug,
    );

    // update imageRef.current href based on the cursor hover position
    // also update image position
    useGSAP(
        (context, contextSafe) => {
            const container = containerRef.current;
            const previewImage = imageContainer.current;

            if (!container || !previewImage || !contextSafe) return;

            if (window.innerWidth < 768) {
                setSelectedProject(null);
                return;
            }

            const yTo = gsap.quickTo(previewImage, 'y', {
                duration: 0.35,
                ease: 'power3.out',
            });
            const opacityTo = gsap.quickTo(previewImage, 'opacity', {
                duration: 0.2,
                ease: 'power2.out',
            });

            const updateMeasurements = () => {
                containerRectRef.current = container.getBoundingClientRect();
                imageHeightRef.current = previewImage.offsetHeight;
            };

            updateMeasurements();

            let rafId = 0;

            const handlePointerMove = contextSafe((e: PointerEvent) => {
                if (window.innerWidth < 768) {
                    setSelectedProject(null);
                    return;
                }

                if (rafId) {
                    window.cancelAnimationFrame(rafId);
                }

                rafId = window.requestAnimationFrame(() => {
                    const containerRect = containerRectRef.current;
                    if (!containerRect) return;

                    const offsetTop = e.clientY - containerRect.top;
                    yTo(offsetTop - imageHeightRef.current / 2);
                    opacityTo(1);
                });
            });

            const handlePointerLeave = contextSafe(() => {
                opacityTo(0);
            });

            const handleResize = () => {
                updateMeasurements();
            };

            container.addEventListener('pointermove', handlePointerMove as EventListener, {
                passive: true,
            });
            container.addEventListener(
                'pointerenter',
                handleResize as EventListener,
            );
            container.addEventListener(
                'pointerleave',
                handlePointerLeave as EventListener,
            );
            window.addEventListener('resize', handleResize, { passive: true });

            return () => {
                if (rafId) {
                    window.cancelAnimationFrame(rafId);
                }
                container.removeEventListener(
                    'pointermove',
                    handlePointerMove as EventListener,
                );
                container.removeEventListener(
                    'pointerenter',
                    handleResize as EventListener,
                );
                container.removeEventListener(
                    'pointerleave',
                    handlePointerLeave as EventListener,
                );
                window.removeEventListener('resize', handleResize);
            };
        },
        { scope: containerRef },
    );

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'top 80%',
                    toggleActions: 'restart none none reverse',
                    scrub: 1,
                },
            });

            tl.from(containerRef.current, {
                y: 150,
                opacity: 0,
            });
        },
        { scope: containerRef },
    );

    const handleMouseEnter = (slug: string) => {
        if (window.innerWidth < 768) {
            setSelectedProject(null);
            return;
        }

        setSelectedProject(slug);
    };

    return (
        <section className="pb-section" id="selected-projects">
            <div className="container">
                <SectionTitle title="Selected Work" />

                <div className="group/projects relative" ref={containerRef}>
                    {selectedProject !== null && (
                        <div
                            className="max-md:hidden absolute right-0 top-0 z-[1] pointer-events-none w-[200px] xl:w-[350px] aspect-[3/4] overflow-hidden opacity-0"
                            ref={imageContainer}
                        >
                            {PROJECTS.map((project) => (
                                <Image
                                    src={project.thumbnail}
                                    alt="Project"
                                    width={400}
                                    height={500}
                                    className={cn(
                                        'absolute inset-0 transition-all duration-500 w-full h-full object-cover',
                                        {
                                            'opacity-0':
                                                project.slug !==
                                                selectedProject,
                                        },
                                    )}
                                    key={project.slug}
                                />
                            ))}
                        </div>
                    )}

                    <div className="flex flex-col max-md:gap-10">
                        {PROJECTS.map((project, index) => (
                            <Project
                                index={index}
                                project={project}
                                selectedProject={selectedProject}
                                onMouseEnter={handleMouseEnter}
                                key={project.slug}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectList;

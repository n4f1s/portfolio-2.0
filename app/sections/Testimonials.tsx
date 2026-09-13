'use client';
import SectionTitle from '@/components/SectionTitle';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TESTIMONIALS = [
    {
        quote: "Musfiqur consistently delivered high-quality code on complex feature work. His ability to bridge frontend and backend made him invaluable on cross-functional projects.",
        name: 'Sarah Chen',
        role: 'Engineering Manager',
        company: 'WeGro Global',
    },
    {
        quote: "One of the most reliable developers I've worked with. He takes ownership of his features end-to-end and is always willing to help the team when blockers arise.",
        name: 'James Wilson',
        role: 'Senior Backend Engineer',
        company: 'Brandclamp Inc.',
    },
    {
        quote: "His attention to performance and user experience elevated the quality of every project he touched. He doesn't just ship—he optimizes.",
        name: 'Alex Rivera',
        role: 'Product Designer',
        company: 'Evonix Ventures',
    },
];

const Testimonials = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            gsap.from('.testimonial-card', {
                y: 100,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                stagger: 0.2,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse',
                },
            });
        },
        { scope: containerRef },
    );

    return (
        <section className="py-section" id="testimonials">
            <div className="container" ref={containerRef}>
                <SectionTitle title="Testimonials" />

                <div className="grid md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((testimonial, index) => (
                        <div
                            key={index}
                            className="testimonial-card p-8 border border-border/50 bg-card/30 backdrop-blur-sm"
                        >
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                &ldquo;{testimonial.quote}&rdquo;
                            </p>
                            <div className="mt-6 pt-6 border-t border-border/30">
                                <p className="text-xl font-medium">
                                    {testimonial.name}
                                </p>
                                <p className="text-muted-foreground">
                                    {testimonial.role}, {testimonial.company}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
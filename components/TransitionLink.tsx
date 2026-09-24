'use client';
import { coverPage } from '@/components/PageTransition';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ComponentProps } from 'react';

interface Props extends ComponentProps<typeof Link> {
    /** Title shown on the curtain while the next page loads. */
    label?: string;
}

const TransitionLink = ({ href, onClick, children, label, ...rest }: Props) => {
    const router = useRouter();

    const handleLinkClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);

        if (e.defaultPrevented || typeof href !== 'string') return;

        const shouldUseDefaultNavigation =
            e.button !== 0 ||
            e.metaKey ||
            e.ctrlKey ||
            e.shiftKey ||
            e.altKey ||
            e.currentTarget.target === '_blank' ||
            e.currentTarget.hasAttribute('download');

        if (shouldUseDefaultNavigation) return;

        const url = new URL(href, window.location.href);

        // External links and same-page hash links keep Link's own behavior.
        if (
            url.origin !== window.location.origin ||
            url.pathname === window.location.pathname
        )
            return;

        e.preventDefault();

        const covered = coverPage(label);
        if (!covered) return;

        router.prefetch(href);
        await covered;
        router.push(href);
    };

    return (
        <Link href={href} {...rest} onClick={handleLinkClick}>
            {children}
        </Link>
    );
};

export default TransitionLink;

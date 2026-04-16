"use client"

import { useState, useEffect } from 'react';
import TargetCursor from './TargetCursor';

const Cursor = () => {
    const [isWide, setIsWide] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(
            '(min-width: 768px) and (hover: hover) and (pointer: fine)',
        );

        const syncCursorAvailability = () => {
            setIsWide(mediaQuery.matches);
        };

        syncCursorAvailability();
        mediaQuery.addEventListener('change', syncCursorAvailability);

        return () =>
            mediaQuery.removeEventListener('change', syncCursorAvailability);
    }, []);

    if (!isWide) return null;

    return <TargetCursor />;
};

export default Cursor;

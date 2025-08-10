"use client"

import { useState, useEffect } from 'react';
import TargetCursor from './TargetCursor';

const Cursor = () => {
    const [isWide, setIsWide] = useState(false);

    useEffect(() => {
        const checkWidth = () => setIsWide(window.innerWidth >= 768);
        checkWidth(); // Initial check
        window.addEventListener('resize', checkWidth);
        return () => window.removeEventListener('resize', checkWidth);
    }, []);

    if (!isWide) return null;

    return <TargetCursor />;
};

export default Cursor;
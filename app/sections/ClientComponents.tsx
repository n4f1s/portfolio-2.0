"use client";

import dynamic from "next/dynamic";
import { startTransition, useEffect, useState } from "react";
import Skills from "./Skills";

// Lazy-load heavy components
const Cursor = dynamic(() => import("../../components/Cursor"), { ssr: false });
const ScrollProgressIndicator = dynamic(
    () => import("../../components/ScrollProgressIndicator"),
    { ssr: false }
);
const ParticleBackground = dynamic(
    () => import("../../components/ParticleBackground"),
    { ssr: false }
);
const StickyEmail = dynamic(() => import("./StickyEmail"), { ssr: false });


const ProjectList = dynamic(() => import('./ProjectList'), {
    ssr: false,
    loading: () => <p className="text-center p-40">Loading selected work...</p>,
});
export default function ClientComponents() {
    const [showUtilityUi, setShowUtilityUi] = useState(false);
    const [showAmbientUi, setShowAmbientUi] = useState(false);

    useEffect(() => {
        const enableUtilityUi = () => {
            startTransition(() => {
                setShowUtilityUi(true);
            });
        };

        const enableAmbientUi = () => {
            startTransition(() => {
                setShowAmbientUi(true);
            });
        };

        const utilityTimer = window.setTimeout(enableUtilityUi, 250);
        const ambientTimer = window.setTimeout(enableAmbientUi, 1200);

        window.addEventListener("pointerdown", enableUtilityUi, {
            once: true,
            passive: true,
        });
        window.addEventListener("keydown", enableUtilityUi, { once: true });

        return () => {
            window.clearTimeout(utilityTimer);
            window.clearTimeout(ambientTimer);
            window.removeEventListener("pointerdown", enableUtilityUi);
            window.removeEventListener("keydown", enableUtilityUi);
        };
    }, []);

    return (
        <>
            {showUtilityUi && (
                <>
                    <ScrollProgressIndicator />
                    <StickyEmail />
                </>
            )}
            {showAmbientUi && (
                <>
                    <Cursor />
                    <ParticleBackground />
                </>
            )}
        </>
    );
}

export function ClientProjectList() {
    return <ProjectList />;
}

export function ClientSkills() {
    return <Skills />;
}

"use client";

import dynamic from "next/dynamic";
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
    return (
        <>
            <Cursor />
            <ScrollProgressIndicator />
            <ParticleBackground />
            <StickyEmail />
        </>
    );
}

export function ClientProjectList() {
    return <ProjectList />;
}

export function ClientSkills() {
    return <Skills />;
}

import type { Metadata } from 'next';
import { Anton, Roboto_Flex } from 'next/font/google';
import { ReactLenis } from 'lenis/react';

import 'lenis/dist/lenis.css';
import './globals.css';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ClientComponents from './sections/ClientComponents';
import Preloader from '@/components/Preloader';



const antonFont = Anton({
    weight: '400',
    style: 'normal',
    subsets: ['latin'],
    variable: '--font-anton',
});

const robotoFlex = Roboto_Flex({
    weight: ['100', '400', '500', '600', '700', '800'],
    style: 'normal',
    subsets: ['latin'],
    variable: '--font-roboto-flex',
});

export const metadata: Metadata = {
    title: 'Portfolio - Musfiqur Rahman',
    description: 'Personal portfolio of Musfiqur Rahman',
    metadataBase: new URL('https://musfiqur.com'),

    openGraph: {
        title: 'Portfolio - Musfiqur Rahman',
        description: 'Personal portfolio of Musfiqur Rahman',
        url: 'https://musfiqur.com',
        siteName: 'Musfiqur',
        images: [
            {
                url: '/preview.png',
                width: 1200,
                height: 630,
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Portfolio - Musfiqur Rahman',
        description: 'Personal portfolio of Musfiqur Rahman',
        images: ['/preview.png'],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${antonFont.variable} ${robotoFlex.variable} antialiased`}
            >
                <ReactLenis
                    root
                    options={{
                        lerp: 0.1,
                        duration: 1.4,
                    }}
                >
                    <Navbar />
                    <main>{children}</main>
                    <Footer />

                    <Preloader />
                    <ClientComponents />
                </ReactLenis>
            </body>
        </html>
    );
}

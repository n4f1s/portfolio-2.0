import { IProject } from '@/types';

export const GENERAL_INFO = {
    email: 'hello@musfiqur.com ',

    emailSubject: 'Software engineering role',
    emailBody: "Hi Musfiqur, I'd like to discuss a software engineering role.",

    oldPortfolio: 'https://v-1.musfiqur.com/',
};

export const SOCIAL_LINKS = [
    { name: 'github', url: 'https://github.com/n4f1s' },
    {
        name: 'linkedin',
        url: 'https://www.linkedin.com/in/musfiqur-rahman-8b8193265/',
    },
    { name: 'leetcode', url: 'https://leetcode.com/u/n4f1s/' },
    { name: 'facebook', url: 'https://www.facebook.com/Musfiq.Nafis/' },
    { name: 'Portfolio Archive', url: GENERAL_INFO.oldPortfolio },
];

export const hackerRankData = {
    username: 'musfiqurok',
    stats: {
        rank: 396389,
        problemsSolved: 290,
        totalProblems: 3647,
        easy: { solved: 186, total: 890 },
        medium: { solved: 95, total: 1897 },
        hard: { solved: 9, total: 860 },
    },
};

export const MY_STACK = {
    frontend: [
        { name: 'JavaScript', icon: '/logo/js.png' },
        { name: 'TypeScript', icon: '/logo/ts.png' },
        { name: 'React', icon: '/logo/react.png' },
        { name: 'Next.js', icon: '/logo/next.png' },
        { name: 'Redux Toolkit', icon: '/logo/redux.png' },
        { name: 'Tailwind CSS', icon: '/logo/tailwind.png' },
        { name: 'Framer Motion', icon: '/logo/framer-motion.png' },
        { name: 'Three.js', icon: '/logo/three.webp' },
        { name: 'GSAP', icon: '/logo/gsap.png' },
        { name: 'WordPress', icon: '/logo/wordpress.png' },
        { name: 'React Native', icon: '/logo/reactnative.png' },
    ],
    backend: [
        { name: 'Node.js', icon: '/logo/node.png' },
        { name: 'Fastify', icon: '/logo/fastify.webp' },
        { name: 'REST APIs', icon: '/logo/restapi.png' },
        { name: 'Express.js', icon: '/logo/express.png' },
    ],
    database: [
        { name: 'PostgreSQL', icon: '/logo/postgresql.webp' },
        { name: 'MongoDB', icon: '/logo/mongodb.svg' },
        { name: 'Prisma', icon: '/logo/prisma.png' },
        { name: 'Redis', icon: '/logo/redis.png' },
        { name: 'Supabase', icon: '/logo/supabase.webp' },
        { name: 'Neon', icon: '/logo/neon.png' },
    ],
    tools: [
        { name: 'GitHub', icon: '/logo/github.png' },
        { name: 'Docker', icon: '/logo/docker.webp' },
        { name: 'AWS', icon: '/logo/aws.png' },
        { name: 'S3', icon: '/logo/aws.png' },
        { name: 'Vercel', icon: '/logo/vercel.webp' },
        { name: 'Postman', icon: '/logo/postman.webp' },
        { name: 'Figma', icon: '/logo/figma.png' },
    ],
};
export const PROJECTS: IProject[] = [
    {
        title: 'WeGro Global',
        slug: 'wegro',
        liveUrl: 'https://www.wegro.global/',
        year: 2024,
        description: `
        WeGro is an agri-fintech platform focused on connecting smallholder farmers with financing, markets, and agricultural inputs. I contributed to core product features that supported investment tracking, project visibility, and secure access to operational data.<br/><br/>

        The work required dependable frontend delivery, backend integration, and careful handling of state, permissions, and financial data visibility in a production environment.<br/><br/>
    `,
        role: `
        <strong>Full-Stack Developer</strong><br/><br/>
        Contributed across product-facing frontend work and backend integration:<br/>
        <ul>
        <li>Built the investor dashboard to surface portfolio status, project progress, and returns across web and mobile flows.</li>
        <li>Integrated investment workflows with backend APIs and frontend state management.</li>
        <li>Delivered secure views for farmer data, project stages, and profit timelines with attention to privacy and auditability.</li>
        <li>Supported platform compatibility requirements for Android and iOS application flows.</li>
        <li>Worked within fintech constraints where reliability, transparency, and data integrity mattered in day-to-day product behavior.</li>
        </ul>
    `,
        techStack: [
            'Next.js',
            'Express / Node.js',
            'REST APIs',
            'Tailwind CSS',
            'Framer Motion',
            'Digital Payment Integration',
        ],
        thumbnail: '/projects/thumbnail/wegro.png',
        longThumbnail: '/projects/thumbnail/wegro.png',
        images: [
            '/projects/images/wegro-1.webp',
            '/projects/images/wegro-2.webp',
            '/projects/images/wegro-3.webp',
        ],
    },
    {
        title: 'Funfuse Games',
        slug: 'funfusegames',
        techStack: ['WordPress', 'WooCommerce', 'Elementor', 'PHP'],
        thumbnail: '/projects/thumbnail/funfuse.webp',
        longThumbnail: '/projects/thumbnail/funfuse.webp',
        images: [
            '/projects/images/funfuse-1.webp',
            '/projects/images/funfuse-2.webp',
        ],
        liveUrl: 'https://funfusegames.com/',
        year: 2024,
        description: `
        Funfuse Games is a mobile game studio publishing casual card and puzzle titles across the App Store and Google Play. I built the web presence used to present the studio, highlight releases, and support discovery for a growing catalog.<br/><br/>

        The focus was on shipping a maintainable website with clear information architecture, strong responsiveness, and solid search performance.
    `,
        role: `
        <strong>Frontend Developer</strong><br/><br/>
        Built the public-facing site with a focus on maintainability and performance:
        <ul>
        <li>Implemented the site in WordPress and WooCommerce for studio content and release management.</li>
        <li>Structured reusable page layouts in Elementor for game pages and supporting content.</li>
        <li>Optimized responsiveness, page speed, and SEO to improve discoverability.</li>
        <li>Set up a content workflow that made future updates easier without requiring code changes for every page.</li>
        </ul>
    `,
    },
    {
        title: 'Indian Grill Wrap & Go',
        slug: 'indiangrillwrap',
        techStack: ['Next.js', 'Tailwind CSS', 'Gemini AI'],
        thumbnail: '/projects/images/indiangrill-1.webp',
        longThumbnail: '/projects/images/indiangrill-1.webp',
        images: [
            '/projects/images/indiangrill-1.webp',
            '/projects/images/indiangrill-2.webp',
            '/projects/images/indiangrill-3.webp',
        ],
        liveUrl: 'https://indiangrillwrap.com',
        year: 2025,
        description: `
    Indian Grill Wrap & Go is a content-heavy restaurant website built to handle a large menu with the speed and structure of a product interface rather than a simple landing page. I turned a 100+ item menu into a category-based browsing experience with <strong>26 submenu pages</strong>, optimized for quick discovery on mobile and desktop.<br/><br/>

    To keep the menu maintainable, I transformed data from the restaurant's Uber Eats listing into a clean JSON dataset and paired it with static assets for fast delivery and straightforward updates.<br/><br/>

    The site also includes a lightweight assistant powered by <strong>Gemini</strong> to answer menu questions without introducing unnecessary infrastructure or storage costs.
  `,
        role: `
    <strong>Full-Stack Developer</strong><br/><br/>
    Delivered the site end to end with a focus on maintainability, performance, and low operating cost:<br/>
    <ul>
      <li>Built a JSON-driven menu architecture supporting <strong>26 categories</strong> and <strong>100+ dishes</strong>.</li>
      <li>Created a data ingestion workflow from Uber Eats into maintainable structured content.</li>
      <li>Integrated image assets through the public pipeline for predictable performance and simple deployment.</li>
      <li>Added a <strong>Gemini</strong>-powered assistant for menu discovery and quick question handling.</li>
      <li>Stored recent chat context locally in the browser to avoid backend storage overhead.</li>
      <li>Reduced token usage by loading menu data only when needed instead of injecting large datasets into every request.</li>
    </ul>
  `,
    },
    {
        title: 'Evonix Ventures',
        slug: 'evonixventures',
        techStack: ['Next.js', 'Tailwind CSS', 'Three.js', 'GSAP'],
        thumbnail: '/projects/thumbnail/evonix.webp',
        longThumbnail: '/projects/thumbnail/evonix.webp',
        images: [
            '/projects/images/evonix-1.webp',
            '/projects/images/evonix-2.webp',
            '/projects/images/evonix-3.webp',
        ],
        liveUrl: 'https://evonixventures.com/',
        year: 2025,
        description: `
    Evonix Ventures is a mobile game studio with a portfolio of <strong>15+ titles</strong> and releases that have reached <strong>millions of downloads</strong>. The site was built to present the company at a level that matched the scale of its products, with a strong focus on brand clarity, release visibility, and performance.<br/><br/>

    This project emphasized polished interaction design, careful animation discipline, and a frontend architecture that could support rich visuals without sacrificing usability or load performance.
  `,
        role: `
    <strong>Frontend Engineer</strong><br/><br/>
    Built an interactive studio site with attention to performance, structure, and maintainability:<br/>
    <ul>
      <li>Built the studio website in <strong>Next.js</strong> with clear structure for titles, releases, and company content.</li>
      <li>Integrated <strong>Three.js</strong> and <strong>GSAP</strong> for interactive visuals while keeping rendering and asset loading controlled.</li>
      <li>Tuned animation timing, responsiveness, and layout behavior across desktop and mobile devices.</li>
      <li>Focused on component structure and performance so the experience stayed fast even in motion-heavy sections.</li>
    </ul>
  `,
    },
    {
        title: 'Apple',
        slug: 'apple',
        techStack: [
            'Next.js',
            'GSAP',
            'Three.js',
            'Tailwind CSS',
            'React Three Fiber',
        ],
        thumbnail: '/projects/thumbnail/apple.webp',
        longThumbnail: '/projects/thumbnail/apple.webp',
        images: [
            '/projects/images/apple-1.png',
            '/projects/images/apple-2.png',
        ],
        liveUrl: 'https://apple.musfiqur.com/',
        year: 2023,
        description: `
        This project is a frontend engineering study inspired by Apple's product pages. I built it to explore how 3D rendering, animation sequencing, and responsive layouts can work together in a high-polish product experience without sacrificing performance.<br/><br/>

        The implementation focused on reusable UI structure, smooth interaction, and keeping the rendering pipeline disciplined enough for real devices.
    `,
        role: `
        <strong>Solo Developer</strong><br/><br/>
        Built the experience end to end with an emphasis on reusable components and rendering discipline:
        <ul>
        <li>Built reusable UI components with <strong>Next.js</strong> and <strong>Tailwind CSS</strong>.</li>
        <li>Integrated 3D product visuals with <strong>Three.js</strong> and <strong>React Three Fiber</strong>.</li>
        <li>Implemented timeline and scroll-based motion with <strong>GSAP</strong> while keeping interactions smooth.</li>
        </ul>
    `,
    },
    {
        title: 'Fizzi',
        slug: 'fizzi',
        techStack: [
            'Next.js',
            'GSAP',
            'Three.js',
            'Tailwind CSS',
            'React Three Fiber',
        ],
        thumbnail: '/projects/thumbnail/fizzi.webp',
        longThumbnail: '/projects/thumbnail/fizzi.webp',
        images: [
            '/projects/images/fizzi-1.png',
            '/projects/images/fizzi-2.png',
        ],
        liveUrl: 'https://fizzi.musfiqur.com/',
        year: 2024,
        description: `
        Fizzi is a frontend experiment centered on spatial storytelling and animated UI. I used it as a practical study in motion-heavy interfaces, component structure, and responsive behavior for visually rich landing pages.<br/><br/>

        The focus was not just on visual presentation, but on implementing complex interaction cleanly in code.
    `,
        role: `
        <strong>Frontend Engineer</strong><br/><br/>
        Built the experience with a focus on clean implementation and responsive behavior:
        <ul>
        <li>Implemented interactive motion using <strong>GSAP</strong> scroll timelines and sequenced transitions.</li>
        <li>Built modular UI components with <strong>Next.js</strong> and <strong>Tailwind CSS</strong>.</li>
        <li>Ensured layout and animation continuity across breakpoints and device sizes.</li>
        </ul>
    `,
    },
    // {
    //     title: 'Virtual Bank',
    //     slug: 'virtual-bank',
    //     techStack: ['React.s', 'Material ui', 'Javascript'],
    //     thumbnail: '/projects/thumbnail/bank.webp',
    //     longThumbnail: '/projects/thumbnail/bank.webp',
    //     images: [
    //         '/projects/thumbnail/bank.webp',
    //         '/projects/images/bank-1.png',
    //         '/projects/images/bank-2.png',
    //     ],
    //     sourceCode: 'https://github.com/Musfiqur/crenotive',
    //     liveUrl: 'https://demo-virtual-bank.netlify.app/',
    //     year: 2023,
    //     description: `
    //     “Virtual Bank” is a demo banking interface designed to represent modern digital finance tools with clear UI and usability. It demonstrates interactive components such as modals, responsive grids, and navigation—showcasing utility tailored for fintech simulations.
    // `,
    //     role: `
    //     <strong>Frontend Developer</strong><br/><br/>
    //     I built it using:
    //     <ul>
    //     <li>💠 React and Material UI for sleek, modular interface.</li>
    //     <li>📑 Integrated responsive layouts and component states.</li>
    //     <li>🔗 Hosted and documented via GitHub for easy access.</li>
    //     </ul>
    // `,
    // },
];

export const MY_EXPERIENCE = [
    {
        title: 'Full-Stack Web Developer',
        company: 'WeGro Global',
        duration: 'Feb 2024 - Mar 2025',
    },
    {
        title: 'Software Engineer (Full-Stack)',
        company: 'Brandclamp Inc.',
        duration: 'Aug 2025 - Present',
    },
];

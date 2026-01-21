import { IProject } from '@/types';

export const GENERAL_INFO = {
    email: 'hello@musfiqur.com ',

    emailSubject: "Let's collaborate on a project",
    emailBody: 'Hi Musfiqur, I am reaching out to you because...',

    oldPortfolio: 'https://v-1.musfiqur.com/',
    upworkProfile: 'https://www.upwork.com/freelancers/~013ccdf5df71821d25',
};

export const SOCIAL_LINKS = [
    { name: 'github', url: 'https://github.com/n4f1s' },
    {
        name: 'linkedin',
        url: 'https://www.linkedin.com/in/musfiqur-rahman-8b8193265/',
    },
    { name: 'leetcode', url: 'https://leetcode.com/u/n4f1s/' },
    { name: 'facebook', url: 'https://www.facebook.com/Musfiq.Nafis/' },
    { name: 'Old Version', url: GENERAL_INFO.oldPortfolio },
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
        WeGro is a Bangladeshi agri-fintech platform dedicated to democratizing access for smallholder farmers to finance, markets, and high-quality inputs. It supports sustainable agriculture by integrating investment for farming inputs with a fairness-based profit-sharing model.<br/><br/>
    `,
        role: `
        <strong>Full Stack Developer & Technical Contributor</strong><br/><br/>
        Worked alongside WeGro's core team to deliver key technical components of their platform:<br/>
        <ul>
        <li>🔧 Built the investor-facing dashboard as a mobile/web interface showing portfolio status, project progress, and ROI</li>
        <li>🛠 Integrated P2P investment backend logic with frontend controls and state management</li>
        <li>🧪 Implemented platform features to show project stages, profit timeline, and farmer data securely</li>
        <li>📱 Ensured mobile app integration compatibility (Android/iOS)</li>
        <li>📦 Worked with fintech requirements—data privacy, transparency, and auditability</li>
        </ul>
    `,
        techStack: [
            'Next.js',
            'Express / Node.js',
            'RESTful APIs',
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
        techStack: ['Wordpress', 'Woocommerce', 'Elementor', 'PHP'],
        thumbnail: '/projects/thumbnail/funfuse.webp',
        longThumbnail: '/projects/thumbnail/funfuse.webp',
        images: [
            '/projects/images/funfuse-1.webp',
            '/projects/images/funfuse-2.webp',
        ],
        liveUrl: 'https://funfusegames.com/',
        year: 2024,
        description: `
        Funfuse Games is a mobile game development studio known for creating engaging casual card and puzzle games. They prioritize high retention, intuitive gameplay, and long-term monetization via Google Play and the App Store.<br/><br/>
        <strong>What Makes Them Unique:</strong><br/>
        - Easy-to-pick-up casual games with addictive play loops.<br/>
        - Focus on strong user retention and monetization.<br/>
        - Consistent updates and user engagement strategies.
    `,
        role: `
        <strong>Frontend Developer</strong><br/><br/>
        I took the lead on:
        <ul>
        <li>🚀 Building the site with WordPress and WooCommerce for game promotion and distribution.</li>
        <li>🎨 Crafting UIs with Elementor for dynamic game pages.</li>
        <li>🧩 Ensuring responsive design across devices.</li>
        <li>🔍 Optimizing site performance and SEO for discovery.</li>
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
    Indian Grill Wrap & Go is a restaurant website designed to feel like a full menu browsing experience—fast, clean, and easy to navigate. The client needed a structured menu system (not a simple landing page), so I built a category-based menu with <strong>26 submenu pages</strong> and <strong>100+ dishes</strong>, optimized for quick discovery and mobile usability.<br/><br/>

    To power the menu at scale, I scraped the restaurant’s Uber Eats listing and transformed it into a clean JSON dataset, then matched dish images by filename and served them from the public assets pipeline for performance and simplicity.<br/><br/>

    The site also includes an AI chat assistant powered by <strong>Gemini</strong>, designed to help customers find items and get answers quickly—without adding database costs.
  `,
        role: `
    <strong>Designer & Full Stack Web Developer</strong><br/><br/>
    Delivered the site end-to-end with a focus on performance, scalability, and low ongoing cost:<br/>
    <ul>
      <li>🍽️ Built a menu system with <strong>26 categories</strong> and <strong>100+ dishes</strong>, structured like a delivery app browsing experience.</li>
      <li>🧾 Scraped Uber Eats menu data and converted it into a maintainable <strong>JSON-driven</strong> content system.</li>
      <li>🖼️ Matched and organized dish images by filename and integrated them from the <strong>public</strong> folder for fast loading.</li>
      <li>🤖 Integrated a <strong>Gemini AI</strong> chat assistant to guide customers and answer menu questions.</li>
      <li>💾 Implemented <strong>client-side chat history</strong> (last 10 messages) to keep context without database/storage fees.</li>
      <li>📉 Reduced AI token usage and cost by designing prompts that fetch menu data <strong>only when needed</strong> instead of injecting large datasets.</li>
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
    Evonix Ventures is an independent mobile game studio focused on “classics reimagined”—bringing well-loved card and casual games to a modern audience. Their studio portfolio includes <strong>15+ titles</strong> and games that have reached <strong>millions of downloads</strong> across multiple releases.<br/><br/>

    The goal of this website was to create a bold, high-end studio presence that matches the scale of their audience and showcases featured games, new releases, and studio culture in a way that feels premium and memorable.
  `,
        role: `
    <strong>Frontend Developer (Next.js) & Interactive UI Engineer</strong><br/><br/>
    I designed and built the website to feel like a modern game studio brand—fast, immersive, and visually striking:<br/>
    <ul>
      <li>🎮 Built a game-studio showcase site in <strong>Next.js</strong> with clean structure for featured games, releases, and studio sections.</li>
      <li>🧊 Integrated <strong>Three.js</strong> to deliver a cinematic 3D experience (hero visuals / interactive elements) that makes the brand instantly feel “game-native”.</li>
      <li>✨ Used <strong>GSAP</strong> for smooth, controlled animations and scroll-driven motion—keeping transitions sharp without hurting performance.</li>
      <li>📱 Ensured fully responsive layout across devices so game discovery and CTAs stay clear on mobile.</li>
      <li>⚡ Optimized for real-world performance (asset loading, animation discipline, and UI rendering) so the site remains fast even with 3D effects.</li>
      <li>🧭 Focused on a “studio credibility” layout—clear messaging, social proof, and polished presentation aligned with a company that ships at scale.</li>
    </ul>
  `,
    },
    {
        title: 'Apple',
        slug: 'apple',
        techStack: [
            'Next.js',
            'Gsap',
            'Three.js',
            'Tailwind CSS',
            'React-three-fiber',
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
        A stylized re-creation of Apple’s iconic landing page, featuring immersive 3D elements and smooth scroll animations. I built it to showcase modern UI/UX design skills, performance optimization, and interactive web experiences.<br/><br/>
        <strong>Features:</strong><br/>
        - 3D rendered product showcase using react-three-fiber.<br/>
        - Animated content entrances powered by GSAP.<br/>
        - Optimized for both animation and page speed.
    `,
        role: `
        <strong>Solo Developer</strong><br/><br/>
        I handled everything—from design to deployment:
        <ul>
        <li>✍ Crafted reusable components with Tailwind CSS.</li>
        <li>🕹 Integrated 3D visuals using Three.js + React Three Fiber.</li>
        <li>🎞 Implemented timeline animations with GSAP.</li>
        </ul>
    `,
    },
    {
        title: 'Fizzi',
        slug: 'fizzi',
        techStack: [
            'Next.js',
            'Gsap',
            'Three.js',
            'Tailwind CSS',
            'React-three-fiber',
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
        Fizzi is a creative digital experience built around property visualization, blending UI animations with 3D space pacing. It features animated content layouts and immersive visuals to showcase design flexibility in digital storytelling.<br/><br/>
        <strong>Notable Features:</strong><br/>
        - Animated transitions and scroll effects with GSAP.<br/>
        - 3D content integration with react-three-fiber.<br/>
        - Clean, responsive UI for modern web.
    `,
        role: `
        <strong>Frontend Engineer</strong><br/><br/>
        I designed and built:
        <ul>
        <li>🔄 Interactive visuals using GSAP scroll timelines.</li>
        <li>🧱 Modular UI components styled with Tailwind CSS.</li>
        <li>🌍 Responsive layout ensuring visual continuity across devices.</li>
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
        title: 'Web Developer',
        company: 'Wegro.Global',
        duration: 'Feb 2024 - Mar 2025',
    },
    {
        title: 'Software Engineer (Full-Stack)',
        company: 'Brandclamp Inc.',
        duration: 'Aug 2025 - Present',
    },
];

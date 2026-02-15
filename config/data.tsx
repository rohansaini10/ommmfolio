import {
  CollabydrawIcon,
  CryptoKoshIcon,
  DefineDigitallyLogo,
  DukaanIcon,
  EnhanceCvIcon,
  GoliathDataLogo,
  MilestoneClipIcon,
  SuperGitSightIcon,
  XolanaIcon,
  YouLayerIcon,
} from "@/components/icons";

export type IconPreset = "file-text" | "linkedin" | "paintbrush" | "sparkles";
export type ProjectStatus = "active" | "archived";
export type ProjectLinkKind = "live" | "repo" | "case-study" | "video";
export type ProjectLinkIconKey = "globe" | "github";

export type ProjectLogo =
  | {
    kind: "image";
    src: string;
    alt: string;
  }
  | {
    kind: "preset";
    name: IconPreset;
    alt: string;
  };

export type ProjectVideo =
  | {
    provider: "youtube";
    id: string;
  }
  | {
    provider: "file";
    src: string;
  };

export interface ProjectLink {
  kind: ProjectLinkKind;
  label: string;
  url: string;
  iconKey?: ProjectLinkIconKey;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  status: ProjectStatus;
  periodLabel: string;
  technologies: string[];
  primaryUrl: string;
  logo: ProjectLogo;
  links: ProjectLink[];
  previewImage: string;
  video?: ProjectVideo;
}

export interface ContactSocialLinks {
  Instagram: string;
  GitHub: string;
  LinkedIn: string;
  X: string;
  Resume: {
    fullstack: string;
    shopify: string;
  };
}

export interface ContactInfo {
  email: string;
  social: ContactSocialLinks;
}

export interface FeaturedProject {
  title: string;
  href: string;
  iconImage: string;
}

export interface FeaturedProjects {
  codeClip: FeaturedProject;
  collabydraw: FeaturedProject;
  superGitSight: FeaturedProject;
}

export interface WorkExperience {
  company: string;
  badges: string[];
  href: string;
  location: string;
  title: string;
  logoUrl: string;
  start: string;
  end: string;
  description: string[];
}

export interface Highlight {
  title: string;
  url: string;
}

export interface PortfolioData {
  name: string;
  initials: string;
  dob: string;
  location: string;
  locationLink: string;
  avatarUrl: string;
  skills: string[];
  contact: ContactInfo;
  featuredProjects: FeaturedProjects;
  work: WorkExperience[];
  projects: Project[];
  highlights: Highlight[];
}

export const DATA: PortfolioData = {
  name: "Om Sharma",
  initials: "OS",
  dob: "June 20, 2001",
  location: "Rajasthan (Bhilwara), India",
  locationLink: "https://maps.app.goo.gl/h4VcJSQs25pVTiYK6",
  avatarUrl: "/om.png",
  skills: [
    "HTML",
    "CSS",
    "Tailwind CSS",
    "JavaScript",
    "TypeScript",
    "React JS",
    "Next JS",
    "Node JS",
    "Express JS",
    "Redux Toolkit",
    "Mongo DB",
    "PostgreSQL",
    "Docker",
    "AWS",
    "Prisma",
    "Shopify",
    "Shopify Theme & Liquid Customization",
  ],
  contact: {
    email: "mail.coderom@gmail.com",
    social: {
      Instagram: "https://www.instagram.com/coder.om",
      GitHub: "https://github.com/coderomm",
      LinkedIn: "https://www.linkedin.com/in/1omsharma",
      X: "https://x.com/1omsharma",
      Resume: {
        fullstack: "https://drive.google.com/file/d/1qOv1N8mNL3BeTilBGUxsQSVnZCo6p4US/view?usp=sharing",
        shopify: "https://drive.google.com/file/d/124CliJ2NiH1y3zIanl9qHD94scG_c68w/view?usp=sharing",
      },
    },
  },

  highlights: [
    {
      title: "Recognized by Excalidraw",
      url: "https://x.com/excalidraw/status/1909651284950409360",
    },
    {
      title: "Recognized by Harkirat Singh",
      url: "https://www.linkedin.com/posts/1omsharma_nextjs-websockets-realtime-activity-7316101365506686976-fbFQ",
    },
    {
      title: "Recommended by Parth Amin",
      url: "https://drive.google.com/file/d/1srPq7z1mwoOr_b5BY--bokJfm7Xkc9SW/view?usp=sharing",
    },
    {
      title: "Won a bounty in Solana Hackathon",
      url: "https://superteam.fun/earn/feed/submission/d8d1f666-aead-41b3-8ba8-5b2cb9348649",
    },
  ],

  featuredProjects: {
    codeClip: {
      title: "CodeClip",
      href: "https://milestoneclip.com/codeclip",
      iconImage: MilestoneClipIcon,
    },
    collabydraw: {
      title: "Collabydraw",
      href: "https://collabydraw.xyz",
      iconImage: CollabydrawIcon,
    },
    superGitSight: {
      title: "SuperGitSight",
      href: "https://supergitsight.xyz",
      iconImage: SuperGitSightIcon,
    },
  },

  work: [
    {
      company: "Goliath Data",
      badges: [],
      href: "https://goliathdata.ai",
      location: "Remote",
      title: "Software Engineer",
      logoUrl: GoliathDataLogo,
      start: "June 2025",
      end: "Nov 2025",
      description: [
        "Contributed to core product features, major UI/UX improvements, and large-scale React/TypeScript codebase enhancements across the Goliath Data platform",
        "Optimized backend GraphQL queries, schemas, and integrations to improve data flow and system performance",
      ],
    },
    {
      company: "Define Digitally",
      badges: [],
      href: "https://www.definedigitally.com/",
      location: "Remote",
      title: "Full Stack Developer",
      logoUrl: DefineDigitallyLogo,
      start: "Nov 2023",
      end: "May 2025",
      description: [
        "Delivered custom Shopify storefronts, theme builds, Liquid-based customizations, and store setups for global clients",
        "Built full-stack features using Next.js, React, TypeScript, Tailwind, Strapi, and Node.js, creating fast, responsive, and scalable web applications",
        "Developed Framer and WordPress websites, optimized page performance, and executed pixel-perfect UI implementations across various client projects",
      ],
    },
    {
      company: "Data Bolta Hai",
      href: "https://databoltahai.in/",
      badges: [],
      location: "Bhilwara, Rajasthan",
      title: "Web Developer Intern",
      logoUrl: "/experience/DataBoltaHai.png",
      start: "May 2023",
      end: "Dec 2023",
      description: [
        "Led a small dev team to plan, build, and launch three websites for a service-based startup, handling development, hosting, domain setup, and database management",
      ],
    },
    {
      company: "SPMPL Tech",
      href: "https://spmpltech.com/",
      badges: [],
      location: "Bhilwara, Rajasthan",
      title: "Dotnet Developer Intern",
      logoUrl: "/experience/SPMPL.png",
      start: "Nov 2022",
      end: "May 2023",
      description: [
        "Contributed to 3+ web applications across both frontend and backend using .NET Core MVC, C#, SQL, HTML, CSS, and JavaScript",
      ],
    },
  ],

  projects: [
    {
      id: "supergitsight",
      title: "SuperGitSight",
      summary:
        "Data-powered GitHub analytics platform providing contribution scoring, repository insights, and developer activity visualization",
      status: "archived",
      periodLabel: "2026",
      technologies: ["Next.js", "GraphQL", "Redis", "Prisma"],
      primaryUrl: "https://supergitsight.xyz",
      logo: {
        kind: "image",
        src: SuperGitSightIcon,
        alt: "SuperGitSight icon",
      },
      links: [
        { kind: "live", label: "Live", url: "https://supergitsight.xyz", iconKey: "globe" },
        {
          kind: "repo",
          label: "Codebase",
          url: "https://github.com/supergitsight/supergitsight",
          iconKey: "github",
        },
      ],
      previewImage: "https://i.ibb.co/Zp01TZCJ/supergitsight.png",
    },
    {
      id: "milestoneclip",
      title: "MilestoneClip",
      summary:
        "Shareable videos for GitHub milestones. Create clips from repo stars, forks, and user milestones-ready for X, LinkedIn, and Instagram.",
      status: "active",
      periodLabel: "2026",
      technologies: [
        "Next.js",
        "Remotion",
        "Video",
        "Tailwind CSS",
        "TypeScript",
        "Redis",
        "GraphQL",
        "Prisma",
      ],
      primaryUrl: "https://milestoneclip.com",
      logo: {
        kind: "image",
        src: MilestoneClipIcon,
        alt: "MilestoneClip icon",
      },
      links: [
        { kind: "live", label: "Live", url: "https://milestoneclip.com", iconKey: "globe" },
        {
          kind: "repo",
          label: "Codebase",
          url: "https://github.com/coderomm/milestoneclip",
          iconKey: "github",
        },
      ],
      previewImage: "https://i.ibb.co/1N8g94m/milestoneclip.png",
    },
    {
      id: "codeclip",
      title: "CodeClip",
      summary:
        "Create animated videos from code snippets. Paste your code, customize styles, and export shareable MP4 clips for social media, demos, and developer content.",
      status: "active",
      periodLabel: "2026",
      technologies: [
        "Next.js",
        "Remotion Video",
        "GraphQL",
        "Tailwind CSS",
        "TypeScript",
        "Redis",
        "Prisma",
      ],
      primaryUrl: "https://milestoneclip.com/codeclip",
      logo: {
        kind: "image",
        src: MilestoneClipIcon,
        alt: "CodeClip icon",
      },
      links: [
        { kind: "live", label: "Live", url: "https://milestoneclip.com/codeclip", iconKey: "globe" },
        {
          kind: "repo",
          label: "Codebase",
          url: "https://github.com/coderomm/milestoneclip",
          iconKey: "github",
        },
      ],
      previewImage: "https://i.ibb.co/Z1MwcVY9/codeclip.png",
    },
    {
      id: "collabydraw",
      title: "Collabydraw",
      summary:
        "Collaborative whiteboard application with real-time synchronization and end-to-end encryption",
      status: "archived",
      periodLabel: "Feb 2025",
      technologies: ["Next.js", "WebSocket", "Canvas", "RoughJs", "Perfect-freehand", "E2EE"],
      primaryUrl: "https://collabydraw.xyz",
      logo: {
        kind: "image",
        src: CollabydrawIcon,
        alt: "Collabydraw icon",
      },
      links: [
        { kind: "live", label: "Live", url: "https://collabydraw.xyz", iconKey: "globe" },
        {
          kind: "repo",
          label: "Codebase",
          url: "https://github.com/coderomm/CollabyDraw",
          iconKey: "github",
        },
      ],
      previewImage: "https://i.ibb.co/hRKcdccv/collabydraw.png",
      video: { provider: "youtube", id: "UZFOmNLd8NU" },
    },
    {
      id: "ai-formatter-linkedin",
      title: "PostMint",
      summary:
        "Convert AI-generated text into LinkedIn-safe Unicode formatting. Preserve bold, italic, lists, and structure exactly as written.",
      status: "active",
      periodLabel: "Dec 2025",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
      primaryUrl: "https://linkedin-ai-formatter.omsharma.xyz",
      logo: {
        kind: "preset",
        name: "linkedin",
        alt: "AI Formatter for LinkedIn icon",
      },
      links: [
        { kind: "live", label: "Live", url: "https://linkedin-ai-formatter.omsharma.xyz", iconKey: "globe" },
        {
          kind: "repo",
          label: "Codebase",
          url: "https://github.com/coderomm/linkedin-ai-formatter-app",
          iconKey: "github",
        },
      ],
      previewImage: "https://i.ibb.co/jkNBP0zF/Linked-In-Formatter.png",
    },
    {
      id: "enhance-cv",
      title: "Enhance CV",
      summary:
        "Drag-and-drop resume builder with live preview and undo/redo support inspired by Enhance CV. Build as an assignment for a job interview.",
      status: "archived",
      periodLabel: "May 2025",
      technologies: ["Next.js", "Redux", "Tailwind CSS"],
      primaryUrl: "https://enhancecv.omsharma.xyz/",
      logo: {
        kind: "image",
        src: EnhanceCvIcon,
        alt: "Enhance CV icon",
      },
      links: [
        { kind: "live", label: "Live", url: "https://enhancecv.omsharma.xyz/", iconKey: "globe" },
        {
          kind: "repo",
          label: "Codebase",
          url: "https://github.com/coderomm/Enhance-CV",
          iconKey: "github",
        },
      ],
      previewImage: "https://i.ibb.co/sSZH5kq/Enhance-CV.png",
    },
    {
      id: "imaginate-ai",
      title: "Imaginate AI",
      summary: "AI-powered image generation tool that converts text prompts into high-quality images",
      status: "archived",
      periodLabel: "Nov 23, 2024 - Nov 30, 2024",
      technologies: [
        "Next.js",
        "Tailwind CSS",
        "NextAuth",
        "Postgresql",
        "Prisma ORM",
        "Shadcn",
        "Aceternity UI",
      ],
      primaryUrl: "https://ai-imaginate.vercel.app/",
      logo: {
        kind: "preset",
        name: "sparkles",
        alt: "Imaginate AI icon",
      },
      links: [
        { kind: "live", label: "Live", url: "https://ai-imaginate.vercel.app/", iconKey: "globe" },
        {
          kind: "repo",
          label: "Codebase",
          url: "https://github.com/coderomm/Imaginate-AI",
          iconKey: "github",
        },
      ],
      previewImage: "https://i.ibb.co/dJwqJBR2/imaginateai.png",
      video: { provider: "youtube", id: "JtXYTk9tR-8" },
    },
    {
      id: "youlayer",
      title: "YouLayer",
      summary:
        "SaaS platform for secure YouTube collaboration between creators and editors. Allows editors to upload videos to creators' channels without sharing access, providing a secure and streamlined workflow.",
      status: "active",
      periodLabel: "Jul 17, 2024 - Sep 1, 2024",
      technologies: [
        "React",
        "Node.JS",
        "Mongo DB",
        "Express.JS",
        "Context API",
        "Tailwind CSS",
        "Recoil",
        "YT Data API",
        "Google O-Auth",
      ],
      primaryUrl: "https://youlayer.omsharma.xyz/",
      logo: {
        kind: "image",
        src: YouLayerIcon,
        alt: "YouLayer icon",
      },
      links: [
        { kind: "live", label: "Live", url: "https://youlayer.omsharma.xyz/", iconKey: "globe" },
        {
          kind: "repo",
          label: "Codebase",
          url: "https://github.com/coderomm/YouLayer",
          iconKey: "github",
        },
      ],
      previewImage: "https://i.ibb.co/Zpggjc8y/youlayer.png",
      video: { provider: "youtube", id: "k_qP2-zYQS8" },
    },
    {
      id: "xolana",
      title: "Xolana",
      summary: "Solana-based token management application with wallet integration and devnet support.",
      status: "active",
      periodLabel: "Sep 18, 2024 - Present",
      technologies: [
        "Web3.js",
        "Solana",
        "TypeScript",
        "React JS",
        "Tailwind CSS",
        "Recoil",
        "React Router",
        "Node JS",
        "Express JS",
        "WS",
        "Solana SPL Token",
      ],
      primaryUrl: "https://xolana.vercel.app/",
      logo: {
        kind: "image",
        src: XolanaIcon,
        alt: "Xolana icon",
      },
      links: [
        { kind: "live", label: "Live", url: "https://xolana.vercel.app/", iconKey: "globe" },
        {
          kind: "repo",
          label: "Codebase",
          url: "https://github.com/coderomm/Xolana/",
          iconKey: "github",
        },
      ],
      previewImage: "https://i.ibb.co/9mY46m07/xolana.png",
    },
    {
      id: "cryptokosh",
      title: "CryptoKosh",
      summary:
        "Web3 wallet application with wallet generation, recovery phrase support, and key management features.",
      status: "archived",
      periodLabel: "Sep 2024",
      technologies: ["Web3.js", "Solana", "TypeScript", "React JS", "Tailwind CSS"],
      primaryUrl: "https://crypto-kosh.vercel.app/",
      logo: {
        kind: "image",
        src: CryptoKoshIcon,
        alt: "CryptoKosh icon",
      },
      links: [
        { kind: "live", label: "Live", url: "https://crypto-kosh.vercel.app/", iconKey: "globe" },
        {
          kind: "repo",
          label: "Codebase",
          url: "https://github.com/coderomm/CryptoKosh",
          iconKey: "github",
        },
      ],
      previewImage: "https://i.ibb.co/VcVQ1BxV/cryptokosh.png",
      video: { provider: "youtube", id: "0HC0gh9xMgU" },
    },
    {
      id: "dukaan-dashboard-clone",
      title: "Dukaan Clone",
      summary:
        "Pixel-perfect clone of Dukaan’s merchant dashboard built for a technical challenge. Interviewed with the CTO of Dukaan after completing this open assignment on X.",
      status: "archived",
      periodLabel: "Jun 18, 2024",
      technologies: ["React JS", "Recoil", "Tailwind CSS"],
      primaryUrl: "https://dukaan-frontend-clone.vercel.app/",
      logo: {
        kind: "image",
        src: DukaanIcon,
        alt: "Dukaan Dashboard Clone icon",
      },
      links: [
        {
          kind: "live",
          label: "Live",
          url: "https://dukaan-frontend-clone.vercel.app/",
          iconKey: "globe",
        },
        {
          kind: "repo",
          label: "Codebase",
          url: "https://github.com/coderomm/Dukaan-Dashboard-Clone",
          iconKey: "github",
        },
      ],
      previewImage: "https://i.ibb.co/PsXt6qjq/dukaan.png",
      video: { provider: "youtube", id: "YprxSYJl6DQ" },
    },
    {
      id: "deepti-art",
      title: "Deepti Art",
      summary:
        "E-commerce website with integrated Stripe payment gateway for online sales. Built in an internship program.",
      status: "archived",
      periodLabel: "Jun 2023 - Dec 2023",
      technologies: [".NET MVC5", "MSSQL", "EF", "HTML", "CSS", "BS5", "JavaScript", "Ajax"],
      primaryUrl: "https://deeptiart.com/",
      logo: {
        kind: "preset",
        name: "paintbrush",
        alt: "Deepti Art icon",
      },
      links: [
        { kind: "live", label: "Live", url: "https://deeptiart.com/", iconKey: "globe" },
        {
          kind: "repo",
          label: "Codebase",
          url: "https://github.com/coderomm/Deepti-Art",
          iconKey: "github",
        },
      ],
      previewImage: "https://i.ibb.co/0pfmm8T5/deeptiart.png",
      video: { provider: "youtube", id: "OjcKTo4InOI" },
    },
    {
      id: "data-bolta-hai",
      title: "Data Bolta Hai",
      summary: "Website for a service-based startup with integrated GST API and GST Taxpayer Search API.",
      status: "archived",
      periodLabel: "May 2023 - Dec 2023",
      technologies: [".NET MVC5", "C#", "MSSQL", "EF", "HTML", "CSS", "BS5", "JavaScript", "Ajax"],
      primaryUrl: "https://databoltahi.com",
      logo: {
        kind: "preset",
        name: "file-text",
        alt: "Data Bolta Hai icon",
      },
      links: [{ kind: "live", label: "Live", url: "https://databoltahi.com", iconKey: "globe" }],
      previewImage: "https://i.ibb.co/5WpVFcMC/dbh.png",
      video: { provider: "youtube", id: "HEHmaLn-aR8" },
    },
  ],
};

export type QuestStatus = "done" | "todo" | "partial";

export interface QuestItem {
  text: string;
  status: QuestStatus;
}

export interface QuestChapter {
  id: string;
  title: string;
  isOpen: boolean;
  panelStyleText: string;
  items: QuestItem[];
}

export const MAIN_QUEST_CHAPTERS: QuestChapter[] = [
  {
    id: "chapter-1",
    title: "Chapter 1: Life",
    isOpen: true,
    panelStyleText:
      "--radix-accordion-content-height: var(--radix-collapsible-content-height); --radix-accordion-content-width: var(--radix-collapsible-content-width); --radix-collapsible-content-height: 258.390625px; --radix-collapsible-content-width: 763.875px;",
    items: [
      { text: "Move out of home and live independently", status: "done" },
      { text: "Make min ₹10K in one month for more than 2 months", status: "done" },
      { text: "Make min ₹20K in one month for more than 6 months", status: "done" },
      { text: "Make min ₹50K in one month for more than 12 months", status: "done" },
      { text: "Make min ₹150K in one month for more than 6 months", status: "done" },
      { text: "Make min ₹200K in one month for more than 12 months", status: "partial" },
    ],
  },
  {
    id: "chapter-2",
    title: "Chapter 2: Learn",
    isOpen: true,
    panelStyleText:
      "--radix-accordion-content-height: var(--radix-collapsible-content-height); --radix-accordion-content-width: var(--radix-collapsible-content-width); --radix-collapsible-content-height: 258.390625px; --radix-collapsible-content-width: 763.875px;",
    items: [
      { text: "Work in a US based product startup", status: "done" },
      { text: "Get a full-time job offer from large companies.", status: "todo" },
      { text: "Get into a tier-1 MCA college", status: "todo" },
    ],
  },
  {
    id: "chapter-3",
    title: "Chapter 3: Hacker Journey",
    isOpen: true,
    panelStyleText:
      "--radix-accordion-content-height: var(--radix-collapsible-content-height); --radix-accordion-content-width: var(--radix-collapsible-content-width); --radix-collapsible-content-height: 335.1875px; --radix-collapsible-content-width: 763.875px;",
    items: [
      { text: "Make first $100 online freelance income", status: "done" },
      { text: "Make first offline freelance income", status: "done" },
      { text: "$1 MRR", status: "todo" },
    ],
  },
];

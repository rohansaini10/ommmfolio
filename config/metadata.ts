import type { Metadata } from "next";
import { DATA } from "@/config/data";

const siteUrl = "https://www.omsharma.xyz";
const ogImage = "/opengraph-image.png";

const siteTitle = `${DATA.name}`;
const siteDescription = "Portfolio of Om Sharma, a full stack developer building production-ready web apps, Shopify experiences, and SaaS products.";

const socialLinks = [
  DATA.contact.social.GitHub,
  DATA.contact.social.LinkedIn,
  DATA.contact.social.X,
  DATA.contact.social.Instagram,
];

export const appMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${DATA.name}`,
  },
  description: siteDescription,
  keywords: DATA.skills,
  authors: [{ name: DATA.name, url: DATA.contact.social.LinkedIn }],
  creator: DATA.name,
  publisher: DATA.name,
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: `${DATA.name} Portfolio`,
    images: [
      {
        url: ogImage,
        alt: `${DATA.name} portfolio preview`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
    creator: "@1omsharma",
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
  other: {
    "msapplication-TileColor": "#ffffff",
    "theme-color": "#ffffff",
  },
};

export const jsonLdSchema = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${DATA.name} Portfolio`,
    url: siteUrl,
    description: siteDescription,
    inLanguage: "en",
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: DATA.name,
    url: siteUrl,
    image: ogImage,
    email: `mailto:${DATA.contact.email}`,
    jobTitle: "Full Stack Developer",
    description: siteDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bhilwara",
      addressRegion: "Rajasthan",
      addressCountry: "IN",
    },
    sameAs: socialLinks,
    knowsAbout: DATA.skills,
  },
];

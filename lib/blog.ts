import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string; // ISO string, e.g. "2025-01-15"
  tags: string[];
  cover?: string; // optional OG/hero image path
}

export interface BlogMeta extends BlogFrontmatter {
  slug: string;
  readingTime: number; // minutes
}

export interface BlogPost extends BlogMeta {
  content: string; // raw markdown (will be processed by the page)
}

// ─── Paths ────────────────────────────────────────────────────────────────────

const BLOGS_DIR = path.join(process.cwd(), "content", "blogs");

// ─── Reading time ─────────────────────────────────────────────────────────────

function calcReadingTime(markdown: string): number {
  const WORDS_PER_MINUTE = 200;
  // Strip markdown syntax for a more accurate word count
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, "") // code blocks
    .replace(/`[^`]+`/g, "")        // inline code
    .replace(/!\[.*?\]\(.*?\)/g, "") // images
    .replace(/\[.*?\]\(.*?\)/g, "")  // links
    .replace(/#{1,6}\s/g, "")        // headings
    .replace(/[*_~>|-]/g, "");       // misc syntax
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Returns all blog slugs (used for generateStaticParams) */
export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(BLOGS_DIR)) return [];
  return fs
    .readdirSync(BLOGS_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

/** Returns metadata for all posts, sorted newest first */
export function getAllBlogMeta(): BlogMeta[] {
  return getAllBlogSlugs()
    .map((slug) => {
      const raw = fs.readFileSync(
        path.join(BLOGS_DIR, `${slug}.md`),
        "utf8"
      );
      const { data, content } = matter(raw);
      const fm = data as BlogFrontmatter;
      return {
        slug,
        title: fm.title,
        description: fm.description,
        date: fm.date,
        tags: fm.tags ?? [],
        cover: fm.cover,
        readingTime: calcReadingTime(content),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Returns a single blog post (meta + raw markdown content) */
export function getBlogPost(slug: string): BlogPost | null {
  const filePath = path.join(BLOGS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as BlogFrontmatter;

  return {
    slug,
    title: fm.title,
    description: fm.description,
    date: fm.date,
    tags: fm.tags ?? [],
    cover: fm.cover,
    readingTime: calcReadingTime(content),
    content,
  };
}

/** Formats a date string for display */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
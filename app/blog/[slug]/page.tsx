import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllBlogSlugs, getBlogPost, formatDate } from "@/lib/blog";
import { processMarkdown } from "@/lib/markdown";
import { BlogProse } from "../_components/BlogProse";
import { TableOfContents } from "../_components/TableOfContents";

// ─── ISR: revalidate every 24 hours ────────────────────────────────────────
export const revalidate = 86400;

// ─── Static params ────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

// ─── SEO metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
      ...(post.cover ? { images: [{ url: post.cover }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      ...(post.cover ? { images: [post.cover] } : {}),
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  // All processing happens on the server — zero client JS for content rendering
  const { html, toc } = await processMarkdown(post.content);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-16">

        {/* ── Main content ── */}
        <main className="min-w-0">
          {/* Back link */}
          <Link
            href="/blog"
            className="mb-10 inline-flex items-center gap-1.5 text-sm text-[#9b9a97] transition-colors hover:text-[#37352f]"
          >
            <span aria-hidden="true">←</span>
            All posts
          </Link>

          {/* Header */}
          <header className="mb-10">
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-sm bg-[#f1f0ef] px-2 py-0.5 text-xs font-medium text-[#787774]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-3xl font-bold leading-tight tracking-[-0.02em] text-[#37352f] sm:text-4xl">
              {post.title}
            </h1>

            <p className="mt-4 text-lg text-[#787774] leading-relaxed">
              {post.description}
            </p>

            {/* Meta */}
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[#9b9a97]">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime} min read</span>
            </div>

            {/* Divider */}
            <hr className="mt-8 border-[#e9e9e7]" />
          </header>

          {/* Cover image */}
          {post.cover && (
            <div className="mb-10 overflow-hidden rounded-lg border border-[#e9e9e7]">
              <img
                src={post.cover}
                alt={post.title}
                width="100%"
                height="100%"
                className="w-full object-cover"
                loading="eager"
              />
            </div>
          )}

          {/* Rendered markdown */}
          <BlogProse html={html} />
        </main>

        {/* ── Sidebar TOC (desktop only) ── */}
        {toc.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-8">
              <TableOfContents toc={toc} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
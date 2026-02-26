import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogMeta, formatDate } from "@/lib/blog";

// ─── ISR: revalidate every 60 seconds ────────────────────────────────────────
export const revalidate = 60;

// ─── SEO ──────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on software, engineering, and building things.",
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BlogIndexPage() {
  const posts = getAllBlogMeta();

  return (
    <main className="mx-auto w-[90%] md:w-3/4 lg:w-1/2 px-4 py-20">
      {/* Back link */}
      <Link
        href="/"
        className="mb-10 inline-flex items-center gap-1.5 text-sm text-[#9b9a97] transition-colors hover:text-[#37352f]"
      >
        <span aria-hidden="true">←</span>
        Home
      </Link>

      <header className="mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-[#37352f]">
          Blog
        </h1>
        <p className="mt-3 text-[#9b9a97] text-sm">
          {posts.length} {posts.length === 1 ? "article" : "articles"}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-[#9b9a97]">No posts yet. Check back soon.</p>
      ) : (
        <ul className="divide-y divide-[#e9e9e7]">
          {posts.map((post) => (
            <li key={post.slug} className="py-8 first:pt-0 last:pb-0">
              <article className="flex flex-col md:flex-row gap-5">
                {/* Thumbnail */}
                {post.cover && (
                  <Link href={`/blog/${post.slug}`} className="shrink-0 mt-1">
                    <div className="overflow-hidden rounded-md border border-[#e9e9e7] w-full md:w-[240px] h-auto md:h-[136px]">
                      <img
                        src={post.cover}
                        alt={post.title}
                        width="100%"
                        height="100%"
                        className="w-full h-full object-cover transition-opacity hover:opacity-80"
                        loading="eager"
                      />
                    </div>
                  </Link>
                )}

                <div className="min-w-0 flex-1">
                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="mb-2.5 flex flex-wrap gap-1.5">
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

                  {/* Title */}
                  <h2 className="text-xl font-semibold leading-snug">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-[#37352f] transition-colors hover:text-[#37352f]/60"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  {/* Description */}
                  <p className="mt-2 text-sm leading-relaxed text-[#787774] line-clamp-2">
                    {post.description}
                  </p>

                  {/* Meta row */}
                  <div className="mt-3 flex items-center gap-3 text-xs text-[#9b9a97]">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span aria-hidden="true">·</span>
                    <span>{post.readingTime} min read</span>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
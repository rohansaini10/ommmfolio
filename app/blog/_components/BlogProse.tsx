// Pure server component — just renders pre-processed HTML.
// The `prose` classes come from @tailwindcss/typography.
// Styled to match Notion's clean, minimal aesthetic.

interface BlogProseProps {
  html: string;
}

export function BlogProse({ html }: BlogProseProps) {
  return (
    <div
      className={[
        "prose prose-neutral",
        "max-w-none",

        // ── Base text ──────────────────────────────────────────────────────
        "prose-p:text-[#37352f] prose-p:leading-[1.75] md:text-[1.125rem]",

        // ── Headings ───────────────────────────────────────────────────────
        "prose-headings:text-[#37352f] prose-headings:font-semibold",
        "prose-headings:tracking-[-0.01em] prose-headings:scroll-mt-24",
        "prose-h1:text-[2rem] prose-h1:mb-2",
        "prose-h2:text-[1.375rem] prose-h2:mt-10 prose-h2:mb-1",
        "prose-h3:text-[1.125rem] prose-h3:mt-7 prose-h3:mb-1",

        // ── Links ──────────────────────────────────────────────────────────
        "prose-a:text-[#37352f] prose-a:font-medium",
        "prose-a:no-underline prose-a:border-b prose-a:border-[#37352f]/30",
        "hover:prose-a:border-[#37352f]",

        // ── Inline code ────────────────────────────────────────────────────
        // Subtle: no border, no color tint, just a soft grey bg like Notion
        "prose-code:before:content-none prose-code:after:content-none",
        "prose-code:text-[#37352f] prose-code:bg-[#f1f0ef]",
        "prose-code:rounded-sm prose-code:px-[5px] prose-code:py-[2px]",
        "prose-code:text-[0.85em] prose-code:font-mono prose-code:font-normal",
        "[&_:not(pre)>code]:shadow-none [&_:not(pre)>code]:border-0",

        // ── Pre / code blocks ──────────────────────────────────────────────
        // rehype-pretty-code wraps in <figure>, we just zero out prose-pre defaults
        "prose-pre:bg-transparent prose-pre:p-0 prose-pre:rounded-none prose-pre:border-none prose-pre:shadow-none",

        // ── Blockquotes ────────────────────────────────────────────────────
        // Notion: thick left bar, light bg tint, no italic
        "prose-blockquote:border-l-[3px] prose-blockquote:border-[#37352f]",
        "prose-blockquote:bg-[#f7f6f3] prose-blockquote:rounded-r-md",
        "prose-blockquote:px-4 prose-blockquote:py-3 prose-blockquote:not-italic",
        "prose-blockquote:text-[#37352f] prose-blockquote:font-normal",
        "[&_blockquote_p]:my-0",

        // ── Tables ─────────────────────────────────────────────────────────
        // Wrap in scrollable div so overflow is contained to the table, not the page
        "[&_table]:block [&_table]:w-full [&_table]:overflow-x-auto",
        "[&_table]:text-[0.9rem] [&_table]:border-collapse",
        "prose-th:bg-[#f7f6f3] prose-th:text-[#37352f] prose-th:font-semibold",
        "prose-th:px-4 prose-th:py-2.5 prose-th:border prose-th:border-[#e9e9e7]",
        "prose-th:whitespace-nowrap",
        "prose-td:px-4 prose-td:py-2.5 prose-td:border prose-td:border-[#e9e9e7]",
        "prose-td:text-[#37352f] prose-td:align-top prose-td:whitespace-nowrap",


        // ── Lists ──────────────────────────────────────────────────────────
        "prose-li:text-[#37352f] prose-li:my-1",
        "prose-ul:my-3 prose-ol:my-3",

        // ── HR ─────────────────────────────────────────────────────────────
        "prose-hr:border-[#e9e9e7] prose-hr:my-8",

        // ── Images ─────────────────────────────────────────────────────────
        "prose-img:rounded-md prose-img:border prose-img:border-[#e9e9e7]",
      ].join(" ")}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";
import type { Root } from "hast";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3; // only h2 and h3 in TOC
}

// ─── TOC extractor (runs as a rehype plugin) ──────────────────────────────────

function extractToc(toc: TocItem[]) {
  return () => (tree: Root) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "h2" || node.tagName === "h3") {
        const id = node.properties?.id as string | undefined;
        const text = toString(node);
        if (id && text) {
          toc.push({ id, text, level: node.tagName === "h2" ? 2 : 3 });
        }
      }
    });
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface ProcessedMarkdown {
  html: string;
  toc: TocItem[];
}

export async function processMarkdown(
  markdown: string
): Promise<ProcessedMarkdown> {
  const toc: TocItem[] = [];

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm) // tables, strikethrough, task lists, autolinks
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug) // adds id="" to headings
    .use(rehypeAutolinkHeadings, { behavior: "wrap" }) // makes headings linkable
    .use(extractToc(toc)) // pull TOC before pretty-code transforms nodes
    .use(rehypePrettyCode, {
      // Uses Shiki under the hood — runs 100% on the server, zero client JS
      theme: "github-light",
      keepBackground: true,
      defaultLang: "plaintext",
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return { html: String(result), toc };
}
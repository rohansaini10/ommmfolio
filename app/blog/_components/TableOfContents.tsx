"use client";

// The TOC is the ONE place we need use client — purely for the
// active-heading highlight on scroll. The actual blog content
// is still 100% server-rendered; this is just a navigation aid.

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/markdown";

interface TableOfContentsProps {
  toc: TocItem[];
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headingIds = toc.map((item) => item.id);

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first heading that's visible
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "0px 0px -70% 0px",
        threshold: 1.0,
      }
    );

    headingIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#9b9a97]">
        On this page
      </p>
      <ul className="space-y-1">
        {toc.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={[
                "block text-sm leading-relaxed transition-colors",
                item.level === 3 ? "pl-3" : "",
                activeId === item.id
                  ? "font-medium text-[#37352f]"
                  : "text-[#9b9a97] hover:text-[#37352f]",
              ].join(" ")}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(item.id)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
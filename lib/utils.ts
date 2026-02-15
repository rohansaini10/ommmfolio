import type { CSSProperties } from "react";

export function toInlineStyle(styleText: string): CSSProperties {
  const style: CSSProperties & Record<string, string> = {};

  for (const rule of styleText.split(";")) {
    const trimmed = rule.trim();
    if (!trimmed) continue;

    const [rawProperty, ...rawValueParts] = trimmed.split(":");
    if (!rawProperty || rawValueParts.length === 0) continue;

    const property = rawProperty.trim();
    const value = rawValueParts.join(":").trim();
    if (!value) continue;

    if (property.startsWith("--")) {
      style[property] = value;
      continue;
    }

    const reactProperty = property.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    style[reactProperty] = value;
  }

  return style;
}

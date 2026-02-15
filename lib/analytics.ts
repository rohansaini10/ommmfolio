import { sendGAEvent } from "@next/third-parties/google";
import posthog from "posthog-js";

declare global {
  interface UmamiWindowApi {
    track: (eventName: string, eventData?: Record<string, unknown>) => void;
  }

  interface Window {
    gtag?: (...args: unknown[]) => void;
    umami?: ((eventName: string, eventData?: Record<string, unknown>) => void) | UmamiWindowApi;
    trackAnalyticsEvent?: (
      eventName: AnalyticsEventName,
      properties?: Record<string, unknown>
    ) => void;
    __analyticsDomTrackingInitialized?: boolean;
  }
}

const GA_ID =
  typeof process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID === "string"
    ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    : "";

export const ANALYTICS_EVENT_SPEC = {
  link_clicked: {
    description: "User clicked a tracked link.",
    properties: [
      "analytics_label",
      "link_text",
      "href",
      "target",
      "is_external",
      "section",
    ],
  },
  profile_picture_clicked: {
    description: "User clicked profile picture in header.",
    properties: ["section", "element"],
  },
  experiment_accordion_toggled: {
    description: "User toggled an experiment accordion item.",
    properties: ["experiment_title", "state", "section"],
  },
  production_accordion_toggled: {
    description: "User toggled a production work accordion item.",
    properties: ["store_title", "state", "section"],
  },
  main_quest_chapter_clicked: {
    description: "User clicked a Main Quests chapter heading.",
    properties: ["chapter_title", "section"],
  },
} as const;

export type AnalyticsEventName = keyof typeof ANALYTICS_EVENT_SPEC;

/** Off in development. In production, `NEXT_PUBLIC_ANALYTICS_ENABLED=false` disables all providers. */
export function isTrackingEnabled(): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "false") return false;

  // Backward compatibility with the previous global tracking flag.
  if (
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === undefined &&
    process.env.NEXT_PUBLIC_POSTHOG_ENABLED === "false"
  ) {
    return false;
  }

  return true;
}

function isPosthogEnabled(): boolean {
  return isTrackingEnabled() && process.env.NEXT_PUBLIC_POSTHOG_ENABLED !== "false";
}

function isGAEnabled(): boolean {
  return (
    isTrackingEnabled() &&
    process.env.NEXT_PUBLIC_GA_ENABLED !== "false" &&
    GA_ID.length > 0
  );
}

function isUmamiEnabled(): boolean {
  return isTrackingEnabled() && process.env.NEXT_PUBLIC_UMAMI_ENABLED !== "false";
}

function canSendGAConfig(): boolean {
  return typeof window !== "undefined" && !!window.gtag && isGAEnabled();
}

function sendUmamiEvent(
  eventName: string,
  properties?: Record<string, unknown>
): void {
  if (!isUmamiEnabled() || typeof window === "undefined" || !window.umami) return;

  if (typeof window.umami === "function") {
    window.umami(eventName, properties);
    return;
  }

  window.umami.track(eventName, properties);
}

export function track(
  eventName: string,
  properties?: Record<string, unknown>
): void {
  if (!isTrackingEnabled()) return;

  if (isPosthogEnabled()) {
    posthog.capture(eventName, properties);
  }

  if (isGAEnabled()) {
    sendGAEvent("event", eventName, properties ?? {});
  }

  sendUmamiEvent(eventName, properties);
}

export function trackEvent(
  eventName: AnalyticsEventName,
  properties?: Record<string, unknown>
): void {
  track(eventName, properties);
}

export function identify(
  userId: string,
  traits?: Record<string, unknown>
): void {
  if (!isTrackingEnabled()) return;

  if (isPosthogEnabled()) {
    posthog.identify(userId, traits);
  }

  if (canSendGAConfig()) {
    window.gtag!("config", GA_ID, { user_id: userId });
  }
}

export function reset(): void {
  if (!isTrackingEnabled()) return;

  if (isPosthogEnabled()) {
    posthog.reset();
  }

  if (canSendGAConfig()) {
    window.gtag!("config", GA_ID, { user_id: null });
  }
}

export function captureException(error: Error): void {
  if (!isTrackingEnabled()) return;

  if (isPosthogEnabled()) {
    posthog.captureException(error);
  }

  if (isGAEnabled()) {
    sendGAEvent("event", "exception", {
      description: error.message,
    });
  }

  sendUmamiEvent("exception", {
    description: error.message,
  });
}

function isExternalHref(href: string): boolean {
  if (!href) return false;
  if (href.startsWith("mailto:")) return true;
  if (href.startsWith("/")) return false;
  if (!href.startsWith("http://") && !href.startsWith("https://")) return false;
  if (typeof window === "undefined") return true;

  try {
    const url = new URL(href, window.location.origin);
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
}

function inferSection(element: Element): string {
  if (element.closest('[data-exp-accordion="experiments"]')) return "experiments";
  if (element.closest('[data-production-accordion="production-work"]')) {
    return "production_work";
  }
  if (element.closest('[data-social-links-section="true"]')) return "social_links";
  if (element.closest('[data-main-quests-section="true"]')) return "main_quests";
  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";
  return "homepage";
}

function parseProperties(raw: string | undefined): Record<string, unknown> {
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

export function initAnalyticsDomTracking(): void {
  if (typeof window === "undefined" || window.__analyticsDomTrackingInitialized) {
    return;
  }

  window.__analyticsDomTrackingInitialized = true;
  window.trackAnalyticsEvent = trackEvent;

  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const explicitEventElement = target.closest<HTMLElement>("[data-analytics-event]");
    if (explicitEventElement?.dataset.analyticsEvent) {
      const eventName = explicitEventElement.dataset
        .analyticsEvent as AnalyticsEventName;

      if (eventName in ANALYTICS_EVENT_SPEC) {
        const props = parseProperties(
          explicitEventElement.dataset.analyticsProperties
        );
        trackEvent(eventName, props);
      }
      return;
    }

    const experimentTrigger = target.closest<HTMLElement>("[data-exp-trigger]");
    if (experimentTrigger) {
      const title =
        experimentTrigger.dataset.analyticsTitle ??
        experimentTrigger.querySelector("h3")?.textContent?.trim() ??
        "Unknown";
      trackEvent("experiment_accordion_toggled", {
        experiment_title: title,
        state: experimentTrigger.dataset.state ?? "unknown",
        section: "experiments",
      });
      return;
    }

    const productionTrigger = target.closest<HTMLElement>("[data-production-trigger]");
    if (productionTrigger) {
      const title =
        productionTrigger.dataset.analyticsTitle ??
        productionTrigger.querySelector("h3")?.textContent?.trim() ??
        "Unknown";
      trackEvent("production_accordion_toggled", {
        store_title: title,
        state: productionTrigger.dataset.state ?? "unknown",
        section: "production_work",
      });
      return;
    }

    const mainQuestTrigger = target.closest<HTMLElement>("[data-main-quest-trigger]");
    if (mainQuestTrigger) {
      const title =
        mainQuestTrigger.dataset.analyticsTitle ??
        mainQuestTrigger.querySelector("h3")?.textContent?.trim() ??
        "Unknown";
      trackEvent("main_quest_chapter_clicked", {
        chapter_title: title,
        section: "main_quests",
      });
      return;
    }

    const link = target.closest<HTMLAnchorElement>("a[data-analytics-label]");
    if (!link) return;

    const href = link.getAttribute("href") ?? "";
    trackEvent("link_clicked", {
      analytics_label: link.dataset.analyticsLabel ?? "",
      link_text: link.textContent?.trim() ?? "",
      href,
      target: link.getAttribute("target") ?? "_self",
      is_external: isExternalHref(href),
      section: inferSection(link),
    });
  });
}

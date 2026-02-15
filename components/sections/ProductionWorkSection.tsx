import { DividerDot } from "@/components/divider-dot";
import { SectionHeading } from "@/components/SectionHeading";
import { type ProjectLogo } from "@/config/data";
import { SHOPIFY_STORES } from "@/config/shopify-data";
import { toInlineStyle } from "@/lib/utils";
import { Brush, FileText, Link, Linkedin, Sparkles } from "lucide-react";
import { ExpandIcon } from "../expand-icon";

const DEFAULT_PANEL_STYLE =
  "--radix-accordion-content-height: var(--radix-collapsible-content-height); --radix-accordion-content-width: var(--radix-collapsible-content-width);";

const PRESET_LOGO_CONFIG = {
  "file-text": {
    Icon: FileText,
    badgeClassName: "bg-blue-500",
  },
  linkedin: {
    Icon: Linkedin,
    badgeClassName: "bg-blue-500",
  },
  paintbrush: {
    Icon: Brush,
    badgeClassName: "bg-gradient-to-br from-amber-400 to-orange-500",
  },
  sparkles: {
    Icon: Sparkles,
    badgeClassName: "bg-gradient-to-br from-cyan-500 to-indigo-600",
  },
} as const;

function getWorkYear(periodLabel: string): string {
  const year = periodLabel.match(/\b(19|20)\d{2}\b/);
  return year ? year[0] : "----";
}

function getHrefLabel(href: string): string {
  return href
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "");
}

function getPreviewImage(previewImage: string): string {
  return previewImage.trim().length > 0 ? previewImage : "/og-image.png";
}

function LogoBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`ml-2 flex h-[22px] w-[22px] items-center justify-center rounded-md text-white drop-shadow-xl ${className ?? "bg-blue-500"}`}
    >
      {children}
    </div>
  );
}

function ProjectLogoImage({ logo }: { logo: ProjectLogo }) {
  if (logo.kind === "image") {
    return (
      <img
        src={logo.src}
        alt={logo.alt}
        className="ml-2 rounded-md drop-shadow-xl"
        height="22"
        width="22"
      />
    );
  }

  const presetConfig = PRESET_LOGO_CONFIG[logo.name];
  const Icon = presetConfig.Icon;
  return (
    <LogoBadge className={presetConfig.badgeClassName}>
      <Icon aria-label={logo.alt} className="h-3.5 w-3.5" strokeWidth={2.25} />
    </LogoBadge>
  );
}

export function ProductionWorkSection() {
  const accordionScript = `
(() => {
  if (window.__productionAccordionInitialized) return;
  window.__productionAccordionInitialized = true;

  const container = document.querySelector('[data-production-accordion="production-work"]');
  if (!container) return;

  const setState = (item, open) => {
    const trigger = item.querySelector('[data-production-trigger]');
    const panel = item.querySelector('[data-production-panel]');
    if (!trigger || !panel) return;

    item.dataset.state = open ? 'open' : 'closed';
    trigger.dataset.state = open ? 'open' : 'closed';
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.dataset.state = open ? 'open' : 'closed';
  };

  const openPanel = (item) => {
    const panel = item.querySelector('[data-production-panel]');
    if (!panel) return;

    panel.hidden = false;
    panel.style.height = '0px';
    panel.style.opacity = '0';
    requestAnimationFrame(() => {
      panel.style.height = panel.scrollHeight + 'px';
      panel.style.opacity = '1';
    });

    const onEnd = (e) => {
      if (e.propertyName !== 'height') return;
      panel.style.height = 'auto';
      panel.removeEventListener('transitionend', onEnd);
    };
    panel.addEventListener('transitionend', onEnd);
    setState(item, true);
  };

  const closePanel = (item) => {
    const panel = item.querySelector('[data-production-panel]');
    if (!panel) return;

    panel.style.height = panel.scrollHeight + 'px';
    panel.style.opacity = '1';
    requestAnimationFrame(() => {
      panel.style.height = '0px';
      panel.style.opacity = '0';
    });

    const onEnd = (e) => {
      if (e.propertyName !== 'height') return;
      panel.hidden = true;
      panel.removeEventListener('transitionend', onEnd);
    };
    panel.addEventListener('transitionend', onEnd);
    setState(item, false);
  };

  container.querySelectorAll('[data-production-item]').forEach((item) => {
    const trigger = item.querySelector('[data-production-trigger]');
    const panel = item.querySelector('[data-production-panel]');
    if (!trigger || !panel) return;

    if (item.dataset.state === 'open') {
      panel.hidden = false;
      panel.style.height = 'auto';
      panel.style.opacity = '1';
      setState(item, true);
    } else {
      panel.hidden = true;
      panel.style.height = '0px';
      panel.style.opacity = '0';
      setState(item, false);
    }

    panel.style.overflow = 'hidden';
    panel.style.transition = 'height 300ms ease, opacity 300ms ease';

    trigger.addEventListener('click', () => {
      if (item.dataset.state === 'open') {
        closePanel(item);
      } else {
        openPanel(item);
      }
    });
  });
})();
`;

  return (
    <div className="h-full w-full">
      <SectionHeading title="Production Work" />

      <div data-production-accordion="production-work">
        {SHOPIFY_STORES.map((store, idx) => {
          const triggerId = `production-trigger-${store.id}-${idx}`;
          const contentId = `production-content-${store.id}-${idx}`;
          const isOpen = idx < 2;
          const href = store.primaryUrl;

          return (
            <div key={store.id} data-orientation="vertical">
              <div
                data-production-item
                data-state={isOpen ? "open" : "closed"}
                data-orientation="vertical"
                className=""
              >
                <h3
                  data-orientation="vertical"
                  data-state={isOpen ? "open" : "closed"}
                  className="flex"
                >
                  <button
                    data-production-trigger
                    type="button"
                    aria-controls={contentId}
                    aria-expanded={isOpen}
                    data-state={isOpen ? "open" : "closed"}
                    data-orientation="vertical"
                    id={triggerId}
                    data-analytics-title={store.title}
                    className="group flex flex-1 items-center justify-between py-4 transition-all [&[data-state=open]>div>div>svg]:rotate-180"
                    data-radix-collection-item=""
                  >
                    <div className="flex items-center">
                      <div className="flex h-[22px] w-[22px] items-center justify-center rounded-sm bg-[#e9ecef] p-px transition duration-300 group-hover:bg-zinc-300">
                        <ExpandIcon />
                      </div>
                      <div className="group mx-2 ml-4 flex items-center border-b-2 border-dashed border-[#e9ecef] text-black transition duration-300 hover:border-zinc-600 hover:text-[#333]">
                        <h3 className="whitespace-nowrap text-xl font-semibold italic">{store.title}</h3>
                        <ProjectLogoImage logo={store.logo} />
                      </div>
                    </div>
                    <h4 className="italic text-zinc-500">{getWorkYear(store.periodLabel)}</h4>
                  </button>
                </h3>

                <div
                  data-production-panel
                  data-state={isOpen ? "open" : "closed"}
                  id={contentId}
                  role="region"
                  aria-labelledby={triggerId}
                  data-orientation="vertical"
                  className="relative w-[105%] overflow-hidden pr-[5%]"
                  style={toInlineStyle(DEFAULT_PANEL_STYLE)}
                  hidden={!isOpen}
                >
                  <div className="min-h-0 overflow-hidden pb-4 pt-0">
                    <div className="flex w-full flex-col justify-between md:flex-row">
                      <div className="mr-0 flex-1 md:mr-3">
                        <p className="mb-2 leading-[180%]">{store.summary}</p>
                        <a
                          href={href}
                          target="_blank"
                          data-analytics-label={`🏬 ${store.title} [Production Work Click]`}
                        >
                          <h4 className="flex w-fit items-center border-b border-dashed border-transparent font-medium italic text-blue-500 transition duration-300 hover:border-blue-500">
                            {getHrefLabel(href)}
                            <Link width="1.5em" height="1.5em" strokeWidth="2" className="ml-1 text-xs" />
                          </h4>
                        </a>
                        <div className="mt-2 flex flex-wrap items-center text-base italic text-[#9CA3AF]">
                          {store.technologies.slice(0, 3).map((tag, tagIndex) => (
                            <div key={`${store.id}-${tag}`} className="flex items-center">
                              {tagIndex > 0 && <DividerDot />}
                              <h5>{tag}</h5>
                            </div>
                          ))}
                        </div>
                      </div>
                      <img
                        src={getPreviewImage(store.previewImage)}
                        className="mb-1 mt-5 aspect-auto h-auto w-full rounded-sm object-contain drop-shadow-lg md:mt-0 md:w-[240px]"
                        width="240"
                        alt={`${store.title} preview`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <script dangerouslySetInnerHTML={{ __html: accordionScript }} />
    </div>
  );
}

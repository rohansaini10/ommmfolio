import type { ComponentType, SVGProps } from "react";
import {
  BuyMeaCoffee,
  Cal,
  DevTo,
  Discord,
  Facebook,
  Fiverr,
  GitHub,
  Instagram,
  KoFi,
  LinkedIn,
  Medium,
  NPM,
  PayPal,
  ShopifyGlyph,
  SuperTeamEarn,
  Telegram,
  Topmate,
  Upwork,
  XLogo,
  YouTube,
} from "@/components/icons";

type SocialPlatform = {
  name: string;
  href: string;
  hoverBorderClass: string;
  icon:
  | {
    kind: "svg";
    Component: ComponentType<SVGProps<SVGSVGElement>>;
    label: string;
  }
  | {
    kind: "image";
    src: string;
    alt: string;
  };
};

const SOCIAL_LINKS: SocialPlatform[] = [
  {
    name: "Shopify Developer Agency",
    href: "https://shopify.omsharma.xyz/",
    hoverBorderClass: "hover:border-[#7ab55c]",
    icon: {
      kind: "image",
      src: ShopifyGlyph,
      alt: "Shopify glyph",
    },
  },
  {
    name: "Twitter",
    href: "https://x.com/1omsharma",
    hoverBorderClass: "hover:border-black",
    icon: {
      kind: "image",
      src: XLogo,
      alt: "X logo",
    },
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/1omsharma/",
    hoverBorderClass: "hover:border-[#0A66C2]",
    icon: { kind: "svg", Component: LinkedIn, label: "LinkedIn icon" },
  },
  {
    name: "GitHub",
    href: "https://github.com/coderomm",
    hoverBorderClass: "hover:border-black",
    icon: { kind: "svg", Component: GitHub, label: "GitHub icon" },
  },
  {
    name: "Discord (coder.om)",
    href: "https://discord.com/channels/@me",
    hoverBorderClass: "hover:border-[#5865F2]",
    icon: { kind: "svg", Component: Discord, label: "Discord icon" },
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/coder.om/",
    hoverBorderClass: "hover:border-[#E26548]",
    icon: { kind: "svg", Component: Instagram, label: "Instagram icon" },
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@coder_om",
    hoverBorderClass: "hover:border-[#FF0000]",
    icon: { kind: "svg", Component: YouTube, label: "YouTube icon" },
  },
  {
    name: "Telegram",
    href: "https://t.me/coder_om",
    hoverBorderClass: "hover:border-[#229ED9]",
    icon: { kind: "svg", Component: Telegram, label: "Telegram icon" },
  },
  {
    name: "Medium",
    href: "https://medium.com/@1omsharma",
    hoverBorderClass: "hover:border-[#12100E]",
    icon: {
      kind: "image",
      src: Medium,
      alt: "Medium logo",
    },
  },
  {
    name: "DEV",
    href: "https://dev.to/coderom",
    hoverBorderClass: "hover:border-[#0a0a0a]",
    icon: {
      kind: "image",
      src: DevTo,
      alt: "DEV logo",
    },
  },
  {
    name: "Topmate",
    href: "https://topmate.io/coderom/",
    hoverBorderClass: "hover:border-[#16a34a]",
    icon: {
      kind: "image",
      src: Topmate,
      alt: "Topmate logo",
    },
  },
  {
    name: "Superteam Earn",
    href: "https://earn.superteam.fun/t/omsharma",
    hoverBorderClass: "hover:border-[#06b6d4]",
    icon: {
      kind: "image",
      src: SuperTeamEarn,
      alt: "Superteam Earn logo",
    },
  },
  {
    name: "npm",
    href: "https://www.npmjs.com/~coderom",
    hoverBorderClass: "hover:border-[#CB3837]",
    icon: { kind: "svg", Component: NPM, label: "npm icon" },
  },
  {
    name: "Cal.com",
    href: "https://cal.com/om-sharma",
    hoverBorderClass: "hover:border-black",
    icon: {
      kind: "image",
      src: Cal,
      alt: "Cal.com logo",
    },
  },
  {
    name: "PayPal",
    href: "https://paypal.me/1omsharma",
    hoverBorderClass: "hover:border-[#003087]",
    icon: { kind: "svg", Component: PayPal, label: "PayPal icon" },
  },
  {
    name: "Upwork",
    href: "https://www.upwork.com/freelancers/~0197e761ded7f7e7b2",
    hoverBorderClass: "hover:border-[#6fda44]",
    icon: {
      kind: "image",
      src: Upwork,
      alt: "Upwork logo",
    },
  },
  {
    name: "Fiverr",
    href: "https://www.fiverr.com/dev_omsharma",
    hoverBorderClass: "hover:border-[#1DBF73]",
    icon: {
      kind: "image",
      src: Fiverr,
      alt: "Fiverr logo",
    },
  },
  {
    name: "Buy Me a Chai",
    href: "https://buymeachai.ezee.li/omsharma",
    hoverBorderClass: "hover:border-[#FFDD00]",
    icon: { kind: "svg", Component: BuyMeaCoffee, label: "Buy me a chai icon" },
  },
  {
    name: "Ko-fi",
    href: "https://ko-fi.com/1omsharma",
    hoverBorderClass: "hover:border-[#29ABE0]",
    icon: {
      kind: "image",
      src: KoFi,
      alt: "Ko-fi logo",
    },
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100026688728467",
    hoverBorderClass: "hover:border-[#0866ff]",
    icon: { kind: "svg", Component: Facebook, label: "Facebook icon" },
  },
];

export function SocialLinksSection() {
  return (
    <section className="mt-6" data-social-links-section="true">
      <div className="my-5 flex w-full items-center">
        <div className="h-[2px] flex-1 rounded-full bg-[#e9ecef]"></div>
        <h4 className="vulf-mono mx-2 text-sm font-normal italic text-zinc-300">My Socials</h4>
        <div className="h-[2px] w-[5%] rounded-full bg-[#e9ecef]"></div>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 leading-[180%]">
        {SOCIAL_LINKS.map((platform) => (
          <a
            key={platform.name}
            href={platform.href}
            target="_blank" rel="noopener noreferrer"
            data-analytics-label={`🌐 ${platform.name} [Link Click]`}
          >
            <div
              className={`group flex items-center border-b-2 border-dashed border-[#e9ecef] text-black transition duration-300 hover:text-[#333] ${platform.hoverBorderClass}`}
            >
              <h4 className="whitespace-nowrap font-semibold italic">{platform.name}</h4>
              {platform.icon.kind === "svg" ? (
                <platform.icon.Component
                  aria-label={platform.icon.label}
                  className="ml-2 rounded"
                  height="22"
                  width="22"
                />
              ) : (
                <img
                  src={platform.icon.src}
                  alt={platform.icon.alt}
                  className="ml-2 rounded"
                  height="22"
                  width="22"
                />
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

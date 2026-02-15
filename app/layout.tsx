import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { appMetadata, jsonLdSchema } from "@/config/metadata";
import "./globals.css";

const covikSans = localFont({
  variable: "--font-covik-sans",
  src: [
    {
      path: "../public/fonts/covik-sans-font-family/CovikSansDemo-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/covik-sans-font-family/CovikSansDemo-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/covik-sans-font-family/CovikSansDemo-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/covik-sans-font-family/CovikSansDemo-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/covik-sans-font-family/CovikSansDemo-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/covik-sans-font-family/CovikSansDemo-SemiboldItalic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../public/fonts/covik-sans-font-family/CovikSansDemo-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/covik-sans-font-family/CovikSansDemo-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/covik-sans-font-family/CovikSansDemo-Black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/covik-sans-font-family/CovikSansDemo-BlackItalic.otf",
      weight: "900",
      style: "italic",
    },
  ],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vulfMono = localFont({
  variable: "--font-vulf-mono",
  src: [
    {
      path: "../public/fonts/vulf-mono-font-family/VulfMonoDemo-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/vulf-mono-font-family/VulfMonoDemo-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/vulf-mono-font-family/VulfMonoDemo-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/vulf-mono-font-family/VulfMonoDemo-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/vulf-mono-font-family/VulfMonoDemo-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/vulf-mono-font-family/VulfMonoDemo-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/vulf-mono-font-family/VulfMonoDemo-Black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/vulf-mono-font-family/VulfMonoDemo-BlackItalic.otf",
      weight: "900",
      style: "italic",
    },
  ],
});

export const metadata: Metadata = appMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isGlobalAnalyticsEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false";
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const isUmamiScriptEnabled = isGlobalAnalyticsEnabled && process.env.NEXT_PUBLIC_UMAMI_ENABLED !== "false";

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
        {isUmamiScriptEnabled ? (
          <script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id={umamiWebsiteId}
          ></script>
        ) : null}
      </head>
      <body
        className={`${covikSans.variable} ${geistMono.variable} ${vulfMono.variable} antialiased`}
      >
        {children}
        {isGlobalAnalyticsEnabled &&
          gaMeasurementId && gaMeasurementId.length > 0 &&
          process.env.NEXT_PUBLIC_GA_ENABLED !== "false" ? (
          <GoogleAnalytics gaId={gaMeasurementId} />
        ) : null}
      </body>
    </html>
  );
}

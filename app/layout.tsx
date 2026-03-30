import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import "./globals.css";

const displayFont = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tenanthawk.alessioquagliara.com"),
  title: {
    default: "TenantHawk | Fast Multi-Tenant SaaS Template",
    template: "%s | TenantHawk",
  },
  description:
    "TenantHawk e un template SaaS multi-tenant open source (MIT): FastAPI backend, Next.js landing, Stripe billing, n8n automation, Traefik reverse proxy e LiteLLM.",
  keywords: [
    "TenantHawk",
    "FastAPI",
    "Next.js",
    "SaaS template",
    "multi-tenant",
    "MIT",
    "Alessio Quagliara",
    "LinkBayCMS",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "it-IT": "/",
      "en-US": "/",
      "es-ES": "/",
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/apple-icon.svg",
  },
  openGraph: {
    type: "website",
    url: "https://tenanthawk.alessioquagliara.com",
    siteName: "TenantHawk",
    locale: "it_IT",
    title: "TenantHawk | Fast Multi-Tenant SaaS Template",
    description:
      "Build and ship a production-ready SaaS faster: FastAPI + admin + infra + marketing landing.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TenantHawk | Fast Multi-Tenant SaaS Template",
    description:
      "Open source MIT template by Alessio Quagliara. FastAPI, Stripe, n8n, Traefik, LiteLLM and Next.js.",
  },
  creator: "Alessio Quagliara",
  authors: [{ name: "Alessio Quagliara" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

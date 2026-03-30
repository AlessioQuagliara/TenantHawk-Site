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
    "TenantHawk e un template SaaS multi-tenant open source MIT creato da Alessio Quagliara: FastAPI backend, Next.js marketing site, Stripe billing, n8n automation, Traefik e LiteLLM.",
  keywords: [
    "TenantHawk",
    "multi-tenant SaaS template",
    "open source SaaS template",
    "MIT SaaS template",
    "FastAPI",
    "Next.js",
    "SaaS template",
    "multi-tenant",
    "MIT",
    "Alessio Quagliara",
    "LinkBayCMS",
  ],
  alternates: {
    canonical: "/?lang=it",
    languages: {
      "it-IT": "/?lang=it",
      "en-US": "/?lang=en",
      "es-ES": "/?lang=es",
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
    title: "TenantHawk | Multi-Tenant SaaS Template Open Source",
    description:
      "MIT open source multi-tenant SaaS template by Alessio Quagliara with FastAPI, Next.js, Stripe, n8n, Traefik and LiteLLM.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TenantHawk | Multi-Tenant SaaS Template Open Source",
    description:
      "Open source MIT multi-tenant SaaS template by Alessio Quagliara.",
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

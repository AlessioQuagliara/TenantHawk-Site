import Link from "next/link";
import Image from "next/image";
import { MarketingShell } from "@/app/components/marketing-shell";
import type { Metadata } from "next";
import { getLocaleFromSearchParams, homeText, localize, navText, withLang } from "@/app/lib/i18n";
import { getRepositorySlug } from "@/app/lib/github";

export const metadata: Metadata = {
  title: "TenantHawk - Multi-tenant SaaS senza complessita inutile",
  description:
    "Costruisci SaaS multi-tenant piu velocemente con base FastAPI, HTMX, Traefik e integrazione GitHub release.",
  alternates: {
    canonical: "/",
  },
};

export const revalidate = 3600;

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomeProps) {
  const locale = await getLocaleFromSearchParams(searchParams);
  const repo = getRepositorySlug();
  const repoUrl = `https://github.com/${repo}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "TenantHawk",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        license: "https://opensource.org/license/mit/",
        url: "https://tenanthawk.alessioquagliara.com",
        creator: {
          "@type": "Person",
          name: "Alessio Quagliara",
        },
      },
      {
        "@type": "Person",
        name: "Alessio Quagliara",
        url: "https://github.com/AlessioQuagliara",
      },
      {
        "@type": "Organization",
        name: "TenantHawk",
        url: "https://tenanthawk.alessioquagliara.com",
      },
    ],
  };

  return (
    <MarketingShell locale={locale} currentPath="/">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="th-card th-fade-up relative overflow-hidden rounded-3xl border p-5 sm:p-8 lg:p-10">
        <div className="th-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
        <section className="th-fade-up-delay relative z-10 grid gap-6">
          <div>
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-[#ffd84d]">
              <Image src="/logo-mark.svg" alt="TenantHawk logo mark" width={18} height={22} className="h-5 w-auto" />
              <p>{localize(homeText.seoTitle, locale)}</p>
            </div>
            <h1 className="mt-3 text-4xl leading-[0.96] text-white sm:text-6xl lg:text-7xl">{localize(homeText.h1, locale)}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#d8dfec] sm:text-lg">
              {localize(homeText.subtitle, locale)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="th-bolt th-glow rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#090c12]"
              >
                {localize(homeText.cta.accessTemplate, locale)}
              </a>
              <Link
                href={withLang("/docs", locale)}
                className="rounded-full border border-[#2a3448] px-6 py-3 font-semibold uppercase tracking-[0.12em] text-[#f4f7fb] transition hover:border-[#ffd84d]"
              >
                {localize(navText.docs, locale)}
              </Link>
              <Link
                href={withLang("/changelog", locale)}
                className="rounded-full border border-[#2a3448] px-6 py-3 font-semibold uppercase tracking-[0.12em] text-[#f4f7fb] transition hover:border-[#ffd84d]"
              >
                Latest releases
              </Link>
            </div>
          </div>
        </section>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="th-card th-float rounded-2xl p-6">
          <h2 className="text-3xl text-white sm:text-4xl">{localize(homeText.sections.problemTitle, locale)}</h2>
          <p className="mt-4 text-sm leading-7 text-[#b8c2d6] sm:text-base">{localize(homeText.sections.problemBody, locale)}</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#b8c2d6] sm:text-base">
            {homeText.sections.problemBullets.map((bullet) => (
              <li key={bullet.it}>{localize(bullet, locale)}</li>
            ))}
          </ul>
        </article>
        <article className="th-card th-float th-float-delay-1 rounded-2xl p-6">
          <h2 className="text-3xl text-white sm:text-4xl">{localize(homeText.sections.solutionTitle, locale)}</h2>
          <p className="mt-4 text-sm leading-7 text-[#b8c2d6] sm:text-base">{localize(homeText.sections.solutionBody, locale)}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={withLang("/architecture", locale)} className="rounded-full border border-[#2a3448] px-4 py-2 text-sm text-[#f4f7fb] hover:border-[#ffd84d]">
              {localize(navText.architecture, locale)}
            </Link>
            <Link href={withLang("/use-cases", locale)} className="rounded-full border border-[#2a3448] px-4 py-2 text-sm text-[#f4f7fb] hover:border-[#ffd84d]">
              {localize(navText.useCases, locale)}
            </Link>
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="th-card th-float rounded-2xl p-6">
          <h2 className="text-3xl text-white sm:text-4xl">{localize(homeText.sections.howTitle, locale)}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#b8c2d6] sm:text-base">
            {homeText.sections.howBullets.map((bullet) => (
              <li key={bullet.it}>{localize(bullet, locale)}</li>
            ))}
          </ul>
        </article>
        <article className="th-card th-float th-float-delay-2 rounded-2xl p-6">
          <h2 className="text-3xl text-white sm:text-4xl">{localize(homeText.sections.audienceTitle, locale)}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#b8c2d6] sm:text-base">
            {homeText.sections.audienceBullets.map((bullet) => (
              <li key={bullet.it}>{localize(bullet, locale)}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="th-card th-float rounded-3xl p-6 sm:p-7 lg:p-8">
        <h2 className="text-3xl text-white sm:text-4xl">{localize(homeText.cta.title, locale)}</h2>
        <p className="mt-3 text-sm text-[#b8c2d6] sm:text-base">{localize(homeText.cta.subtitle, locale)}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="th-bolt rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-[0.1em]"
          >
            {localize(homeText.cta.accessTemplate, locale)}
          </a>
          <Link href={withLang("/docs", locale)} className="rounded-full border border-[#2a3448] px-5 py-2 text-sm text-[#f4f7fb] hover:border-[#ffd84d]">
            {localize(navText.docs, locale)}
          </Link>
          <Link href={withLang("/changelog", locale)} className="rounded-full border border-[#2a3448] px-5 py-2 text-sm text-[#f4f7fb] hover:border-[#ffd84d]">
            Latest releases
          </Link>
        </div>
        <div className="mt-6 text-sm text-[#b8c2d6]">
          <Link href={withLang("/features", locale)} className="mr-4 underline decoration-[#ffd84d]/70 underline-offset-4 hover:text-[#ffe866]">
            {localize(navText.features, locale)}
          </Link>
          <Link href={withLang("/architecture", locale)} className="mr-4 underline decoration-[#ffd84d]/70 underline-offset-4 hover:text-[#ffe866]">
            {localize(navText.architecture, locale)}
          </Link>
          <Link href={withLang("/docs", locale)} className="underline decoration-[#ffd84d]/70 underline-offset-4 hover:text-[#ffe866]">
            {localize(navText.docs, locale)}
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/app/components/marketing-shell";
import { architectureText, ctaText, getLocaleFromSearchParams, languageAlternates, localize, seoLocaleCode, withLang } from "@/app/lib/i18n";

type ArchitecturePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: ArchitecturePageProps): Promise<Metadata> {
  const locale = await getLocaleFromSearchParams(searchParams);

  return {
    title: localize(architectureText.seoTitle, locale),
    description: localize(architectureText.seoDescription, locale),
    alternates: {
      canonical: withLang("/architecture", locale),
      languages: languageAlternates("/architecture"),
    },
    openGraph: {
      title: localize(architectureText.seoTitle, locale),
      description: localize(architectureText.seoDescription, locale),
      url: withLang("/architecture", locale),
      locale: seoLocaleCode[locale],
      type: "website",
    },
  };
}

export default async function ArchitecturePage({ searchParams }: ArchitecturePageProps) {
  const locale = await getLocaleFromSearchParams(searchParams);

  return (
    <MarketingShell locale={locale} currentPath="/architecture">
      <header className="th-card th-fade-up rounded-3xl p-6 sm:p-8">
        <h1 className="text-4xl text-white sm:text-6xl">{localize(architectureText.h1, locale)}</h1>
        <p className="mt-4 text-sm leading-7 text-[#b8c2d6] sm:text-base">{localize(architectureText.intro, locale)}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {architectureText.blocks.map((block, index) => (
          <article
            key={block.title.it}
            className={`th-card th-float rounded-2xl p-6 ${index % 3 === 1 ? "th-float-delay-1" : ""} ${index % 3 === 2 ? "th-float-delay-2" : ""}`}
          >
            <h2 className="text-2xl text-white sm:text-3xl">{localize(block.title, locale)}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#b8c2d6] sm:text-base">
              {block.bullets.map((bullet) => (
                <li key={bullet.it}>{localize(bullet, locale)}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="th-card rounded-2xl p-6">
        <h2 className="text-2xl text-white sm:text-3xl">{localize(architectureText.philosophyTitle, locale)}</h2>
        <p className="mt-3 text-sm leading-7 text-[#b8c2d6] sm:text-base">{localize(architectureText.philosophyBody, locale)}</p>
        <div className="mt-6 text-sm text-[#b8c2d6]">
          <Link href={withLang("/why", locale)} className="underline decoration-[#ffd84d]/70 underline-offset-4 hover:text-[#ffe866]">
            {localize(ctaText.readStory, locale)}
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}

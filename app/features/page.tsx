import type { Metadata } from "next";
import { MarketingShell } from "@/app/components/marketing-shell";
import { featuresText, getLocaleFromSearchParams, localize, withLang } from "@/app/lib/i18n";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TenantHawk Features",
  description: "Feature principali TenantHawk per creare SaaS multi-tenant affidabili.",
  alternates: { canonical: "/features" },
};

type FeaturesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FeaturesPage({ searchParams }: FeaturesPageProps) {
  const locale = await getLocaleFromSearchParams(searchParams);

  return (
    <MarketingShell locale={locale} currentPath="/features">
      <header className="th-card th-fade-up rounded-3xl p-6 sm:p-8">
        <h1 className="text-4xl text-white sm:text-6xl">{localize(featuresText.h1, locale)}</h1>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuresText.items.map((item, index) => (
          <article
            key={item.title.it}
            className={`th-card th-float rounded-2xl p-5 ${index % 3 === 1 ? "th-float-delay-1" : ""} ${index % 3 === 2 ? "th-float-delay-2" : ""}`}
          >
            <h2 className="text-2xl text-white">{localize(item.title, locale)}</h2>
            <p className="mt-3 text-sm leading-7 text-[#b8c2d6]">{localize(item.description, locale)}</p>
          </article>
        ))}
      </section>

      <section className="th-card rounded-2xl p-6 text-sm text-[#b8c2d6]">
        <Link href={withLang("/architecture", locale)} className="underline decoration-[#ffd84d]/70 underline-offset-4 hover:text-[#ffe866]">
          Explore architecture
        </Link>
      </section>
    </MarketingShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/app/components/marketing-shell";
import { getLocaleFromSearchParams, localize, whyText, withLang } from "@/app/lib/i18n";

export const metadata: Metadata = {
  title: "Why TenantHawk",
  description: "Perché TenantHawk esiste: ridurre complessita e costruire basi solide.",
  alternates: { canonical: "/why" },
};

type WhyPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function WhyPage({ searchParams }: WhyPageProps) {
  const locale = await getLocaleFromSearchParams(searchParams);

  return (
    <MarketingShell locale={locale} currentPath="/why">
      <header className="th-card th-fade-up rounded-3xl p-6 sm:p-8">
        <h1 className="text-4xl text-white sm:text-6xl">{localize(whyText.h1, locale)}</h1>
        <p className="mt-4 text-sm leading-7 text-[#b8c2d6] sm:text-base">{localize(whyText.body, locale)}</p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="th-card th-float rounded-2xl p-6">
          <h2 className="text-2xl text-white sm:text-3xl">{localize(whyText.objectiveTitle, locale)}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#b8c2d6] sm:text-base">
            {whyText.objectiveBullets.map((bullet) => (
              <li key={bullet.it}>{localize(bullet, locale)}</li>
            ))}
          </ul>
        </article>
        <article className="th-card th-float th-float-delay-1 rounded-2xl p-6">
          <h2 className="text-2xl text-white sm:text-3xl">{localize(whyText.philosophyTitle, locale)}</h2>
          <p className="mt-4 text-sm leading-7 text-[#b8c2d6] sm:text-base">{localize(whyText.philosophyBody, locale)}</p>
        </article>
      </section>

      <section className="th-card rounded-2xl p-6 text-sm text-[#b8c2d6]">
        <Link href={withLang("/docs", locale)} className="underline decoration-[#ffd84d]/70 underline-offset-4 hover:text-[#ffe866]">
          Explore docs
        </Link>
      </section>
    </MarketingShell>
  );
}

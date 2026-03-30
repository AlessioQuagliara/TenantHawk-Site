import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/app/components/marketing-shell";
import { getLocaleFromSearchParams, localize, useCasesText, withLang } from "@/app/lib/i18n";

export const metadata: Metadata = {
  title: "TenantHawk Use Cases",
  description: "Casi d'uso reali dove TenantHawk accelera prodotti multi-tenant.",
  alternates: { canonical: "/use-cases" },
};

type UseCasesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function UseCasesPage({ searchParams }: UseCasesPageProps) {
  const locale = await getLocaleFromSearchParams(searchParams);

  return (
    <MarketingShell locale={locale} currentPath="/use-cases">
      <header className="th-card th-fade-up rounded-3xl p-6 sm:p-8">
        <h1 className="text-4xl text-white sm:text-6xl">{localize(useCasesText.h1, locale)}</h1>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {useCasesText.items.map((item, index) => (
          <article
            key={item.title.it}
            className={`th-card th-float rounded-2xl p-6 ${index % 3 === 1 ? "th-float-delay-1" : ""} ${index % 3 === 2 ? "th-float-delay-2" : ""}`}
          >
            <h2 className="text-2xl text-white sm:text-3xl">{localize(item.title, locale)}</h2>
            <p className="mt-3 text-sm leading-7 text-[#b8c2d6] sm:text-base">{localize(item.description, locale)}</p>
          </article>
        ))}
      </section>

      <section className="th-card rounded-2xl p-6 text-sm text-[#b8c2d6]">
        <Link href={withLang("/features", locale)} className="underline decoration-[#ffd84d]/70 underline-offset-4 hover:text-[#ffe866]">
          See all features
        </Link>
      </section>
    </MarketingShell>
  );
}

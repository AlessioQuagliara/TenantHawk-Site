import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/app/components/marketing-shell";
import { formatDate, getLatestReleases, getRepositorySlug } from "@/app/lib/github";
import { changelogText, ctaText, getLocaleFromSearchParams, languageAlternates, localize, seoLocaleCode, withLang } from "@/app/lib/i18n";

export const revalidate = 3600;

type ChangelogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: ChangelogPageProps): Promise<Metadata> {
  const locale = await getLocaleFromSearchParams(searchParams);

  return {
    title: localize(changelogText.seoTitle, locale),
    description: localize(changelogText.seoDescription, locale),
    alternates: {
      canonical: withLang("/changelog", locale),
      languages: languageAlternates("/changelog"),
    },
    openGraph: {
      title: localize(changelogText.seoTitle, locale),
      description: localize(changelogText.seoDescription, locale),
      url: withLang("/changelog", locale),
      locale: seoLocaleCode[locale],
      type: "website",
    },
  };
}

export default async function ChangelogPage({ searchParams }: ChangelogPageProps) {
  const locale = await getLocaleFromSearchParams(searchParams);
  const localeForDate = locale === "it" ? "it-IT" : locale === "es" ? "es-ES" : "en-US";
  const releases = await getLatestReleases(12);
  const repo = getRepositorySlug();
  const releasesUrl = `https://github.com/${repo}/releases`;

  return (
    <MarketingShell locale={locale} currentPath="/changelog">
      <header className="th-card th-fade-up rounded-2xl p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-[#ffd84d]">TenantHawk</p>
        <h1 className="mt-2 text-5xl leading-none text-white sm:text-6xl">{localize(changelogText.h1, locale)}</h1>
        <p className="mt-4 max-w-2xl text-sm text-[#b8c2d6] sm:text-base">{localize(changelogText.intro, locale)}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={withLang("/", locale)}
            className="rounded-full border border-[#2a3448] px-5 py-2 text-sm text-[#f4f7fb] transition hover:border-[#ffd84d]"
          >
            {localize(changelogText.backHome, locale)}
          </Link>
          <a
            href={releasesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="th-bolt rounded-full px-5 py-2 text-sm font-semibold text-[#090c12]"
          >
            {localize(changelogText.viewReleases, locale)}
          </a>
        </div>
      </header>

      {releases.length === 0 ? (
        <section className="th-card rounded-2xl p-6 text-[#b8c2d6]">
          {localize(
            {
              it: "Nessuna release disponibile al momento. Consulta direttamente GitHub.",
              en: "No releases available at the moment. Check GitHub directly.",
              es: "No hay releases disponibles por ahora. Consulta GitHub directamente.",
            },
            locale
          )}
        </section>
      ) : (
        <section className="grid gap-4">
          {releases.map((release) => (
            <article key={release.id} className="th-card rounded-2xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-3xl text-white sm:text-4xl">{release.name}</h2>
                <span className="rounded-full border border-[#2a3448] px-3 py-1 text-xs text-[#b8c2d6]">
                  {formatDate(release.publishedAt, localeForDate)}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#ffd84d]">
                {release.tagName}
              </p>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#b8c2d6] sm:text-base">
                {release.body || localize({ it: "Note release non disponibili nella risposta API.", en: "Release notes not available in the API response.", es: "Notas de la release no disponibles en la respuesta de la API." }, locale)}
              </p>
              <a
                href={release.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block text-sm font-semibold text-[#ffe866] underline decoration-[#ffd84d]/60 underline-offset-4"
              >
                {localize(ctaText.openRelease, locale)}
              </a>
            </article>
          ))}
        </section>
      )}
    </MarketingShell>
  );
}

import Link from "next/link";
import Image from "next/image";
import { LOCALES, Locale, languageNames, localize, navText, withLang } from "@/app/lib/i18n";

type MarketingNavProps = {
  locale: Locale;
  currentPath: string;
};

const NAV_ITEMS = [
  { href: "/", label: navText.home },
  { href: "/features", label: navText.features },
  { href: "/use-cases", label: navText.useCases },
  { href: "/architecture", label: navText.architecture },
  { href: "/why", label: navText.why },
  { href: "/docs", label: navText.docs },
] as const;

export function MarketingNav({ locale, currentPath }: MarketingNavProps) {
  return (
    <nav className="th-nav-float">
      <div className="th-nav-shell rounded-2xl px-4 py-3 sm:px-5">
        <div className="hidden items-center justify-between gap-3 md:flex">
          <Link href={withLang("/", locale)} className="inline-flex items-center gap-2.5">
            <Image src="/logo-mark.svg" alt="TenantHawk logo mark" width={26} height={32} className="h-8 w-auto" />
            <span className="display-font text-2xl text-white">TenantHawk</span>
          </Link>

          <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-[#b8c2d6] md:text-xs">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === currentPath;

              return (
                <Link
                  key={item.href}
                  href={withLang(item.href, locale)}
                  className={`rounded-full px-2 py-1 transition hover:text-[#ffe866] ${isActive ? "text-[#ffe866]" : ""}`}
                >
                  {localize(item.label, locale)}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1 rounded-full border border-[#2a3448] bg-[#0b111a] p-1 text-[10px] uppercase tracking-[0.12em] md:text-xs">
            {LOCALES.map((nextLocale) => (
              <Link
                key={nextLocale}
                href={withLang(currentPath, nextLocale)}
                className={`rounded-full px-2 py-1 ${locale === nextLocale ? "th-bolt font-semibold" : "text-[#b8c2d6] hover:text-[#ffe866]"}`}
              >
                {languageNames[nextLocale]}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 md:hidden">
          <Link href={withLang("/", locale)} className="inline-flex items-center gap-2">
            <Image src="/logo-mark.svg" alt="TenantHawk logo mark" width={22} height={27} className="h-7 w-auto" />
            <span className="display-font text-2xl text-white">TenantHawk</span>
          </Link>

          <details className="group relative">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-[#2a3448] bg-[#0b111a] text-[#ffe866]">
              <svg className="h-5 w-5 group-open:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              </svg>
              <svg className="hidden h-5 w-5 group-open:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M18 6l-12 12" />
              </svg>
            </summary>

            <div className="absolute right-0 z-20 mt-3 w-72 max-w-[90vw] origin-top-right rounded-xl border border-[#2a3448] bg-[#0b111a] p-3 shadow-[0_12px_28px_rgba(0,0,0,0.38)]">
              <div className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.16em] text-[#b8c2d6]">
                {NAV_ITEMS.map((item) => {
                  const isActive = item.href === currentPath;

                  return (
                    <Link
                      key={item.href}
                      href={withLang(item.href, locale)}
                      className={`rounded-lg px-2 py-2 transition hover:bg-[#151e2d] hover:text-[#ffe866] ${isActive ? "text-[#ffe866]" : ""}`}
                    >
                      {localize(item.label, locale)}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-3 flex w-max items-center gap-1 rounded-full border border-[#2a3448] bg-[#0a0e17] p-1 text-[10px] uppercase tracking-[0.12em]">
                {LOCALES.map((nextLocale) => (
                  <Link
                    key={nextLocale}
                    href={withLang(currentPath, nextLocale)}
                    className={`rounded-full px-2 py-1 ${locale === nextLocale ? "th-bolt font-semibold" : "text-[#b8c2d6] hover:text-[#ffe866]"}`}
                  >
                    {languageNames[nextLocale]}
                  </Link>
                ))}
              </div>
            </div>
          </details>
        </div>
      </div>
    </nav>
  );
}

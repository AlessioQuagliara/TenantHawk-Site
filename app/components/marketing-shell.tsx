import { MarketingNav } from "@/app/components/marketing-nav";
import { Locale, commonText, localize } from "@/app/lib/i18n";

type MarketingShellProps = {
  locale: Locale;
  currentPath: string;
  children: React.ReactNode;
};

export function MarketingShell({ locale, currentPath, children }: MarketingShellProps) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-6 sm:px-7 sm:py-8 md:px-8 md:py-10 md:pb-32">
      <MarketingNav locale={locale} currentPath={currentPath} />

      {children}

      <footer className="th-floating-footer rounded-2xl px-4 py-3 text-center text-[11px] text-[#9fadca] sm:px-5 sm:py-4 sm:text-sm">
        <p>{localize(commonText.footer, locale)}</p>
      </footer>
    </main>
  );
}

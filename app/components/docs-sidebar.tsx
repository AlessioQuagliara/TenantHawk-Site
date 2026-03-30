import Link from "next/link";
import { Locale, localize, withLang } from "@/app/lib/i18n";

type DocsSidebarProps = {
  locale: Locale;
};

type LocalizedText = Record<Locale, string>;

function t(it: string, en: string, es: string): LocalizedText {
  return { it, en, es };
}

const DOCS_SECTIONS: Array<{ id: string; title: LocalizedText }> = [
  { id: "foundation-web2-web3", title: t("Web2 oggi, Web3 domani", "Web2 today, Web3 tomorrow", "Web2 hoy, Web3 manana") },
  { id: "use-cases", title: t("Casi d'uso", "Use cases", "Casos de uso") },
  { id: "production-docker", title: t("Produzione: Docker + TLS", "Production: Docker + TLS", "Produccion: Docker + TLS") },
  { id: "local-development", title: t("Sviluppo locale", "Local development", "Desarrollo local") },
  { id: "cli-modules", title: t("CLI: moduli admin", "CLI: admin modules", "CLI: modulos admin") },
  { id: "testing-k6", title: t("Test velocita con k6", "Speed tests with k6", "Pruebas de velocidad con k6") },
  { id: "litellm-gdpr", title: t("LiteLLM, policy e GDPR", "LiteLLM, policy and GDPR", "LiteLLM, politica y GDPR") },
  { id: "n8n-setup", title: t("n8n setup e integrazione", "n8n setup and integration", "n8n setup e integracion") },
  { id: "launch-checklist", title: t("Checklist finale", "Final checklist", "Checklist final") },
];

export function DocsSidebar({ locale }: DocsSidebarProps) {
  return (
    <>
      <div className="th-card rounded-3xl border border-[#2a3448] p-4 lg:hidden">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium text-[#f4f7fb]">
            <span>{localize(t("Indice rapido", "Quick index", "Indice rapido"), locale)}</span>
            <span className="text-[#ffd84d] group-open:hidden">+</span>
            <span className="hidden text-[#ffd84d] group-open:inline">-</span>
          </summary>
          <nav className="mt-4 border-t border-[#2a3448] pt-4">
            <ul className="space-y-1">
              {DOCS_SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block rounded-lg px-3 py-2 text-sm text-[#b8c2d6] transition-colors hover:bg-[#1a1f2e] hover:text-[#ffe866]"
                  >
                    {localize(section.title, locale)}
                  </a>
                </li>
              ))}
            </ul>
            <Link href={withLang("/", locale)} className="mt-3 inline-flex text-sm text-[#ffe866] hover:text-[#fff3a8]">
              Torna alla home
            </Link>
          </nav>
        </details>
      </div>

      <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
        <div className="th-card max-h-[calc(100vh-8rem)] w-full overflow-y-auto rounded-[1.75rem] border border-[#2a3448] p-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#ffd84d]">TenantHawk Docs</p>
          <h2 className="mt-2 text-lg font-semibold text-[#f7f9fc]">
            {localize(t("Percorso operativo", "Operational path", "Ruta operativa"), locale)}
          </h2>
          <p className="mt-1 text-sm text-[#b8c2d6]">
            {localize(t("Segui i blocchi in ordine.", "Follow blocks in order.", "Sigue bloques en orden."), locale)}
          </p>

          <nav className="mt-5">
            <ul className="space-y-1.5">
              {DOCS_SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block rounded-lg px-3 py-2 text-sm text-[#b8c2d6] transition-colors hover:bg-[#1a1f2e] hover:text-[#ffe866]"
                  >
                    {localize(section.title, locale)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-5 border-t border-[#2a3448] pt-4">
            <Link href={withLang("/", locale)} className="text-sm text-[#b8c2d6] hover:text-[#ffe866]">
              Torna alla home
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

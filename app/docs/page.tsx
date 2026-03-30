// frontend/app/docs/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { DocsSidebar } from "@/app/components/docs-sidebar";
import { MarketingShell } from "@/app/components/marketing-shell";
import { docsText, getLocaleFromSearchParams, localize, withLang } from "@/app/lib/i18n";

export const metadata: Metadata = {
  title: "TenantHawk Docs — Dal bootstrap al go-live",
  description:
    "Guida operativa completa per TenantHawk: architettura, sviluppo locale, produzione, CLI, k6, LiteLLM, n8n e Web3.",
  alternates: {
    canonical: "/docs",
  },
};

// ─── DATA ──────────────────────────────────────────────────────────────────

const STACK_TABLE = [
  ["FastAPI (async)", "Backend + Admin SSR"],
  ["SQLAlchemy 2 async + asyncpg", "ORM + pool connessioni"],
  ["PostgreSQL 16", "Persistenza dati"],
  ["Redis 7", "Session store sliding-window"],
  ["Next.js", "Landing page + SEO"],
  ["Jinja2 + HTMX", "UI Admin senza SPA overhead"],
  ["Traefik v3", "Reverse proxy + TLS automatico"],
  ["Stripe", "Checkout + webhook billing"],
  ["n8n", "Workflow automation + AI agent"],
  ["LiteLLM", "Proxy LLM multi-provider"],
  ["Alembic", "Migrazioni schema DB"],
  ["k6", "Load testing"],
];

const IDEAL_USE_CASES = [
  ["SaaS Gestionale B2B", "Ogni cliente è un tenant con ruoli, piano e billing già pronti."],
  ["Automazioni AI per agenzie", "n8n + LiteLLM con workflow separati per ogni cliente."],
  ["CMS multi-cliente", "Team redazionali per tenant con RBAC granulare."],
  ["Marketplace B2B MVP", "Ruoli FORNITORE e CLIENTE già modellati nel dominio."],
  ["LMS multi-organizzazione", "Scuole e aziende come tenant separati con abbonamenti."],
];

const LESS_FIT_USE_CASES = [
  ["App consumer B2C pura", "Il multi-tenant diventa overhead inutile."],
  ["Editor realtime tipo Figma", "Serve architettura collaboration-first, non REST."],
  ["Prodotto realtime massivo", "REST non basta, servono WebSocket dedicati."],
  ["App solo mobile", "La landing Next.js diventa secondaria."],
];

const ENV_PRODUCTION = `# Genera prima con: openssl rand -hex 32
APP_SECRET_KEY=<openssl rand -hex 32>
APP_N8N_ENCRYPTION_KEY=<openssl rand -hex 32>

# PostgreSQL
POSTGRES_USER=saas_user
POSTGRES_PASSWORD=<password_forte>
POSTGRES_DB=saas_db
APP_DATABASE_URL=postgresql+asyncpg://saas_user:<password>@db:5432/saas_db

# Redis
APP_REDIS_URL=redis://redis:6379

# Email (Resend)
APP_RESEND_API_KEY=re_live_xxxxxxxxxx
APP_RESET_EMAIL_FROM=TuoSaaS <no-reply@tuodominio.com>
APP_BASE_URL=https://admin.tuodominio.com
APP_FRONTEND_BASE_URL=https://www.tuodominio.com

# Stripe LIVE
APP_STRIPE_SECRET_KEY=sk_live_xxxxxxxxxx
APP_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxx
APP_STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxx
APP_STRIPE_PRICE_BASE=price_xxxxxxxxxx
APP_STRIPE_PRICE_PRO=price_xxxxxxxxxx
APP_STRIPE_PRICE_COMPANY=price_xxxxxxxxxx

# LiteLLM
APP_DEEPSEEK_API_KEY=sk-xxxxxxxxxx
APP_LITELLM_MASTER_KEY=<stringa_random_sicura>

# n8n
APP_N8N_ENCRYPTION_KEY=<openssl rand -hex 32>

# Frontend
NEXT_PUBLIC_API_BASE_URL=https://admin.tuodominio.com

# Backend produzione
APP_HOST=0.0.0.0
APP_PORT=8000
APP_RELOAD=false
APP_WORKERS=2`;

const TRAEFIK_TLS = `command:
  - "--api.dashboard=true"
  - "--providers.docker=true"
  - "--providers.docker.exposedbydefault=false"
  - "--entrypoints.web.address=:80"
  - "--entrypoints.web.http.redirections.entryPoint.to=websecure"
  - "--entrypoints.web.http.redirections.entryPoint.scheme=https"
  - "--entrypoints.websecure.address=:443"
  - "--certificatesresolvers.le.acme.httpchallenge=true"
  - "--certificatesresolvers.le.acme.httpchallenge.entrypoints=web"
  - "--certificatesresolvers.le.acme.email=tua@email.com"
  - "--certificatesresolvers.le.acme.storage=/acme.json"

ports:
  - "80:80"
  - "443:443"

volumes:
  - /var/run/docker.sock:/var/run/docker.sock:ro
  - ./traefik/acme.json:/acme.json`;

const TRAEFIK_ACME_SETUP = `mkdir -p traefik
touch traefik/acme.json
chmod 600 traefik/acme.json   # Traefik rifiuta il file se i permessi sono troppo aperti

# Basic auth per la dashboard (non esporre mai in chiaro)
echo $(htpasswd -nb admin <tua_password>) | sed -e s/\\$/\\$\\$/g
# Output: admin:$$apr1$$xxxxx  ← da inserire nei labels Traefik`;

const TRAEFIK_LABELS_PROD = `# Labels backend in compose.yaml — TLS + auth dashboard
- "traefik.http.routers.backend-admin.entrypoints=websecure"
- "traefik.http.routers.backend-admin.tls.certresolver=le"
- "traefik.http.routers.dashboard.rule=Host(\`traefik.tuodominio.com\`)"
- "traefik.http.routers.dashboard.middlewares=auth"
- "traefik.http.middlewares.auth.basicauth.users=admin:$$apr1$$xxxxx"`;

const ENV_LOCAL = `# PostgreSQL locale
POSTGRES_USER=dev_user
POSTGRES_PASSWORD=dev_password
POSTGRES_DB=dev_db
APP_DATABASE_URL=postgresql+asyncpg://dev_user:dev_password@db:5432/dev_db

# Redis
APP_REDIS_URL=redis://redis:6379

# Dev keys (non sicure, solo per sviluppo)
APP_SECRET_KEY=dev_secret_key_qualsiasi
APP_N8N_ENCRYPTION_KEY=dev_n8n_key_qualsiasi
APP_LITELLM_MASTER_KEY=dev_litellm_key

# Stripe TEST
APP_STRIPE_SECRET_KEY=sk_test_xxxxxxxxxx
APP_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxx
APP_STRIPE_WEBHOOK_SECRET=whsec_test_xxxxxxxxxx
APP_STRIPE_PRICE_BASE=price_test_xxx
APP_STRIPE_PRICE_PRO=price_test_xxx
APP_STRIPE_PRICE_COMPANY=price_test_xxx

# Backend dev
APP_HOST=0.0.0.0
APP_PORT=8000
APP_RELOAD=true    # ← hot reload attivo
APP_WORKERS=1`;

const LOCAL_BOOT = `git clone https://github.com/AlessioQuagliara/SaaS_Template.git
cd SaaS_Template
cp .env.example .env
# Edita .env con i valori dev sopra

# Avvia lo stack completo
docker compose up --build

# Applica migrazioni DB (solo al primo avvio)
docker compose exec backend alembic revision --autogenerate -m "Inizializza"
docker compose exec backend alembic upgrade head

# Crea primo tenant + admin
docker compose exec backend python -m app.cli seed tenant-admin \\
  --slug dev \\
  --nome-tenant "Tenant Dev" \\
  --admin-email dev@dev.it \\
  --admin-password "Dev123!"`;

const LOCAL_DAILY = `# Le modifiche al codice backend si ricaricano automaticamente (APP_RELOAD=true)

# Nuova migration dopo aver modificato un model
docker compose exec backend alembic revision --autogenerate -m "Aggiunge campo X"
docker compose exec backend alembic upgrade head

# Log in tempo reale
docker compose logs -f backend

# Shell nel container backend
docker compose exec backend bash

# Connessione diretta al DB
docker compose exec db psql -U dev_user -d dev_db

# Riavvio singolo servizio
docker compose restart backend`;

const HOSTS_FILE = `# /etc/hosts — aggiungi se il browser non risolve .localhost
127.0.0.1 admin.localhost www.localhost litellm.localhost n8n.localhost`;

const CLI_ANATOMY = `backend/app/
├── routes/admin/<nome>.py          ← Route FastAPI + Jinja2
├── templates/admin/<nome>/
│   └── index.html                   ← Template Tailwind base
├── models/<nome>.py                 ← (opzionale) SQLAlchemy model
├── schemas/<nome>.py                ← (opzionale) Pydantic schema
└── routes/admin/__init__.py         ← Aggiornato automaticamente`;

const CLI_EXAMPLES = `# Modulo base (tutti i ruoli autenticati del tenant)
docker compose exec backend python -m app.cli admin create-module clienti

# Modulo con accesso solo SUPERUTENTE + model + schema
docker compose exec backend python -m app.cli admin create-module ordini-vendite \\
  --label "Ordini e Vendite" \\
  --superuser-only \\
  --with-model \\
  --with-schema

# Lista moduli esistenti
docker compose exec backend python -m app.cli admin list-modules`;

const CLI_GENERATED_ROUTE = `# routes/admin/ordini_vendite.py — generato dalla CLI
@router.get("/ordini_vendite", response_class=HTMLResponse)
async def ordini_vendite_page(
    request: Request,
    tenant_obj: Tenant = Depends(prendi_tenant_con_accesso),
    utente_corrente: Utente = Depends(prendi_utente_corrente),
    ruolo_corrente: str = Depends(prendi_ruolo_corrente),
    _: None = Depends(richiede_ruolo([UtenteRuolo.SUPERUTENTE])),  # guard RBAC
):
    return templates.TemplateResponse(
        request,
        "admin/ordini_vendite/index.html",
        {"tenant": tenant_obj, "utente": utente_corrente, "ruolo_corrente": ruolo_corrente},
    )`;

const CLI_ENRICH_ROUTE = `# Dopo la generazione, aggiungi la logica DB reale
from sqlalchemy import select
from app.core.database import get_db
from app.models.ordini_vendite import OrdiniVendite

@router.get("/ordini_vendite", response_class=HTMLResponse)
async def ordini_vendite_page(
    request: Request,
    tenant_obj: Tenant = Depends(prendi_tenant_con_accesso),
    utente_corrente: Utente = Depends(prendi_utente_corrente),
    ruolo_corrente: str = Depends(prendi_ruolo_corrente),
    _: None = Depends(richiede_ruolo([UtenteRuolo.SUPERUTENTE])),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(OrdiniVendite).where(OrdiniVendite.tenant_id == tenant_obj.id)
    )
    ordini = result.scalars().all()
    return templates.TemplateResponse(
        request,
        "admin/ordini_vendite/index.html",
        {"tenant": tenant_obj, "utente": utente_corrente,
         "ruolo_corrente": ruolo_corrente, "ordini": ordini},
    )`;

const K6_SETUP = `# macOS
brew install k6

# Linux (Debian/Ubuntu)
sudo apt-get install k6

# Docker (nessuna installazione)
docker run --rm -i grafana/k6 run - <test/test_login.js`;

const K6_RUN = `# Test standard: 700 VU, 30 secondi (modifica credenziali prima)
k6 run test/test_login.js

# Test leggero per sviluppo
k6 run --vus 10 --duration 10s test/test_login.js

# Output JSON per analisi
k6 run --out json=result.json test/test_login.js`;

const K6_TEMPLATE = `// test/test_custom.js — template per testare qualsiasi route
import http from 'k6/http'
import { check, sleep } from 'k6'

const BASE_URL = 'http://admin.localhost:8000'
const SESSION = 'id_sessione_utente=<cookie_reale>'

export const options = {
  stages: [
    { duration: '10s', target: 50 },    // ramp up
    { duration: '30s', target: 200 },   // carico sostenuto
    { duration: '10s', target: 0 },     // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],   // 95% richieste sotto 500ms
    http_req_failed: ['rate<0.01'],     // meno dell'1% di errori
  },
}

export default function () {
  const res = http.get(\`\${BASE_URL}/demo/dashboard\`, {
    headers: { Cookie: SESSION },
  })
  check(res, {
    'status 200': r => r.status === 200,
    'sotto 200ms': r => r.timings.duration < 200,
    'html presente': r => r.headers['Content-Type'].includes('text/html'),
  })
  sleep(0.5)
}`;

const K6_METRICS = [
  ["p(95) latency", "< 300ms", "95% richieste servite velocemente"],
  ["p(99) latency", "< 1000ms", "Coda lenta sotto controllo"],
  ["http_req_failed", "< 1%", "Quasi zero errori HTTP"],
  ["checks", "> 99%", "Logica applicativa corretta"],
  ["http_reqs/s", "dipende dal caso", "Throughput complessivo"],
];

const LITELLM_CONFIG = `# litellm_config.yaml
model_list:
  # Provider principale: DeepSeek (economico, performante)
  - model_name: deepseek-chat
    litellm_params:
      model: deepseek/deepseek-chat
      api_key: os.environ/APP_DEEPSEEK_API_KEY

  - model_name: deepseek-reasoner
    litellm_params:
      model: deepseek/deepseek-reasoner
      api_key: os.environ/APP_DEEPSEEK_API_KEY

  # Provider EU per GDPR (Mistral AI — data center in Francia)
  - model_name: mistral-large
    litellm_params:
      model: mistral/mistral-large-latest
      api_key: os.environ/APP_MISTRAL_API_KEY

  # Fallback OpenAI opzionale
  - model_name: gpt-4o
    litellm_params:
      model: openai/gpt-4o
      api_key: os.environ/APP_OPENAI_API_KEY

general_settings:
  master_key: os.environ/APP_LITELLM_MASTER_KEY`;

const LITELLM_VIRTUAL_KEY = `# Crea virtual key EU-only per tenant con data residency requirement
curl -X POST http://litellm.localhost/key/generate \\
  -H "Authorization: Bearer $APP_LITELLM_MASTER_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "models": ["mistral-large"],
    "metadata": {"tenant_id": "azienda-eu"},
    "max_budget": 10.0,
    "budget_duration": "30d"
  }'`;

const LITELLM_SPEND = `# Vedi utilizzo e spesa per chiave
curl http://litellm.localhost/spend/keys \\
  -H "Authorization: Bearer $APP_LITELLM_MASTER_KEY"

# Riavvia LiteLLM dopo modifiche al yaml (senza toccare lo stack)
docker compose restart litellm`;

const N8N_CREDENTIAL = `# In n8n: Credentials → New → OpenAI API
API Key:  <APP_LITELLM_MASTER_KEY>
Base URL: http://litellm:4000
# Usa il nome servizio Docker, NON litellm.localhost
# (n8n è dentro la rete Docker e comunica via nome servizio)`;

const N8N_WORKFLOW = `Webhook trigger (es. nuovo tenant registrato)
  → HTTP Request → backend: GET /{slug}/utenti
  → OpenAI node (via LiteLLM) → genera email benvenuto
  → HTTP Request → backend: POST /api/email/send
  → Wait 3 giorni
  → HTTP Request → backend: GET /{slug}/sottoscrizione
  → If: trial scade in 2 giorni?
      → Sì: OpenAI → reminder upgrade → Resend → invia email`;

const N8N_BACKUP = `# Esporta tutti i workflow
docker compose exec n8n n8n export:workflow \\
  --all \\
  --output=/home/node/.n8n/backup.json

# Copia fuori dal container
docker cp $(docker compose ps -q n8n):/home/node/.n8n/backup.json ./backup/`;

const N8N_RESET = `# Reset completo n8n (ATTENZIONE: cancella tutti i workflow)
docker compose down
docker volume rm saas_template_n8n_data
docker compose up -d`;

const SIWE_DEPS = `# requirements.txt — aggiungi
siwe>=2.1.0
web3>=6.0.0

# frontend
npm install wagmi viem @rainbow-me/rainbowkit`;

const SIWE_MODEL = `# backend/app/models/utente.py — aggiungi il campo wallet
wallet_address: Mapped[str | None] = mapped_column(
    String(42),   # lunghezza fissa indirizzo Ethereum
    unique=True,
    index=True,
    nullable=True,
)`;

const SIWE_BACKEND = `# backend/app/routes/auth/web3.py
from siwe import SiweMessage

@router.post("/auth/web3/nonce")
async def genera_nonce(wallet_address: str):
    nonce = secrets.token_hex(16)
    await gestore_sessioni.redis.setex(
        f"web3_nonce:{wallet_address.lower()}",
        timedelta(minutes=5),
        nonce,
    )
    return {"nonce": nonce}

@router.post("/auth/web3/verify")
async def verifica_firma_web3(payload: dict, response: Response, db=Depends(get_db)):
    message = SiweMessage(message=payload["message"])
    message.verify(payload["signature"])
    wallet = message.address.lower()

    nonce_salvato = await gestore_sessioni.redis.get(f"web3_nonce:{wallet}")
    if nonce_salvato != message.nonce:
        raise HTTPException(status_code=401, detail="Nonce non valido o scaduto")

    utente = await trova_o_crea_utente_wallet(db, wallet_address=wallet)
    id_sessione = await gestore_sessioni.crea_sessione(
        id_utente=utente.id,
        id_tenant=utente.tenant_id,
        auth_method="web3",
        wallet=wallet,
    )
    # Sessione identica a quella classica: RBAC e tenancy funzionano senza refactor
    response.set_cookie(
        key="id_sessione_utente", value=id_sessione,
        httponly=True, samesite="lax",
    )
    return {"ok": True}`;

const SIWE_FRONTEND = `// frontend — Next.js + wagmi
import { useSignMessage } from "wagmi"

export function Web3Login({ address }: { address: string }) {
  const { signMessageAsync } = useSignMessage()

  const handleLogin = async () => {
    const { nonce } = await fetch(
      '/api/auth/web3/nonce?wallet=' + address
    ).then(r => r.json())

    const message = buildSiweMessage({ address, nonce, domain: "admin.localhost" })
    const signature = await signMessageAsync({ message })

    await fetch("/api/auth/web3/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, signature }),
    })
  }

  return <button onClick={handleLogin}>Accedi con Wallet</button>
}`;

const BILLING_POLICY_NOTE = `# La policy di disattivazione tenant funziona così:
# 1. ATTIVO / PROVA → nessuna azione
# 2. SCADUTO / CANCELLATO → entra in SOSPESO per 14 giorni (grace period)
# 3. SOSPESO → dopo 14 giorni verifica live su Stripe, poi cascade delete
#
# Cascade delete rimuove: ruoli, token reset, utenti senza altri tenant, sottoscrizione, tenant
# Se l'utente è condiviso su altri tenant, il suo account viene semplicemente spostato`;

const FINAL_CHECKLIST = [
  "APP_RELOAD=false e APP_WORKERS >= 2 in produzione",
  "APP_SECRET_KEY generata con openssl rand -hex 32 (mai usare il default)",
  "APP_N8N_ENCRYPTION_KEY fissata prima del primo avvio di n8n (immutabile dopo)",
  "HTTPS attivo in compose.yaml e traefik/acme.json con chmod 600",
  "Dashboard Traefik protetta con basic auth (non esposta in chiaro)",
  "Stripe: chiavi sk_live_* e webhook con URL di produzione verificato",
  "LiteLLM: virtual key con limiti budget per tenant, modelli EU per GDPR",
  "Backup pg_data pianificato e procedura di restore testata",
  "Mai eseguire docker compose down -v in produzione (cancella tutti i dati)",
  "Aggiungere /etc/hosts se .localhost non si risolve nativamente",
];

// ─── UI COMPONENTS ─────────────────────────────────────────────────────────

function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 th-card rounded-4xl border border-[#2a3448] p-6 sm:p-9"
    >
      <p className="text-xs uppercase tracking-[0.24em] text-[#ffd84d]">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
      <p className="mt-3 max-w-4xl text-sm leading-7 text-[#b8c2d6] sm:text-base">{subtitle}</p>
      <div className="mt-7 space-y-6 text-sm leading-7 text-[#d7deec] sm:text-[15px]">
        {children}
      </div>
    </section>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-white sm:text-lg">{children}</h3>;
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#253044] bg-[#0c1119] px-4 py-3 text-[#9fadca]">
      {children}
    </div>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#2a3448] bg-[#070a0f]">
      <div className="border-b border-[#1d2638] px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[#8ea0bf]">
        {language}
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-xs leading-6 text-[#ffe866] sm:text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#2a3448]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#2a3448] text-left text-sm text-[#d7deec]">
          <thead className="bg-[#111722] text-[#ffe866]">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-4 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1d2638] bg-[#0b1018]/80">
            {rows.map((row) => (
              <tr key={row.join("|")}>
                {row.map((cell) => (
                  <td key={cell} className="px-4 py-3 align-top text-[#c9d3e4]">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── PAGE ───────────────────────────────────────────────────────────────────

type DocsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DocsPage({ searchParams }: DocsPageProps) {
  const locale = await getLocaleFromSearchParams(searchParams);

  return (
    <MarketingShell locale={locale} currentPath="/docs">
      {/* ── HEADER ── */}
      <header className="th-card th-fade-up rounded-4xl border border-[#2a3448] p-6 sm:p-10">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#ffd84d]">
          TenantHawk — Guida completa
        </p>
        <h1 className="mt-3 max-w-5xl text-4xl font-semibold leading-tight text-white sm:text-6xl">
          Dal primo bootstrap al go-live,
          <span className="text-[#ffe866]"> senza attrito.</span>
        </h1>
        <p className="mt-5 max-w-4xl text-sm leading-8 text-[#b8c2d6] sm:text-base">
          Guida operativa completa: capisci l&apos;architettura, esegui gli step nell&apos;ordine
          giusto, arrivi in produzione con controllo pieno su sicurezza, performance e scalabilità.
          Nessun fluff, solo ciò che serve davvero.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs text-[#9fadca] sm:text-sm">
          <span className="rounded-full border border-[#253044] px-3 py-1">
            Pronto in 30–45 min
          </span>
          <span className="rounded-full border border-[#253044] px-3 py-1">9 sezioni operative</span>
          <span className="rounded-full border border-[#253044] px-3 py-1">Zero fluff</span>
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href="https://github.com/AlessioQuagliara/TenantHawk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-[#2a3448] px-5 py-2 text-sm text-[#f4f7fb] hover:border-[#ffd84d] transition-colors"
          >
            {localize(docsText.openRepo, locale)}
          </a>
          <a
            href="#stack"
            className="th-bolt inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold"
          >
            Inizia il percorso →
          </a>
          <a
            href="#launch-checklist"
            className="inline-flex items-center rounded-full border border-[#2a3448] px-5 py-2 text-sm text-[#d7deec] hover:border-[#ffe866] hover:text-[#fff1a1] transition-colors"
          >
            Vai alla checklist finale
          </a>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start lg:justify-center xl:grid-cols-[18rem_minmax(0,1fr)]">
        <DocsSidebar locale={locale} />

        <div className="grid min-w-0 max-w-[52rem] gap-6">

          {/* ── 00 STACK ── */}
          <Section
            id="stack"
            eyebrow="00"
            title="Lo stack in un colpo d'occhio"
            subtitle="Ogni pezzo ha un ruolo preciso. Niente è lì per impressionare: tutto è lì per funzionare."
          >
            <DataTable
              headers={["Tecnologia", "Ruolo"]}
              rows={STACK_TABLE}
            />
            <Note>
              Il backend FastAPI serve sia le API JSON che l&apos;admin SSR con Jinja2. Non c&apos;è un
              frontend SPA separato per l&apos;admin: questa scelta riduce la superficie di attacco,
              elimina CORS e semplifica la gestione delle sessioni.
            </Note>
          </Section>

          {/* ── 01 USE CASES ── */}
          <Section
            id="use-cases"
            eyebrow="01"
            title="Dove TenantHawk rende al massimo"
            subtitle="Template pensato per B2B multi-tenant reale: ogni cliente è un account isolato con utenti, ruoli e abbonamento propri."
          >
            <H3>Scenari ideali</H3>
            <DataTable headers={["Scenario", "Perché funziona"]} rows={IDEAL_USE_CASES} />
            <H3>Scenari meno adatti</H3>
            <DataTable headers={["Scenario", "Perché no"]} rows={LESS_FIT_USE_CASES} />
          </Section>

          {/* ── 02 SVILUPPO LOCALE ── */}
          <Section
            id="local-development"
            eyebrow="02"
            title="Sviluppo locale: zero a operativo"
            subtitle="Percorso minimo per partire subito. Ogni comando ha uno scopo, nell'ordine giusto."
          >
            <H3>1. File .env per sviluppo</H3>
            <CodeBlock language="bash" code={ENV_LOCAL} />
            <H3>2. Bootstrap completo</H3>
            <CodeBlock language="bash" code={LOCAL_BOOT} />
            <H3>Indirizzi locali</H3>
            <DataTable
              headers={["Servizio", "URL"]}
              rows={[
                ["Admin backend", "http://admin.localhost"],
                ["Landing frontend", "http://www.localhost"],
                ["Traefik dashboard", "http://localhost:8080"],
                ["LiteLLM UI", "http://litellm.localhost"],
                ["n8n", "http://n8n.localhost"],
                ["API Docs (Swagger)", "http://admin.localhost/docs"],
              ]}
            />
            <H3>Workflow quotidiano</H3>
            <CodeBlock language="bash" code={LOCAL_DAILY} />
            <Note>
              Se il browser non risolve <code>.localhost</code>, aggiungi queste righe a{" "}
              <code>/etc/hosts</code>:
              <br />
              <code className="text-[#ffe866]">{HOSTS_FILE}</code>
            </Note>
          </Section>

          {/* ── 03 PRODUZIONE ── */}
          <Section
            id="production-docker"
            eyebrow="03"
            title="Produzione: Docker, TLS, hardening"
            subtitle="La differenza tra demo e prodotto serio è qui. Nessuna scorciatoia: ogni punto ha una conseguenza di sicurezza."
          >
            <H3>1. File .env di produzione</H3>
            <CodeBlock language="bash" code={ENV_PRODUCTION} />
            <H3>2. Traefik con HTTPS e Let&apos;s Encrypt</H3>
            <p>
              Il blocco TLS è già presente nel <code>compose.yaml</code> ma commentato. Per la
              produzione decommentalo e completa questi passi:
            </p>
            <CodeBlock language="yaml" code={TRAEFIK_TLS} />
            <CodeBlock language="bash" code={TRAEFIK_ACME_SETUP} />
            <H3>3. Labels per TLS e auth dashboard</H3>
            <CodeBlock language="yaml" code={TRAEFIK_LABELS_PROD} />
            <Note>
              Non esporre mai la dashboard Traefik senza autenticazione. In sviluppo è aperta su{" "}
              <code>:8080</code> per comodità, ma in produzione deve essere protetta o disabilitata.
            </Note>
          </Section>

          {/* ── 04 CLI ── */}
          <Section
            id="cli-modules"
            eyebrow="04"
            title="CLI: moduli admin senza boilerplate"
            subtitle="La CLI genera l'intera struttura di un modulo tenant-aware. Tu ti concentri sul dominio, non sull'impalcatura."
          >
            <H3>Cosa genera un singolo comando</H3>
            <CodeBlock language="text" code={CLI_ANATOMY} />
            <H3>Comandi reali</H3>
            <CodeBlock language="bash" code={CLI_EXAMPLES} />
            <H3>Route generata (esempio con --superuser-only)</H3>
            <CodeBlock language="python" code={CLI_GENERATED_ROUTE} />
            <H3>Come arricchire con logica DB reale</H3>
            <p>
              Dopo la generazione, il pattern per aggiungere query reali è sempre lo stesso: importa
              il model, esegui la select filtrata per <code>tenant_id</code>, passa i dati al
              template.
            </p>
            <CodeBlock language="python" code={CLI_ENRICH_ROUTE} />
            <Note>
              Il filtro <code>tenant_id == tenant_obj.id</code> è il confine di isolamento tra
              tenant. Non dimenticarlo mai quando scrivi query su tabelle tenant-aware.
            </Note>
          </Section>

          {/* ── 05 K6 ── */}
          <Section
            id="testing-k6"
            eyebrow="05"
            title="Performance: misura prima di ottimizzare"
            subtitle="Il test di login incluso nel progetto simula 700 utenti concorrenti sul flusso completo con CSRF. Usalo come base."
          >
            <H3>Installazione e primo test</H3>
            <CodeBlock language="bash" code={K6_SETUP} />
            <CodeBlock language="bash" code={K6_RUN} />
            <Note>
              Prima di eseguire il test, modifica le credenziali in{" "}
              <code>test/test_login.js</code> con un utente reale del tuo tenant dev. Il test simula
              anche l&apos;estrazione del CSRF token dall&apos;HTML della pagina di login.
            </Note>
            <H3>Template per testare qualsiasi route</H3>
            <CodeBlock language="javascript" code={K6_TEMPLATE} />
            <H3>Come leggere i risultati</H3>
            <DataTable
              headers={["Metrica", "Soglia buona", "Cosa misura"]}
              rows={K6_METRICS}
            />
          </Section>

          {/* ── 06 LITELLM ── */}
          <Section
            id="litellm-gdpr"
            eyebrow="06"
            title="LiteLLM: policy, costi e GDPR"
            subtitle="LiteLLM è il punto unico di controllo per tutti i provider LLM. Cambia provider senza toccare n8n o il backend."
          >
            <p>
              Accedi alla UI su <code>http://litellm.localhost</code> usando la{" "}
              <code>APP_LITELLM_MASTER_KEY</code> dal tuo <code>.env</code>.
            </p>
            <H3>1. Configurazione provider (litellm_config.yaml)</H3>
            <CodeBlock language="yaml" code={LITELLM_CONFIG} />
            <H3>2. Virtual key per tenant con limiti budget e GDPR</H3>
            <p>
              Per tenant che richiedono data residency EU (es. GDPR), crea una virtual key che
              permette solo modelli con server europei:
            </p>
            <CodeBlock language="bash" code={LITELLM_VIRTUAL_KEY} />
            <H3>3. Monitoraggio spesa</H3>
            <CodeBlock language="bash" code={LITELLM_SPEND} />
            <Note>
              Dopo ogni modifica al <code>litellm_config.yaml</code>, esegui{" "}
              <code>docker compose restart litellm</code>. Non è necessario riavviare l&apos;intero
              stack.
            </Note>
          </Section>

          {/* ── 07 N8N ── */}
          <Section
            id="n8n-setup"
            eyebrow="07"
            title="n8n: setup e integrazione"
            subtitle="n8n orchestra i workflow automatizzati. TenantHawk resta il sistema of record per tenant, utenti e billing."
          >
            <H3>1. Primo accesso</H3>
            <p>
              Vai su <code>http://n8n.localhost</code>. Al primo avvio, n8n guida attraverso la
              creazione dell&apos;account owner e l&apos;attivazione della licenza community gratuita
              su <code>community.n8n.io</code>.
            </p>
            <Note>
              <strong>Critico:</strong> la <code>APP_N8N_ENCRYPTION_KEY</code> nel{" "}
              <code>.env</code> deve essere impostata prima del primo avvio. Se la modifichi dopo,
              n8n non riesce più a decifrare le credenziali salvate e bisogna ripartire da zero
              eliminando il volume.
            </Note>
            <H3>2. Connettere n8n a LiteLLM</H3>
            <CodeBlock language="text" code={N8N_CREDENTIAL} />
            <H3>3. Workflow tipico: onboarding tenant automatico</H3>
            <CodeBlock language="text" code={N8N_WORKFLOW} />
            <H3>4. Backup workflow</H3>
            <CodeBlock language="bash" code={N8N_BACKUP} />
            <H3>Reset completo (solo se necessario)</H3>
            <CodeBlock language="bash" code={N8N_RESET} />
          </Section>

          {/* ── 08 BILLING POLICY ── */}
          <Section
            id="billing-policy"
            eyebrow="08"
            title="Billing: grace period e cascade delete"
            subtitle="Il ciclo di vita del tenant è automatizzato. Nessun tenant viene eliminato senza una finestra di recupero."
          >
            <p>
              La funzione <code>applica_policy_disattivazione_tenant()</code> viene chiamata ad ogni
              caricamento del tenant e gestisce automaticamente la transizione tra stati:
            </p>
            <CodeBlock language="python" code={BILLING_POLICY_NOTE} />
            <DataTable
              headers={["Stato", "Azione automatica"]}
              rows={[
                ["ATTIVO / PROVA", "Nessuna azione, accesso garantito"],
                ["SCADUTO / CANCELLATO", "Entra in SOSPESO con 14 giorni di grace period"],
                ["SOSPESO (entro tregua)", "Accesso bloccato, nessuna eliminazione ancora"],
                ["SOSPESO (tregua scaduta)", "Verifica live Stripe → cascade delete se confermato"],
              ]}
            />
            <Note>
              Prima di ogni azione distruttiva, il sistema esegue sempre una verifica live su Stripe.
              Se la connessione a Stripe fallisce (<code>verifica_live_ok = False</code>), la policy
              si blocca in fail-safe e non elimina nulla.
            </Note>
          </Section>

          {/* ── 09 WEB3 ── */}
          <Section
            id="web3"
            eyebrow="09"
            title="Web3: quando e come integrarlo"
            subtitle="TenantHawk è volutamente Web2 per affidabilità B2B. Web3 entra solo dove crea un vantaggio competitivo reale."
          >
            <p>
              Oggi identità, sessioni e billing sono centralizzati: cookie <code>httpOnly</code>,
              session store Redis, Stripe come authority di pagamento. Questa scelta riduce
              complessità e accelera il time-to-market. Web3 ha senso in quattro casi concreti:
              tokenized access, billing on-chain, login wallet-first, audit trail immutabile su
              chain.
            </p>
            <H3>1. Dipendenze</H3>
            <CodeBlock language="bash" code={SIWE_DEPS} />
            <H3>2. Aggiungere il campo wallet al model Utente</H3>
            <CodeBlock language="python" code={SIWE_MODEL} />
            <H3>3. Route SIWE backend</H3>
            <CodeBlock language="python" code={SIWE_BACKEND} />
            <H3>4. Componente frontend con wagmi</H3>
            <CodeBlock language="typescript" code={SIWE_FRONTEND} />
            <Note>
              La parte chiave: la sessione generata dal flusso Web3 è identica strutturalmente a
              quella del login classico. Tutto il middleware di <code>prendi_utente_corrente</code>,
              RBAC e tenancy funziona senza refactor, perché usa solo <code>id_utente</code> dalla
              sessione Redis.
            </Note>
          </Section>

          {/* ── CHECKLIST ── */}
          <Section
            id="launch-checklist"
            eyebrow="GO LIVE"
            title="Checklist finale di lancio"
            subtitle="Completa ogni punto prima di andare live. Nessun passaggio è opzionale."
          >
            <ul className="space-y-3">
              {FINAL_CHECKLIST.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-[#1d2638] bg-[#0c1119] px-4 py-3 text-[#d7deec]"
                >
                  <span className="mt-0.5 text-[#ffd84d]">□</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* ── CTA FOOTER ── */}
          <section className="th-card rounded-4xl border border-[#2a3448] p-6 sm:p-8 text-sm text-[#b8c2d6]">
            <p className="max-w-3xl leading-7">
              Hai una base operativa completa: architettura, sviluppo, produzione, automazioni, test
              e go-live. Il passo successivo è tradurre questa solidità tecnica in posizionamento e
              roadmap commerciale.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={withLang("/features", locale)}
                className="th-bolt inline-flex rounded-full px-5 py-2 text-sm font-semibold"
              >
                {localize(docsText.goFeatures, locale)}
              </Link>
              <Link
                href={withLang("/changelog", locale)}
                className="inline-flex rounded-full border border-[#2a3448] px-5 py-2 text-sm text-[#d7deec] hover:border-[#ffe866] hover:text-[#fff1a1] transition-colors"
              >
                Changelog
              </Link>
            </div>
          </section>

        </div>
      </div>
    </MarketingShell>
  );
}
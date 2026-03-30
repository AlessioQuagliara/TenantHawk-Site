// frontend/app/docs/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { DocsSidebar } from "@/app/components/docs-sidebar";
import { MarketingShell } from "@/app/components/marketing-shell";
import { commonText, ctaText, docsText, getLocaleFromSearchParams, languageAlternates, localize, Locale, seoLocaleCode, withLang } from "@/app/lib/i18n";

type DocsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: DocsPageProps): Promise<Metadata> {
  const locale = await getLocaleFromSearchParams(searchParams);

  return {
    title: localize(docsText.seoTitle, locale),
    description: localize(docsText.seoDescription, locale),
    alternates: {
      canonical: withLang("/docs", locale),
      languages: languageAlternates("/docs"),
    },
    openGraph: {
      title: localize(docsText.seoTitle, locale),
      description: localize(docsText.seoDescription, locale),
      url: withLang("/docs", locale),
      locale: seoLocaleCode[locale],
      type: "article",
    },
  };
}

// ─── DATA ──────────────────────────────────────────────────────────────────

const STACK_TABLE: Record<Locale, string[][]> = {
  it: [
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
  ],
  en: [
    ["FastAPI (async)", "Backend + Admin SSR"],
    ["SQLAlchemy 2 async + asyncpg", "ORM + connection pool"],
    ["PostgreSQL 16", "Data persistence"],
    ["Redis 7", "Sliding-window session store"],
    ["Next.js", "Marketing site + SEO"],
    ["Jinja2 + HTMX", "Admin UI without SPA overhead"],
    ["Traefik v3", "Reverse proxy + automatic TLS"],
    ["Stripe", "Checkout + billing webhook"],
    ["n8n", "Workflow automation + AI agent"],
    ["LiteLLM", "Multi-provider LLM proxy"],
    ["Alembic", "DB schema migrations"],
    ["k6", "Load testing"],
  ],
  es: [
    ["FastAPI (async)", "Backend + Admin SSR"],
    ["SQLAlchemy 2 async + asyncpg", "ORM + pool de conexiones"],
    ["PostgreSQL 16", "Persistencia de datos"],
    ["Redis 7", "Session store con ventana deslizante"],
    ["Next.js", "Sitio marketing + SEO"],
    ["Jinja2 + HTMX", "UI Admin sin sobrecarga SPA"],
    ["Traefik v3", "Reverse proxy + TLS automatico"],
    ["Stripe", "Checkout + webhook de facturacion"],
    ["n8n", "Automatizacion de workflows + agente AI"],
    ["LiteLLM", "Proxy LLM multi-proveedor"],
    ["Alembic", "Migraciones de esquema DB"],
    ["k6", "Load testing"],
  ],
};

const IDEAL_USE_CASES: Record<Locale, string[][]> = {
  it: [
    ["SaaS Gestionale B2B", "Ogni cliente e un tenant con ruoli, piano e billing gia pronti."],
    ["Automazioni AI per agenzie", "n8n + LiteLLM con workflow separati per ogni cliente."],
    ["CMS multi-cliente", "Team redazionali per tenant con RBAC granulare."],
    ["Marketplace B2B MVP", "Ruoli FORNITORE e CLIENTE gia modellati nel dominio."],
    ["LMS multi-organizzazione", "Scuole e aziende come tenant separati con abbonamenti."],
  ],
  en: [
    ["B2B Management SaaS", "Each customer is a tenant with roles, plan and billing already wired."],
    ["AI automations for agencies", "n8n + LiteLLM with isolated workflows per customer."],
    ["Multi-client CMS", "Editorial teams per tenant with granular RBAC."],
    ["B2B marketplace MVP", "SUPPLIER and CUSTOMER roles already mapped in the domain."],
    ["Multi-organization LMS", "Schools and companies as isolated tenants with subscriptions."],
  ],
  es: [
    ["SaaS de gestion B2B", "Cada cliente es un tenant con roles, plan y billing listos."],
    ["Automatizaciones AI para agencias", "n8n + LiteLLM con workflows aislados por cliente."],
    ["CMS multi-cliente", "Equipos editoriales por tenant con RBAC granular."],
    ["MVP marketplace B2B", "Roles PROVEEDOR y CLIENTE ya modelados en el dominio."],
    ["LMS multi-organizacion", "Escuelas y empresas como tenants separados con suscripciones."],
  ],
};

const LESS_FIT_USE_CASES: Record<Locale, string[][]> = {
  it: [
    ["App consumer B2C pura", "Il multi-tenant diventa overhead inutile."],
    ["Editor realtime tipo Figma", "Serve architettura collaboration-first, non REST."],
    ["Prodotto realtime massivo", "REST non basta, servono WebSocket dedicati."],
    ["App solo mobile", "La landing Next.js diventa secondaria."],
  ],
  en: [
    ["Pure B2C consumer app", "Multi-tenancy becomes unnecessary overhead."],
    ["Realtime editor like Figma", "You need collaboration-first architecture, not plain REST."],
    ["Massive realtime product", "REST is not enough, dedicated WebSockets are required."],
    ["Mobile-only app", "The Next.js marketing layer becomes secondary."],
  ],
  es: [
    ["App consumer B2C pura", "La multi-tenencia se vuelve sobrecarga innecesaria."],
    ["Editor realtime tipo Figma", "Se necesita arquitectura collaboration-first, no solo REST."],
    ["Producto realtime masivo", "REST no alcanza, hacen falta WebSockets dedicados."],
    ["App solo mobile", "La landing Next.js pasa a segundo plano."],
  ],
};

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

const FINAL_CHECKLIST: Record<Locale, string[]> = {
  it: [
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
  ],
  en: [
    "APP_RELOAD=false and APP_WORKERS >= 2 in production",
    "APP_SECRET_KEY generated with openssl rand -hex 32 (never use defaults)",
    "APP_N8N_ENCRYPTION_KEY fixed before first n8n boot (immutable afterwards)",
    "HTTPS enabled in compose.yaml and traefik/acme.json with chmod 600",
    "Traefik dashboard protected with basic auth (never exposed in clear)",
    "Stripe live keys and production webhook URL verified",
    "LiteLLM virtual keys with tenant budget limits and EU models for GDPR",
    "pg_data backups scheduled and restore procedure tested",
    "Never run docker compose down -v in production (it wipes data)",
    "Add /etc/hosts entries if .localhost does not resolve natively",
  ],
  es: [
    "APP_RELOAD=false y APP_WORKERS >= 2 en produccion",
    "APP_SECRET_KEY generada con openssl rand -hex 32 (nunca usar valores por defecto)",
    "APP_N8N_ENCRYPTION_KEY definida antes del primer arranque de n8n (inmutable)",
    "HTTPS activo en compose.yaml y traefik/acme.json con chmod 600",
    "Dashboard de Traefik protegida con basic auth (no exponer en claro)",
    "Claves Stripe live y webhook de produccion verificados",
    "Virtual keys LiteLLM con limites de presupuesto por tenant y modelos EU",
    "Backup de pg_data planificado y restore probado",
    "No ejecutar docker compose down -v en produccion (borra datos)",
    "Agregar /etc/hosts si .localhost no resuelve de forma nativa",
  ],
};

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

export default async function DocsPage({ searchParams }: DocsPageProps) {
  const locale = await getLocaleFromSearchParams(searchParams);
  const tr = (it: string, en: string, es: string) => localize({ it, en, es }, locale);

  return (
    <MarketingShell locale={locale} currentPath="/docs">
      {/* ── HEADER ── */}
      <header className="th-card th-fade-up rounded-4xl border border-[#2a3448] p-6 sm:p-10">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#ffd84d]">
          {tr("TenantHawk — Guida completa", "TenantHawk — Complete guide", "TenantHawk — Guia completa")}
        </p>
        <h1 className="mt-3 max-w-5xl text-4xl font-semibold leading-tight text-white sm:text-6xl">
          {tr("Dal primo bootstrap al go-live,", "From first bootstrap to go-live,", "Del primer bootstrap al go-live,")}
          <span className="text-[#ffe866]"> {tr("senza attrito.", "without friction.", "sin friccion.")}</span>
        </h1>
        <p className="mt-5 max-w-4xl text-sm leading-8 text-[#b8c2d6] sm:text-base">
          {tr(
            "Guida operativa completa: capisci l'architettura, esegui gli step nell'ordine giusto, arrivi in produzione con controllo pieno su sicurezza, performance e scalabilita. Nessun fluff, solo cio che serve davvero.",
            "Complete operational guide: understand the architecture, execute steps in the right order, and reach production with full control on security, performance and scalability. No fluff, only what is truly useful.",
            "Guia operativa completa: entiende la arquitectura, ejecuta los pasos en el orden correcto y llega a produccion con control total de seguridad, rendimiento y escalabilidad. Sin relleno, solo lo que realmente sirve."
          )}
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[#9fadca]">{localize(commonText.creatorByline, locale)}</p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs text-[#9fadca] sm:text-sm">
          <span className="rounded-full border border-[#253044] px-3 py-1">
            {tr("Pronto in 30-45 min", "Ready in 30-45 min", "Listo en 30-45 min")}
          </span>
          <span className="rounded-full border border-[#253044] px-3 py-1">{tr("9 sezioni operative", "9 operational sections", "9 secciones operativas")}</span>
          <span className="rounded-full border border-[#253044] px-3 py-1">{tr("Zero fluff", "Zero fluff", "Cero relleno")}</span>
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
            {tr("Inizia il percorso", "Start the journey", "Comenzar el recorrido")} →
          </a>
          <a
            href="#launch-checklist"
            className="inline-flex items-center rounded-full border border-[#2a3448] px-5 py-2 text-sm text-[#d7deec] hover:border-[#ffe866] hover:text-[#fff1a1] transition-colors"
          >
            {tr("Vai alla checklist finale", "Go to the final checklist", "Ir a la checklist final")}
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
            title={tr("Lo stack in un colpo d'occhio", "The stack at a glance", "El stack de un vistazo")}
            subtitle={tr("Ogni pezzo ha un ruolo preciso. Niente e li per impressionare: tutto e li per funzionare.", "Every piece has a precise role. Nothing is there to impress: everything is there to work.", "Cada pieza tiene un rol preciso. Nada esta para impresionar: todo esta para funcionar.")}
          >
            <DataTable
              headers={[tr("Tecnologia", "Technology", "Tecnologia"), tr("Ruolo", "Role", "Rol")]}
              rows={STACK_TABLE[locale]}
            />
            <Note>
              {tr("Il backend FastAPI serve sia le API JSON che l'admin SSR con Jinja2. Non c'e un frontend SPA separato per l'admin: questa scelta riduce la superficie di attacco, elimina CORS e semplifica la gestione delle sessioni.", "The FastAPI backend serves both JSON APIs and the SSR admin with Jinja2. There is no separate SPA for admin: this reduces attack surface, removes CORS complexity and simplifies session handling.", "El backend FastAPI sirve tanto las API JSON como el admin SSR con Jinja2. No hay una SPA separada para admin: esta eleccion reduce la superficie de ataque, elimina CORS y simplifica la gestion de sesiones.")}
            </Note>
          </Section>

          {/* ── 01 USE CASES ── */}
          <Section
            id="use-cases"
            eyebrow="01"
            title={tr("Dove TenantHawk rende al massimo", "Where TenantHawk performs best", "Donde TenantHawk rinde mejor")}
            subtitle={tr("Template pensato per B2B multi-tenant reale: ogni cliente e un account isolato con utenti, ruoli e abbonamento propri.", "Template built for real B2B multi-tenancy: each customer is an isolated account with users, roles and subscription.", "Template pensado para multi-tenancy B2B real: cada cliente es una cuenta aislada con usuarios, roles y suscripcion.")}
          >
            <H3>{tr("Scenari ideali", "Ideal scenarios", "Escenarios ideales")}</H3>
            <DataTable headers={[tr("Scenario", "Scenario", "Escenario"), tr("Perche funziona", "Why it fits", "Por que encaja")]} rows={IDEAL_USE_CASES[locale]} />
            <H3>{tr("Scenari meno adatti", "Less fitting scenarios", "Escenarios menos adecuados")}</H3>
            <DataTable headers={[tr("Scenario", "Scenario", "Escenario"), tr("Perche no", "Why not", "Por que no")]} rows={LESS_FIT_USE_CASES[locale]} />
          </Section>

          {/* ── 02 SVILUPPO LOCALE ── */}
          <Section
            id="local-development"
            eyebrow="02"
            title={tr("Sviluppo locale: zero a operativo", "Local development: from zero to running", "Desarrollo local: de cero a operativo")}
            subtitle={tr("Percorso minimo per partire subito. Ogni comando ha uno scopo, nell'ordine giusto.", "Minimum path to start quickly. Every command has a purpose in the correct order.", "Ruta minima para empezar rapido. Cada comando tiene un objetivo en el orden correcto.")}
          >
            <H3>{tr("1. File .env per sviluppo", "1. .env file for development", "1. Archivo .env para desarrollo")}</H3>
            <CodeBlock language="bash" code={ENV_LOCAL} />
            <H3>{tr("2. Bootstrap completo", "2. Full bootstrap", "2. Bootstrap completo")}</H3>
            <CodeBlock language="bash" code={LOCAL_BOOT} />
            <H3>{tr("Indirizzi locali", "Local endpoints", "Endpoints locales")}</H3>
            <DataTable
              headers={[tr("Servizio", "Service", "Servicio"), "URL"]}
              rows={[
                ["Admin backend", "http://admin.localhost"],
                ["Landing frontend", "http://www.localhost"],
                ["Traefik dashboard", "http://localhost:8080"],
                ["LiteLLM UI", "http://litellm.localhost"],
                ["n8n", "http://n8n.localhost"],
                ["API Docs (Swagger)", "http://admin.localhost/docs"],
              ]}
            />
            <H3>{tr("Workflow quotidiano", "Daily workflow", "Flujo diario")}</H3>
            <CodeBlock language="bash" code={LOCAL_DAILY} />
            <Note>
              {tr("Se il browser non risolve", "If your browser does not resolve", "Si tu navegador no resuelve")} <code>.localhost</code>, {tr("aggiungi queste righe a", "add these lines to", "agrega estas lineas en")} <code>/etc/hosts</code>:
              <br />
              <code className="text-[#ffe866]">{HOSTS_FILE}</code>
            </Note>
          </Section>

          {/* ── 03 PRODUZIONE ── */}
          <Section
            id="production-docker"
            eyebrow="03"
            title={tr("Produzione: Docker, TLS, hardening", "Production: Docker, TLS, hardening", "Produccion: Docker, TLS, hardening")}
            subtitle={tr("La differenza tra demo e prodotto serio e qui. Nessuna scorciatoia: ogni punto ha una conseguenza di sicurezza.", "The difference between a demo and a real product is here. No shortcuts: every point has security implications.", "La diferencia entre demo y producto real esta aqui. Sin atajos: cada punto tiene impacto de seguridad.")}
          >
            <H3>{tr("1. File .env di produzione", "1. Production .env file", "1. Archivo .env de produccion")}</H3>
            <CodeBlock language="bash" code={ENV_PRODUCTION} />
            <H3>{tr("2. Traefik con HTTPS e Let's Encrypt", "2. Traefik with HTTPS and Let's Encrypt", "2. Traefik con HTTPS y Let's Encrypt")}</H3>
            <p>
              {tr("Il blocco TLS e gia presente nel", "The TLS block is already present in", "El bloque TLS ya esta presente en")} <code>compose.yaml</code> {tr("ma commentato. Per la produzione decommentalo e completa questi passi:", "but commented. For production, uncomment it and complete these steps:", "pero comentado. Para produccion, descomentarlo y completa estos pasos:")}
            </p>
            <CodeBlock language="yaml" code={TRAEFIK_TLS} />
            <CodeBlock language="bash" code={TRAEFIK_ACME_SETUP} />
            <H3>{tr("3. Labels per TLS e auth dashboard", "3. Labels for TLS and dashboard auth", "3. Labels para TLS y auth del dashboard")}</H3>
            <CodeBlock language="yaml" code={TRAEFIK_LABELS_PROD} />
            <Note>
              {tr("Non esporre mai la dashboard Traefik senza autenticazione. In sviluppo e aperta su", "Never expose Traefik dashboard without authentication. In development it can be open on", "Nunca expongas el dashboard de Traefik sin autenticacion. En desarrollo puede estar abierto en")} <code>:8080</code> {tr("per comodita, ma in produzione deve essere protetta o disabilitata.", "for convenience, but in production it must be protected or disabled.", "por comodidad, pero en produccion debe estar protegida o deshabilitada.")}
            </Note>
          </Section>

          {/* ── 04 CLI ── */}
          <Section
            id="cli-modules"
            eyebrow="04"
            title={tr("CLI: moduli admin senza boilerplate", "CLI: admin modules without boilerplate", "CLI: modulos admin sin boilerplate")}
            subtitle={tr("La CLI genera l'intera struttura di un modulo tenant-aware. Tu ti concentri sul dominio, non sull'impalcatura.", "The CLI generates the full structure of a tenant-aware module. You focus on domain logic, not scaffolding.", "La CLI genera toda la estructura de un modulo tenant-aware. Tu te enfocas en la logica de dominio, no en el andamiaje.")}
          >
            <H3>{tr("Cosa genera un singolo comando", "What a single command generates", "Que genera un solo comando")}</H3>
            <CodeBlock language="text" code={CLI_ANATOMY} />
            <H3>{tr("Comandi reali", "Real commands", "Comandos reales")}</H3>
            <CodeBlock language="bash" code={CLI_EXAMPLES} />
            <H3>{tr("Route generata (esempio con --superuser-only)", "Generated route (example with --superuser-only)", "Ruta generada (ejemplo con --superuser-only)")}</H3>
            <CodeBlock language="python" code={CLI_GENERATED_ROUTE} />
            <H3>{tr("Come arricchire con logica DB reale", "How to enrich with real DB logic", "Como enriquecer con logica DB real")}</H3>
            <p>
              {tr("Dopo la generazione, il pattern per aggiungere query reali e sempre lo stesso: importa il model, esegui la select filtrata per", "After generation, the pattern to add real queries is always the same: import the model, run a filtered select by", "Despues de la generacion, el patron para agregar queries reales es siempre el mismo: importa el modelo y ejecuta la select filtrada por")} <code>tenant_id</code>, {tr("passa i dati al template.", "then pass data to the template.", "y pasa los datos al template.")}
            </p>
            <CodeBlock language="python" code={CLI_ENRICH_ROUTE} />
            <Note>
              {tr("Il filtro", "The filter", "El filtro")} <code>tenant_id == tenant_obj.id</code> {tr("e il confine di isolamento tra tenant. Non dimenticarlo mai quando scrivi query su tabelle tenant-aware.", "is the isolation boundary between tenants. Never skip it when querying tenant-aware tables.", "es el limite de aislamiento entre tenants. Nunca lo omitas al consultar tablas tenant-aware.")}
            </Note>
          </Section>

          {/* ── 05 K6 ── */}
          <Section
            id="testing-k6"
            eyebrow="05"
            title={tr("Performance: misura prima di ottimizzare", "Performance: measure before optimizing", "Rendimiento: mide antes de optimizar")}
            subtitle={tr("Il test di login incluso nel progetto simula 700 utenti concorrenti sul flusso completo con CSRF. Usalo come base.", "The included login test simulates 700 concurrent users on the full CSRF flow. Use it as a baseline.", "El test de login incluido simula 700 usuarios concurrentes en el flujo completo con CSRF. Usalo como base.")}
          >
            <H3>{tr("Installazione e primo test", "Install and first test", "Instalacion y primer test")}</H3>
            <CodeBlock language="bash" code={K6_SETUP} />
            <CodeBlock language="bash" code={K6_RUN} />
            <Note>
              {tr("Prima di eseguire il test, modifica le credenziali in", "Before running the test, update credentials in", "Antes de ejecutar el test, actualiza las credenciales en")} <code>test/test_login.js</code> {tr("con un utente reale del tuo tenant dev. Il test simula anche l'estrazione del token CSRF dall'HTML della pagina di login.", "with a real user from your dev tenant. The test also simulates CSRF token extraction from the login page HTML.", "con un usuario real de tu tenant dev. El test tambien simula la extraccion del token CSRF desde el HTML del login.")}
            </Note>
            <H3>{tr("Template per testare qualsiasi route", "Template to test any route", "Template para testear cualquier ruta")}</H3>
            <CodeBlock language="javascript" code={K6_TEMPLATE} />
            <H3>{tr("Come leggere i risultati", "How to read results", "Como leer resultados")}</H3>
            <DataTable
              headers={[tr("Metrica", "Metric", "Metrica"), tr("Soglia buona", "Good threshold", "Umbral recomendado"), tr("Cosa misura", "What it measures", "Que mide")]}
              rows={K6_METRICS}
            />
          </Section>

          {/* ── 06 LITELLM ── */}
          <Section
            id="litellm-gdpr"
            eyebrow="06"
            title={tr("LiteLLM: policy, costi e GDPR", "LiteLLM: policies, costs and GDPR", "LiteLLM: politicas, costes y GDPR")}
            subtitle={tr("LiteLLM e il punto unico di controllo per tutti i provider LLM. Cambia provider senza toccare n8n o il backend.", "LiteLLM is the single control point for all LLM providers. Switch providers without touching n8n or backend.", "LiteLLM es el punto unico de control para todos los proveedores LLM. Cambia proveedor sin tocar n8n ni backend.")}
          >
            <p>
              {tr("Accedi alla UI su", "Access the UI at", "Accede a la UI en")} <code>http://litellm.localhost</code> {tr("usando la", "using", "usando la")} <code>APP_LITELLM_MASTER_KEY</code> {tr("dal tuo", "from your", "de tu")} <code>.env</code>.
            </p>
            <H3>{tr("1. Configurazione provider (litellm_config.yaml)", "1. Provider configuration (litellm_config.yaml)", "1. Configuracion de proveedor (litellm_config.yaml)")}</H3>
            <CodeBlock language="yaml" code={LITELLM_CONFIG} />
            <H3>{tr("2. Virtual key per tenant con limiti budget e GDPR", "2. Tenant virtual keys with budget limits and GDPR", "2. Virtual keys por tenant con limites de presupuesto y GDPR")}</H3>
            <p>
              {tr("Per tenant che richiedono data residency EU (es. GDPR), crea una virtual key che permette solo modelli con server europei:", "For tenants requiring EU data residency (e.g. GDPR), create a virtual key allowing only EU-hosted models:", "Para tenants que requieren residencia de datos en la UE (ej. GDPR), crea una virtual key que permita solo modelos alojados en Europa:")}
            </p>
            <CodeBlock language="bash" code={LITELLM_VIRTUAL_KEY} />
            <H3>{tr("3. Monitoraggio spesa", "3. Spend monitoring", "3. Monitoreo de gasto")}</H3>
            <CodeBlock language="bash" code={LITELLM_SPEND} />
            <Note>
              {tr("Dopo ogni modifica a", "After every change to", "Despues de cada cambio en")} <code>litellm_config.yaml</code>, {tr("esegui", "run", "ejecuta")} <code>docker compose restart litellm</code>. {tr("Non e necessario riavviare l'intero stack.", "You do not need to restart the full stack.", "No hace falta reiniciar todo el stack.")}
            </Note>
          </Section>

          {/* ── 07 N8N ── */}
          <Section
            id="n8n-setup"
            eyebrow="07"
            title={tr("n8n: setup e integrazione", "n8n: setup and integration", "n8n: configuracion e integracion")}
            subtitle={tr("n8n orchestra i workflow automatizzati. TenantHawk resta il sistema of record per tenant, utenti e billing.", "n8n orchestrates automated workflows. TenantHawk remains the system of record for tenants, users and billing.", "n8n orquesta workflows automatizados. TenantHawk sigue siendo el sistema de referencia para tenants, usuarios y billing.")}
          >
            <H3>{tr("1. Primo accesso", "1. First access", "1. Primer acceso")}</H3>
            <p>
              {tr("Vai su", "Open", "Ve a")} <code>http://n8n.localhost</code>. {tr("Al primo avvio, n8n guida attraverso la creazione dell'account owner e l'attivazione della licenza community gratuita su", "On first start, n8n guides you through owner account creation and free community license activation at", "En el primer arranque, n8n te guia para crear la cuenta owner y activar la licencia community gratuita en")} <code>community.n8n.io</code>.
            </p>
            <Note>
              <strong>{tr("Critico", "Critical", "Critico")}:</strong> {tr("la", "the", "la")} <code>APP_N8N_ENCRYPTION_KEY</code> {tr("nel", "in", "en")} <code>.env</code> {tr("deve essere impostata prima del primo avvio. Se la modifichi dopo, n8n non riesce piu a decifrare le credenziali salvate e bisogna ripartire da zero eliminando il volume.", "must be set before first startup. If you change it later, n8n cannot decrypt saved credentials and you must reset by deleting the volume.", "debe definirse antes del primer arranque. Si la cambias despues, n8n no puede descifrar credenciales guardadas y debes reiniciar eliminando el volumen.")}
            </Note>
            <H3>{tr("2. Connettere n8n a LiteLLM", "2. Connect n8n to LiteLLM", "2. Conectar n8n a LiteLLM")}</H3>
            <CodeBlock language="text" code={N8N_CREDENTIAL} />
            <H3>{tr("3. Workflow tipico: onboarding tenant automatico", "3. Typical workflow: automatic tenant onboarding", "3. Workflow tipico: onboarding de tenant automatico")}</H3>
            <CodeBlock language="text" code={N8N_WORKFLOW} />
            <H3>{tr("4. Backup workflow", "4. Workflow backup", "4. Backup de workflows")}</H3>
            <CodeBlock language="bash" code={N8N_BACKUP} />
            <H3>{tr("Reset completo (solo se necessario)", "Full reset (only if required)", "Reset completo (solo si es necesario)")}</H3>
            <CodeBlock language="bash" code={N8N_RESET} />
          </Section>

          {/* ── 08 BILLING POLICY ── */}
          <Section
            id="billing-policy"
            eyebrow="08"
            title={tr("Billing: grace period e cascade delete", "Billing: grace period and cascade delete", "Billing: periodo de gracia y cascade delete")}
            subtitle={tr("Il ciclo di vita del tenant e automatizzato. Nessun tenant viene eliminato senza una finestra di recupero.", "The tenant lifecycle is automated. No tenant is deleted without a recovery window.", "El ciclo de vida del tenant esta automatizado. Ningun tenant se elimina sin una ventana de recuperacion.")}
          >
            <p>
              {tr("La funzione", "The function", "La funcion")} <code>applica_policy_disattivazione_tenant()</code> {tr("viene chiamata ad ogni caricamento del tenant e gestisce automaticamente la transizione tra stati:", "is called at every tenant load and automatically handles state transitions:", "se llama en cada carga del tenant y gestiona automaticamente la transicion de estados:")}
            </p>
            <CodeBlock language="python" code={BILLING_POLICY_NOTE} />
            <DataTable
              headers={[tr("Stato", "Status", "Estado"), tr("Azione automatica", "Automatic action", "Accion automatica")]}
              rows={[
                [tr("ATTIVO / PROVA", "ACTIVE / TRIAL", "ACTIVO / PRUEBA"), tr("Nessuna azione, accesso garantito", "No action, access guaranteed", "Sin accion, acceso garantizado")],
                [tr("SCADUTO / CANCELLATO", "EXPIRED / CANCELED", "EXPIRADO / CANCELADO"), tr("Entra in SOSPESO con 14 giorni di grace period", "Moves to SUSPENDED with a 14-day grace period", "Entra en SUSPENDIDO con 14 dias de gracia")],
                [tr("SOSPESO (entro tregua)", "SUSPENDED (within grace)", "SUSPENDIDO (dentro de la gracia)"), tr("Accesso bloccato, nessuna eliminazione ancora", "Access blocked, no deletion yet", "Acceso bloqueado, aun sin eliminacion")],
                [tr("SOSPESO (tregua scaduta)", "SUSPENDED (grace expired)", "SUSPENDIDO (gracia vencida)"), tr("Verifica live Stripe → cascade delete se confermato", "Live Stripe check -> cascade delete if confirmed", "Verificacion live Stripe -> cascade delete si se confirma")],
              ]}
            />
            <Note>
              {tr("Prima di ogni azione distruttiva, il sistema esegue sempre una verifica live su Stripe. Se la connessione a Stripe fallisce", "Before any destructive action, the system always performs a live Stripe verification. If the Stripe connection fails", "Antes de cualquier accion destructiva, el sistema siempre realiza una verificacion live en Stripe. Si la conexion a Stripe falla")} (<code>verifica_live_ok = False</code>), {tr("la policy si blocca in fail-safe e non elimina nulla.", "the policy switches to fail-safe mode and deletes nothing.", "la politica entra en modo fail-safe y no elimina nada.")}
            </Note>
          </Section>

          {/* ── 09 WEB3 ── */}
          <Section
            id="web3"
            eyebrow="09"
            title={tr("Web3: quando e come integrarlo", "Web3: when and how to integrate it", "Web3: cuando y como integrarlo")}
            subtitle={tr("TenantHawk e volutamente Web2 per affidabilita B2B. Web3 entra solo dove crea un vantaggio competitivo reale.", "TenantHawk is intentionally Web2-first for B2B reliability. Web3 is used only where it creates real competitive advantage.", "TenantHawk es intencionalmente Web2 para fiabilidad B2B. Web3 entra solo cuando aporta ventaja competitiva real.")}
          >
            <p>
              {tr("Oggi identita, sessioni e billing sono centralizzati: cookie", "Today identity, sessions and billing are centralized: cookies", "Hoy identidad, sesiones y billing estan centralizados: cookies")} <code>httpOnly</code>, {tr("session store Redis, Stripe come authority di pagamento. Questa scelta riduce complessita e accelera il time-to-market. Web3 ha senso in quattro casi concreti: tokenized access, billing on-chain, login wallet-first, audit trail immutabile su chain.", "Redis session store and Stripe as payment authority. This reduces complexity and speeds time-to-market. Web3 makes sense in four concrete cases: tokenized access, on-chain billing, wallet-first login and immutable on-chain audit trail.", "session store Redis y Stripe como autoridad de pago. Esta eleccion reduce complejidad y acelera el time-to-market. Web3 tiene sentido en cuatro casos concretos: acceso tokenizado, billing on-chain, login wallet-first y trazabilidad inmutable en cadena.")}
            </p>
            <H3>{tr("1. Dipendenze", "1. Dependencies", "1. Dependencias")}</H3>
            <CodeBlock language="bash" code={SIWE_DEPS} />
            <H3>{tr("2. Aggiungere il campo wallet al model Utente", "2. Add wallet field to User model", "2. Agregar campo wallet al modelo Usuario")}</H3>
            <CodeBlock language="python" code={SIWE_MODEL} />
            <H3>{tr("3. Route SIWE backend", "3. SIWE backend routes", "3. Rutas SIWE backend")}</H3>
            <CodeBlock language="python" code={SIWE_BACKEND} />
            <H3>{tr("4. Componente frontend con wagmi", "4. Frontend component with wagmi", "4. Componente frontend con wagmi")}</H3>
            <CodeBlock language="typescript" code={SIWE_FRONTEND} />
            <Note>
              {tr("La parte chiave: la sessione generata dal flusso Web3 e identica strutturalmente a quella del login classico. Tutto il middleware di", "Key point: the session created by the Web3 flow is structurally identical to classic login. All middleware around", "Punto clave: la sesion creada por el flujo Web3 es estructuralmente identica al login clasico. Todo el middleware de")} <code>prendi_utente_corrente</code>, {tr("RBAC e tenancy funziona senza refactor, perche usa solo", "RBAC and tenancy works without refactors because it uses only", "RBAC y tenancy funciona sin refactors porque usa solo")} <code>id_utente</code> {tr("dalla sessione Redis.", "from Redis session data.", "desde la sesion de Redis.")}
            </Note>
          </Section>

          {/* ── CHECKLIST ── */}
          <Section
            id="launch-checklist"
            eyebrow="GO LIVE"
            title={tr("Checklist finale di lancio", "Final launch checklist", "Checklist final de lanzamiento")}
            subtitle={tr("Completa ogni punto prima di andare live. Nessun passaggio e opzionale.", "Complete every item before going live. No step is optional.", "Completa cada punto antes de ir a produccion. Ningun paso es opcional.")}
          >
            <ul className="space-y-3">
              {FINAL_CHECKLIST[locale].map((item) => (
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
              {tr("Hai una base operativa completa: architettura, sviluppo, produzione, automazioni, test e go-live. Il passo successivo e tradurre questa solidita tecnica in posizionamento e roadmap commerciale.", "You now have a complete operational baseline: architecture, development, production, automations, testing and go-live. The next step is turning this technical strength into positioning and commercial roadmap.", "Ahora tienes una base operativa completa: arquitectura, desarrollo, produccion, automatizaciones, testing y go-live. El siguiente paso es convertir esta solidez tecnica en posicionamiento y hoja de ruta comercial.")}
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
                {localize(ctaText.changelog, locale)}
              </Link>
            </div>
          </section>

        </div>
      </div>
    </MarketingShell>
  );
}
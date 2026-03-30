# 1. Web3: Perché è attualmente Web2 e come integrarlo

## Perché è Web2 oggi

TenantHawk è architetturalmente Web2 perché identità, sessioni e billing sono tutti **centralizzati**: le sessioni vivono in Redis , il billing è gestito da Stripe come authority centralizzata , e l'autenticazione usa cookie `httpOnly` emessi dal server . Non c'è nessun meccanismo di verifica on-chain, ownership crittografica o smart contract coinvolti. Questa è una scelta deliberata e corretta per un SaaS B2B tradizionale: Web3 aggiunge complessità reale che si giustifica solo se il modello di business lo richiede esplicitamente.

## Quando ha senso integrare Web3

Web3 diventa rilevante su TenantHawk in questi scenari specifici:

- **Tokenized access**: il diritto di accedere a un tenant è rappresentato da un NFT o token ERC-20, trasferibile tra utenti senza passare dal tuo backend
- **Billing on-chain**: i pagamenti avvengono in crypto (USDC, ETH) tramite smart contract invece di Stripe
- **Identità decentralizzata**: l'utente si autentica con il proprio wallet invece di email+password (Self-sovereign identity)
- **Audit trail immutabile**: azioni critiche su un tenant vengono registrate su chain per compliance

## Come integrare Web3 (approccio pratico)

Il punto di innesto più pulito è nel sistema di **autenticazione**: si aggiunge un flusso `Sign-In With Ethereum (SIWE)` parallelo a quello classico, senza rompere nulla.

**Step 1 — Installa dipendenze nel backend:**
```bash
# Nel requirements.txt
siwe>=2.1.0         # libreria SIWE per Python
web3>=6.0.0         # opzionale, per verifica firma on-chain
```

**Step 2 — Nuova route auth Web3 in FastAPI:**
```python
# backend/app/routes/auth/web3.py
from fastapi import APIRouter, HTTPException, Response
from siwe import SiweMessage
from app.core.sessione import gestore_sessioni
from app.core.database import get_db

router = APIRouter()

@router.post("/auth/web3/nonce")
async def genera_nonce(wallet_address: str):
    """Genera nonce temporaneo legato all'indirizzo wallet."""
    nonce = secrets.token_hex(16)
    # Salva in Redis con TTL 5 minuti
    await gestore_sessioni.redis.setex(
        f"web3_nonce:{wallet_address.lower()}",
        timedelta(minutes=5),
        nonce
    )
    return {"nonce": nonce}

@router.post("/auth/web3/verify")
async def verifica_firma_web3(payload: dict, response: Response, db=Depends(get_db)):
    """Verifica firma SIWE e crea sessione."""
    try:
        message = SiweMessage(message=payload["message"])
        message.verify(payload["signature"])
    except Exception:
        raise HTTPException(status_code=401, detail="Firma non valida")
    
    wallet = message.address.lower()
    
    # Controlla che il nonce corrisponda
    nonce_salvato = await gestore_sessioni.redis.get(f"web3_nonce:{wallet}")
    if nonce_salvato != message.nonce:
        raise HTTPException(status_code=401, detail="Nonce scaduto o non valido")
    
    # Trova o crea utente legato al wallet
    utente = await trova_o_crea_utente_wallet(db, wallet_address=wallet)
    
    # Crea sessione normale (riuso l'infrastruttura esistente)
    id_sessione = await gestore_sessioni.crea_sessione(
        id_utente=utente.id,
        id_tenant=utente.tenant_id,
        auth_method="web3",
        wallet=wallet,
    )
    
    response.set_cookie(
        key="id_sessione_utente",
        value=id_sessione,
        httponly=True,
        samesite="lax",
    )
    return {"ok": True}
```

**Step 3 — Aggiungi campo wallet al modello `Utente`:**
```python
# In backend/app/models/utente.py, aggiungere:
wallet_address: Mapped[str | None] = mapped_column(
    String(42),    # lunghezza indirizzo ETH
    unique=True,
    index=True,
    nullable=True,
)
```

**Step 4 — Frontend Next.js con wagmi:**
```bash
# Nel frontend
npm install wagmi viem @rainbow-me/rainbowkit
```

```typescript
// frontend/app/components/ConnectWallet.tsx
import { useSignMessage } from 'wagmi'

export function Web3Login() {
  const { signMessageAsync } = useSignMessage()

  const handleLogin = async () => {
    const { nonce } = await fetch('/api/auth/web3/nonce?wallet='+address).then(r=>r.json())
    const message = buildSiweMessage({ address, nonce, domain: 'admin.localhost' })
    const signature = await signMessageAsync({ message })
    await fetch('/api/auth/web3/verify', {
      method: 'POST',
      body: JSON.stringify({ message, signature })
    })
  }
}
```

Il punto chiave: la sessione generata da Web3 è **identica** a quella generata dal login classico. Tutto il middleware di `prendi_utente_corrente`, RBAC e tenancy funziona senza modifiche perché usa solo `id_utente` dalla sessione .

***

# 2. Casi d'uso

TenantHawk è progettato specificamente per prodotti B2B dove ogni cliente è un'entità separata con i propri utenti e piano di abbonamento .

## Casi ideali

**SaaS Gestionale B2B**
> Un'azienda che vende software gestionale a PMI. Ogni PMI è un tenant con il proprio admin, collaboratori e piano (BASE/PRO/COMPANY). Il billing Stripe è già pronto, il multi-tenant è risolto, l'onboarding si fa via CLI in 1 riga.

**Piattaforma di Automazioni AI per Agenzie**
> Un'agenzia che usa TenantHawk come backend per offrire workflow AI personalizzati ai propri clienti. n8n orchestra gli agenti, LiteLLM gestisce i provider LLM, e ogni cliente-agenzia è un tenant separato con il proprio piano.

**CMS Multi-Cliente**
> Un'agenzia web che gestisce siti per più clienti. Ogni cliente è un tenant con il proprio team redazionale (COLLABORATORI e MODERATORI). I SUPERUTENTE dell'agenzia hanno accesso cross-tenant per manutenzione.

**MVP di Marketplace B2B**
> Un marketplace dove ogni venditore/fornitore è un tenant. Il modello `UtenteRuolo.FORNITORE` e `UtenteRuolo.CLIENTE` è già definito nel codice , basta costruire le route sopra.

**Piattaforma Corsi/LMS**
> Una scuola di formazione con più "organizzazioni" clienti. Ogni organizzazione è un tenant, gli studenti sono UTENTI, i docenti COLLABORATORI, il responsabile formazione SUPERUTENTE.

## Casi meno adatti

| Scenario | Motivo |
|---|---|
| App consumer (B2C) 1 utente = 1 account | Il multi-tenant è overhead inutile |
| Editor visuale tipo Figma | Frontend-first, l'admin SSR Jinja2 non regge |
| Real-time collaborativo (tipo Notion) | Serve WebSocket dedicato, non solo REST |
| App puramente mobile | Next.js landing non serve, backend ok ma overkill |

***

# 3. Configurare Docker prima del lancio in produzione

## File .env completo

Partendo dal `.env.example` del progetto , ecco la configurazione completa con tutti i valori reali:

```bash
# Genera le chiavi sicure prima di tutto
openssl rand -hex 32   # per APP_SECRET_KEY
openssl rand -hex 32   # per APP_N8N_ENCRYPTION_KEY

# -----------------------------------------------
# PostgreSQL
# -----------------------------------------------
POSTGRES_USER=saas_user
POSTGRES_PASSWORD=<password_forte_generata>
POSTGRES_DB=saas_db
POSTGRES_HOST=db
POSTGRES_PORT=5432

# -----------------------------------------------
# SQLAlchemy async (nota: +asyncpg obbligatorio)
# -----------------------------------------------
APP_DATABASE_URL=postgresql+asyncpg://saas_user:<password>@db:5432/saas_db

# -----------------------------------------------
# Redis
# -----------------------------------------------
APP_REDIS_URL=redis://redis:6379

# -----------------------------------------------
# Sicurezza (NON usare mai il default in prod)
# -----------------------------------------------
APP_SECRET_KEY=<output di openssl rand -hex 32>

# -----------------------------------------------
# Email - Resend (https://resend.com)
# -----------------------------------------------
APP_RESEND_API_KEY=re_xxxxxxxxxxxx
APP_RESET_EMAIL_FROM=TuoSaaS <no-reply@tuodominio.com>
APP_RESEND_DEV_FALLBACK_FROM=TuoSaaS <onboarding@resend.dev>
APP_BASE_URL=https://admin.tuodominio.com
APP_FRONTEND_BASE_URL=https://www.tuodominio.com

# -----------------------------------------------
# Stripe (da dashboard.stripe.com)
# -----------------------------------------------
APP_STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx
APP_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
APP_STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
APP_STRIPE_PRICE_BASE=price_xxxxxxxxxxxx
APP_STRIPE_PRICE_PRO=price_xxxxxxxxxxxx
APP_STRIPE_PRICE_COMPANY=price_xxxxxxxxxxxx

# -----------------------------------------------
# LiteLLM
# -----------------------------------------------
APP_DEEPSEEK_API_KEY=sk-xxxxxxxxxxxx
APP_LITELLM_MASTER_KEY=<stringa-random-sicura>

# -----------------------------------------------
# n8n
# -----------------------------------------------
APP_N8N_ENCRYPTION_KEY=<output di openssl rand -hex 32>

# -----------------------------------------------
# Frontend
# -----------------------------------------------
NEXT_PUBLIC_API_BASE_URL=https://admin.tuodominio.com

# -----------------------------------------------
# Backend workers (in prod: almeno 2)
# -----------------------------------------------
APP_HOST=0.0.0.0
APP_PORT=8000
APP_RELOAD=false         # ← OBBLIGATORIO false in prod
APP_WORKERS=2            # ← Adattare alle CPU disponibili
```

## Attivare HTTPS in compose.yaml

Nel `compose.yaml` attuale il blocco TLS è commentato . Per la produzione:

```yaml
# Sostituire il blocco command di Traefik con:
command:
  - "--api.dashboard=true"
  - "--providers.docker=true"
  - "--providers.docker.exposedbydefault=false"
  - "--entrypoints.web.address=:80"
  - "--entrypoints.web.http.redirections.entryPoint.to=websecure"  # ← redirect HTTP→HTTPS
  - "--entrypoints.web.http.redirections.entryPoint.scheme=https"
  - "--entrypoints.websecure.address=:443"                          # ← HTTPS
  - "--certificatesresolvers.le.acme.httpchallenge=true"
  - "--certificatesresolvers.le.acme.httpchallenge.entrypoints=web"
  - "--certificatesresolvers.le.acme.email=tua@email.com"
  - "--certificatesresolvers.le.acme.storage=/acme.json"

ports:
  - "80:80"
  - "443:443"
  # rimuovere 8080 oppure proteggerlo con basic auth

volumes:
  - /var/run/docker.sock:/var/run/docker.sock:ro
  - ./traefik/acme.json:/acme.json   # ← decommentare
```

**Preparare il file acme.json prima dell'avvio:**
```bash
mkdir -p traefik
touch traefik/acme.json
chmod 600 traefik/acme.json   # ← obbligatorio, Traefik rifiuta se i permessi sono troppo aperti
```

**Attivare TLS sui router backend e frontend:**
```yaml
# Nel blocco labels del backend, sostituire:
- "traefik.http.routers.backend-admin-prod.entrypoints=websecure"
- "traefik.http.routers.backend-admin-prod.tls.certresolver=le"

# E per il frontend:
- "traefik.http.routers.frontend-www-prod.entrypoints=websecure"
- "traefik.http.routers.frontend-www-prod.tls.certresolver=le"
```

## Proteggere la dashboard Traefik

Il README avverte esplicitamente di proteggere la dashboard in produzione . Aggiungere basic auth:

```bash
# Genera hash password (htpasswd)
echo $(htpasswd -nb admin <tua_password>) | sed -e s/\\$/\\$\\$/g
# Output: admin:$$apr1$$xxxxx (nota i $$ escaped)
```

```yaml
# Aggiungere ai labels di Traefik:
- "traefik.http.routers.dashboard.rule=Host(`traefik.tuodominio.com`)"
- "traefik.http.routers.dashboard.middlewares=auth"
- "traefik.http.middlewares.auth.basicauth.users=admin:$$apr1$$xxxxx"
- "traefik.http.routers.dashboard.tls.certresolver=le"
```

## Checklist lancio

```
□ APP_RELOAD=false
□ APP_WORKERS >= 2
□ APP_SECRET_KEY generata con openssl (non default)
□ APP_N8N_ENCRYPTION_KEY generata con openssl
□ HTTPS attivato in compose.yaml
□ traefik/acme.json creato con chmod 600
□ Dashboard Traefik protetta con basic auth
□ Stripe: usare chiavi live (sk_live_*) non test
□ Stripe webhook configurato con URL produzione
□ Backup pg_data pianificato
□ MAI usare docker compose down -v in produzione
```

***

# 4. Configurare per sviluppo locale

## Setup iniziale completo

```bash
# 1. Clona il progetto
git clone https://github.com/AlessioQuagliara/SaaS_Template.git
cd SaaS_Template

# 2. Copia il file .env example
cp .env.example .env
```

## .env per sviluppo (valori minimi)

```bash
# PostgreSQL
POSTGRES_USER=dev_user
POSTGRES_PASSWORD=dev_password
POSTGRES_DB=dev_db
POSTGRES_HOST=db
POSTGRES_PORT=5432

# SQLAlchemy
APP_DATABASE_URL=postgresql+asyncpg://dev_user:dev_password@db:5432/dev_db

# Redis
APP_REDIS_URL=redis://redis:6379

# Chiave sessioni (in dev va bene qualsiasi stringa)
APP_SECRET_KEY=dev_secret_key_non_sicura_solo_per_sviluppo

# Email: in dev usa il fallback Resend gratuito
# oppure lascia vuoto e disabilita le email
APP_RESEND_API_KEY=re_test_xxxxxxxxxxx
APP_RESET_EMAIL_FROM=Dev <no-reply@resend.dev>
APP_RESEND_DEV_FALLBACK_FROM=Dev <onboarding@resend.dev>
APP_BASE_URL=http://admin.localhost
APP_FRONTEND_BASE_URL=http://www.localhost

# Stripe: usa chiavi TEST
APP_STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx
APP_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
APP_STRIPE_WEBHOOK_SECRET=whsec_test_xxxxxxxxxxxx
APP_STRIPE_PRICE_BASE=price_test_xxxxxxxxxxxx
APP_STRIPE_PRICE_PRO=price_test_xxxxxxxxxxxx
APP_STRIPE_PRICE_COMPANY=price_test_xxxxxxxxxxxx

# LiteLLM (opzionale in dev, puoi commentare il servizio nel compose)
APP_DEEPSEEK_API_KEY=sk-xxxxxxxxxxxx
APP_LITELLM_MASTER_KEY=dev_litellm_key

# n8n
APP_N8N_ENCRYPTION_KEY=dev_n8n_key_32_chars_minimum_ok

# Backend dev: reload attivo
APP_HOST=0.0.0.0
APP_PORT=8000
APP_RELOAD=true          # ← hot reload in sviluppo
APP_WORKERS=1
```

## Avvio con hot reload

```bash
# Prima build e avvio
docker compose up --build

# Avvii successivi (più veloci, senza rebuild)
docker compose up -d

# Migrazioni (solo alla prima volta o quando si aggiungono modelli)
docker compose exec backend alembic revision --autogenerate -m "Inizializza"
docker compose exec backend alembic upgrade head

# Crea primo tenant+admin
docker compose exec backend python -m app.cli seed tenant-admin \
  --slug dev \
  --nome-tenant "Tenant Dev" \
  --admin-email dev@dev.it \
  --admin-password "Dev123!"
```

## Indirizzi locali

| Servizio | URL |
|---|---|
| Admin backend | http://admin.localhost |
| Landing frontend | http://www.localhost |
| Traefik dashboard | http://localhost:8080 |
| LiteLLM | http://litellm.localhost |
| n8n | http://n8n.localhost |
| Backend API docs | http://admin.localhost/docs |
| Backend ReDoc | http://admin.localhost/redoc |

> **Attenzione:** `admin.localhost` e `www.localhost` funzionano solo se il tuo browser risolve `.localhost` localmente. Chrome e Firefox lo fanno nativamente. Se hai problemi, aggiungi a `/etc/hosts`:
> ```
> 127.0.0.1 admin.localhost www.localhost litellm.localhost n8n.localhost
> ```

## Workflow sviluppo quotidiano

```bash
# Modifiche al codice backend (hot reload attivo con APP_RELOAD=true)
# → Le modifiche ai file in backend/app/ si ricaricano automaticamente

# Aggiungere una nuova migration dopo aver modificato un model
docker compose exec backend alembic revision --autogenerate -m "Aggiunge campo X"
docker compose exec backend alembic upgrade head

# Vedere i log in tempo reale
docker compose logs -f backend
docker compose logs -f frontend

# Riavviare solo un servizio
docker compose restart backend

# Entrare nella shell del container backend
docker compose exec backend bash

# Connettersi direttamente al DB
docker compose exec db psql -U dev_user -d dev_db
```

***

# 5. Come implementare moduli con la CLI

La CLI genera automaticamente la struttura completa di un modulo admin partendo da un nome .

## Anatomia di un modulo generato

Quando esegui `create-module`, la CLI crea :

```
backend/app/
├── routes/admin/<nome>.py         ← Route FastAPI con Jinja2
├── templates/admin/<nome>/
│   └── index.html                  ← Template HTML base Tailwind
├── models/<nome>.py               ← (opzionale) SQLAlchemy model
├── schemas/<nome>.py              ← (opzionale) Pydantic schema
└── routes/admin/__init__.py       ← Aggiornato automaticamente
```

## Esempi pratici

**Modulo base (tutti i ruoli autenticati):**
```bash
docker compose exec backend python -m app.cli admin create-module clienti
```

**Modulo con accesso solo SUPERUTENTE + model + schema:**
```bash
docker compose exec backend python -m app.cli admin create-module ordini-vendite \
  --label "Ordini e Vendite" \
  --superuser-only \
  --with-model \
  --with-schema
```

**Modulo report accessibile a più ruoli:**
```bash
docker compose exec backend python -m app.cli admin create-module report-mensile \
  --label "Report Mensile" \
  --with-model
```

**Lista moduli esistenti:**
```bash
docker compose exec backend python -m app.cli admin list-modules
# Output:
# Moduli admin disponibili:
# - clienti
# - ordini_vendite
# - report_mensile
```

## Cosa viene generato: il codice reale

La CLI produce questo file di route per un modulo `--superuser-only` :

```python
# routes/admin/ordini_vendite.py (generato automaticamente)
from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse
from app.core.auth import prendi_utente_corrente
from app.core.permessi import prendi_ruolo_corrente, richiede_ruolo
from app.core.templates import templates
from app.core.tenancy import prendi_tenant_con_accesso
from app.models import Tenant, Utente, UtenteRuolo

router = APIRouter()

@router.get("/ordini_vendite", response_class=HTMLResponse)
async def ordini_vendite_page(
    request: Request,
    tenant_obj: Tenant = Depends(prendi_tenant_con_accesso),
    utente_corrente: Utente = Depends(prendi_utente_corrente),
    ruolo_corrente: str = Depends(prendi_ruolo_corrente),
    _: None = Depends(richiede_ruolo([UtenteRuolo.SUPERUTENTE])),  # ← guard RBAC
):
    return templates.TemplateResponse(
        request,
        "admin/ordini_vendite/index.html",
        {
            "tenant": tenant_obj,
            "utente": utente_corrente,
            "ruolo_corrente": ruolo_corrente,
        },
    )
```

Il template HTML generato estende `base.html` con Tailwind già impostato :

```html
<!-- templates/admin/ordini_vendite/index.html -->
{% extends "admin/base.html" %}

{% block admin_heading %}Ordini e Vendite{% endblock %}

{% block admin_content %}
<section class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
  <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">Ordini e Vendite</h1>
  <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
    Modulo <strong>ordini_vendite</strong> creato con CLI. Personalizza qui.
  </p>
</section>
{% endblock %}
```

## Workflow completo modulo con dati reali

Dopo la generazione, questo è il pattern per aggiungere logica reale:

```bash
# 1. Genera il modulo
docker compose exec backend python -m app.cli admin create-module prodotti \
  --label "Catalogo Prodotti" \
  --with-model --with-schema

# 2. Genera la migration per il nuovo model
docker compose exec backend alembic revision --autogenerate -m "Aggiunge tabella prodotti"
docker compose exec backend alembic upgrade head

# 3. Apri routes/admin/prodotti.py e aggiungi la logica DB
# 4. Apri templates/admin/prodotti/index.html e costruisci la UI
```

**Esempio di route arricchita con query DB:**
```python
# routes/admin/prodotti.py - dopo la generazione, aggiungere:
from sqlalchemy import select
from app.core.database import get_db
from app.models.prodotti import Prodotti   # ← model generato dalla CLI

@router.get("/prodotti", response_class=HTMLResponse)
async def prodotti_page(
    request: Request,
    tenant_obj: Tenant = Depends(prendi_tenant_con_accesso),
    utente_corrente: Utente = Depends(prendi_utente_corrente),
    ruolo_corrente: str = Depends(prendi_ruolo_corrente),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Prodotti).where(Prodotti.tenant_id == tenant_obj.id)
    )
    prodotti = result.scalars().all()
    
    return templates.TemplateResponse(
        request, "admin/prodotti/index.html",
        {"tenant": tenant_obj, "utente": utente_corrente,
         "ruolo_corrente": ruolo_corrente, "prodotti": prodotti},
    )
```

***

# 6. Come fare i test con k6 per velocità

## Setup k6

```bash
# macOS
brew install k6

# Linux (Debian/Ubuntu)
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg \
  --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" \
  | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6

# Docker (senza installazione)
docker run --rm -i grafana/k6 run - <test/test_login.js
```

## Eseguire il test esistente

Il file `test/test_login.js` testa il flusso completo di login con CSRF . Prima di eseguirlo, modifica le credenziali:

```javascript
// test/test_login.js - riga 47/48
email: 'admin@demo.it',   // ← le tue credenziali reali
password: 'Demo123!',
```

```bash
# Test standard (700 VU, 30 secondi)
k6 run test/test_login.js

# Test con output più dettagliato
k6 run --out json=result.json test/test_login.js

# Test con meno VU per sviluppo (non bruciare il DB locale)
k6 run --vus 10 --duration 10s test/test_login.js
```

## Anatomia del test 

Il flusso testato in 5 step:

```
Step 1: GET /auth/login         → ottieni CSRF token dall'HTML
Step 2: POST /auth/login        → login con CSRF + credenziali
Step 3: Verifica risposta 303   → redirect corretto post-login
Step 4: GET /dashboard          → accede con cookie sessione
Step 5: Verifica dashboard      → HTML corretto, nessun errore sessione
```

## Test personalizzati per altri endpoint

**Template generico per testare una route admin:**
```javascript
// test/test_dashboard.js
import http from 'k6/http'
import { check, sleep } from 'k6'

const BASE_URL = 'http://admin.localhost:8000'
const SESSION_COOKIE = 'id_sessione_utente=<cookie_reale_da_redis>'

export const options = {
  stages: [
    { duration: '10s', target: 50 },   // ramp up a 50 VU in 10s
    { duration: '30s', target: 200 },  // sale a 200 VU in 30s
    { duration: '10s', target: 0 },    // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95° percentile sotto 500ms
    http_req_failed: ['rate<0.01'],    // meno dell'1% di errori
  },
}

export default function () {
  const res = http.get(`${BASE_URL}/demo/dashboard`, {
    headers: { Cookie: SESSION_COOKIE },
  })
  
  check(res, {
    'status 200': r => r.status === 200,
    'risposta sotto 200ms': r => r.timings.duration < 200,
  })
  
  sleep(0.5)
}
```

**Test per le API JSON:**
```javascript
// test/test_api.js
import http from 'k6/http'
import { check } from 'k6'

export const options = {
  vus: 100,
  duration: '20s',
  thresholds: {
    http_req_duration: ['p(99)<300'],
  },
}

export default function () {
  const healthRes = http.get('http://admin.localhost:8000/health')
  check(healthRes, {
    'health ok': r => r.status === 200,
    'risposta JSON': r => JSON.parse(r.body).status === 'ok',
  })
}
```

## Interpretare i risultati

```
✓ checks.........................: 99.92% ✓ 12267  ✗ 9
  http_req_duration.............: avg=45.2ms  p(95)=102ms  p(99)=198ms
  http_req_failed...............: 0.00%  ✓ 0  ✗ 5262
  http_reqs.....................: 5262   175.4/s
  vus...........................: 700    min=1  max=700
```

| Metrica | Cosa guarda | Soglia buona |
|---|---|---|
| `p(95)` durata | 95% richieste sotto X ms | < 300ms |
| `p(99)` durata | coda lenta | < 1000ms |
| `http_req_failed` | richieste con errore HTTP | < 1% |
| `checks` | asserzioni logiche dell'app | > 99% |
| `http_reqs/s` | throughput | dipende dal caso |

***

# 7. LiteLLM: policy, GDPR e configurazione

## Accesso alla UI

Con lo stack avviato, la UI di LiteLLM è accessibile su:
```
http://litellm.localhost
```

Per accedere, usa la `APP_LITELLM_MASTER_KEY` definita nel `.env` . Questa è la chiave amministrativa che dà accesso completo alla dashboard.

## Configurazione provider nel file yaml

Il file `litellm_config.yaml` nella root del progetto controlla tutti i modelli disponibili :

```yaml
# litellm_config.yaml
model_list:
  # Provider attuale: DeepSeek
  - model_name: deepseek-chat
    litellm_params:
      model: deepseek/deepseek-chat
      api_key: os.environ/APP_DEEPSEEK_API_KEY

  - model_name: deepseek-reasoner
    litellm_params:
      model: deepseek/deepseek-reasoner
      api_key: os.environ/APP_DEEPSEEK_API_KEY

  # Aggiungere OpenAI (es. per clienti che lo richiedono)
  - model_name: gpt-4o
    litellm_params:
      model: openai/gpt-4o
      api_key: os.environ/APP_OPENAI_API_KEY

  # Provider EU per GDPR (Mistral AI, server in Francia)
  - model_name: mistral-large
    litellm_params:
      model: mistral/mistral-large-latest
      api_key: os.environ/APP_MISTRAL_API_KEY

  # Anthropic come fallback
  - model_name: claude-sonnet
    litellm_params:
      model: anthropic/claude-sonnet-4-5
      api_key: os.environ/APP_ANTHROPIC_API_KEY

general_settings:
  master_key: os.environ/APP_LITELLM_MASTER_KEY
```

Dopo ogni modifica al yaml, riavvia solo LiteLLM senza toccare il resto dello stack:
```bash
docker compose restart LiteLLM
```

## GDPR: switch provider per tenant EU

Il vantaggio principale di LiteLLM in questo stack è la possibilità di instradare chiamate su provider diversi in base alle esigenze di compliance :

**Strategia 1 — Virtual key per tenant:**
Dalla UI di LiteLLM (`http://litellm.localhost` → Keys), crea una virtual key per ogni tenant con permessi limitati ai modelli consentiti:

```bash
# Crea virtual key EU-only via API LiteLLM
curl -X POST http://litellm.localhost/key/generate \
  -H "Authorization: Bearer $APP_LITELLM_MASTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "models": ["mistral-large"],      # solo provider EU
    "metadata": {"tenant_id": "azienda-eu"},
    "max_budget": 10.0,               # budget massimo in USD
    "budget_duration": "30d"
  }'
```

**Strategia 2 — Router con fallback automatico:**
```yaml
# litellm_config.yaml - routing intelligente
router_settings:
  routing_strategy: "latency-based-routing"
  fallbacks:
    - model: deepseek-chat
      fallback: mistral-large    # se DeepSeek è down, usa Mistral

model_list:
  - model_name: eu-compliant
    litellm_params:
      model: mistral/mistral-large-latest
      api_key: os.environ/APP_MISTRAL_API_KEY
      # Mistral AI: dati processati in data center UE
```

## Monitoring uso per tenant (base billing a consumo)

LiteLLM traccia token e costi per virtual key, che è la base per implementare billing a consumo nel SaaS :

```bash
# Vedi utilizzo di una chiave specifica
curl http://litellm.localhost/key/info?key=<virtual_key> \
  -H "Authorization: Bearer $APP_LITELLM_MASTER_KEY"

# Vedi spesa totale
curl http://litellm.localhost/spend/keys \
  -H "Authorization: Bearer $APP_LITELLM_MASTER_KEY"
```

***

# 8. Accedere e configurare n8n

## Primo accesso

Al primo avvio dello stack, n8n non ha credenziali preimpostate . Vai su:
```
http://n8n.localhost
```

Segui il wizard di setup iniziale:
1. Inserisci email e password per l'**account owner**
2. n8n chiede di attivare la licenza community gratuita
3. Vai su **Settings → Usage and Plan**
4. Inserisci la chiave community ricevuta via email su `community.n8n.io`

> **Importante:** La `APP_N8N_ENCRYPTION_KEY` nel `.env` deve essere impostata **prima** del primo avvio. Se la cambi dopo, n8n non riesce più a decifrare le credenziali salvate e bisogna ripartire da zero eliminando il volume .

## Connettere n8n a LiteLLM (OpenAI-compatible)

In n8n, crea una nuova credential di tipo **OpenAI**:

```
Credentials → New → OpenAI API
  API Key:  <APP_LITELLM_MASTER_KEY>
  Base URL: http://litellm:4000   ← URL interno Docker, non litellm.localhost
```

Usa `http://litellm:4000` (nome servizio Docker) e non `http://litellm.localhost` perché n8n è dentro la rete Docker `web` e deve comunicare con gli altri container tramite nome servizio .

## Connettere n8n alle API del backend

Per fare chiamate al backend FastAPI dall'interno di n8n, usa l'URL interno Docker:

```
HTTP Request node:
  Method: GET/POST
  URL: http://backend:8000/demo/dashboard
  Headers:
    Cookie: id_sessione_utente=<session_token>
```

Oppure crea le API pubbliche necessarie con autenticazione per token API (da aggiungere come future route in FastAPI) per un'integrazione più pulita.

## Workflow tipico: onboarding tenant automatico

Questo è il tipo di workflow che n8n gestisce bene in questo stack:

```
Webhook trigger (nuovo tenant registrato)
    ↓
HTTP Request → backend: GET /demo/utenti (lista utenti nuovo tenant)
    ↓
OpenAI node → LiteLLM (genera email di benvenuto personalizzata)
    ↓
HTTP Request → backend: POST /api/email/send
    ↓
Wait 3 giorni
    ↓
HTTP Request → backend: GET /demo/sottoscrizione (verifica trial)
    ↓
If: trial scade in 2 giorni?
    ↓ Sì
HTTP Request → Stripe API: recupera info cliente
    ↓
OpenAI node → LiteLLM (genera email reminder upgrade)
    ↓
Resend node → Invia email
```

## Gestione problemi comuni

**Problema — n8n non vede LiteLLM:**
```bash
# Verifica che entrambi siano sulla stessa rete
docker compose exec n8n ping litellm
# Se non risponde, controlla il compose.yaml networks
```

**Problema — Encryption key mismatch:**
```bash
# Reset completo n8n (ATTENZIONE: cancella tutti i workflow salvati)
docker compose down
docker volume rm saas_template_n8n_data
docker compose up -d
```

**Problema — X-Forwarded-For con Traefik:**
Già risolto nel compose con `N8N_TRUST_PROXY=true` . Se aggiungi n8n in un nuovo ambiente, ricordati sempre questa variabile.

## Backup workflow n8n

I workflow di n8n sono salvati nel volume `n8n_data`. Per esportarli:

```bash
# Esporta tutti i workflow via CLI n8n
docker compose exec n8n n8n export:workflow --all --output=/home/node/.n8n/backup_workflows.json

# Copia fuori dal container
docker cp $(docker compose ps -q n8n):/home/node/.n8n/backup_workflows.json ./backup/
```
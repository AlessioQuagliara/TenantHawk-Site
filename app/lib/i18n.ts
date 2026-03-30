export const LOCALES = ["it", "en", "es"] as const;

export type Locale = (typeof LOCALES)[number];

type SearchParamsInput = Promise<Record<string, string | string[] | undefined> | undefined>;

type LocalizedText = Record<Locale, string>;

type FeatureItem = {
  title: LocalizedText;
  description: LocalizedText;
};

type UseCaseItem = {
  title: LocalizedText;
  description: LocalizedText;
};

type ArchitectureBlock = {
  title: LocalizedText;
  bullets: LocalizedText[];
};

function t(it: string, en: string, es: string): LocalizedText {
  return { it, en, es };
}

export function normalizeLocale(value: string | null | undefined): Locale {
  if (!value) {
    return "it";
  }

  const lowered = value.toLowerCase();
  return LOCALES.includes(lowered as Locale) ? (lowered as Locale) : "it";
}

export async function getLocaleFromSearchParams(searchParams: SearchParamsInput): Promise<Locale> {
  const resolved = await searchParams;
  const raw = resolved?.lang;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return normalizeLocale(value);
}

export function withLang(path: string, locale: Locale): string {
  return `${path}?lang=${locale}`;
}

export const languageNames: Record<Locale, string> = {
  it: "Italiano",
  en: "English",
  es: "Espanol",
};

export const navText = {
  home: t("Home", "Home", "Inicio"),
  features: t("Feature", "Features", "Funciones"),
  useCases: t("Casi d'uso", "Use Cases", "Casos de uso"),
  architecture: t("Architettura", "Architecture", "Arquitectura"),
  why: t("Perché", "Why", "Por que"),
  docs: t("Docs", "Docs", "Docs"),
};

export const seoLocaleCode: Record<Locale, string> = {
  it: "it_IT",
  en: "en_US",
  es: "es_ES",
};

export function languageAlternates(path: string): Record<string, string> {
  return {
    "it-IT": withLang(path, "it"),
    "en-US": withLang(path, "en"),
    "es-ES": withLang(path, "es"),
  };
}

export const commonText = {
  siteTagline: t("Multi-tenant SaaS senza complessita inutile", "Multi-tenant SaaS without unnecessary complexity", "SaaS multi-tenant sin complejidad innecesaria"),
  creator: t("Creatore", "Creator", "Creador"),
  creatorName: t("Alessio Quagliara", "Alessio Quagliara", "Alessio Quagliara"),
  creatorByline: t(
    "Template open source MIT creato da Alessio Quagliara",
    "MIT open source template created by Alessio Quagliara",
    "Template open source MIT creado por Alessio Quagliara"
  ),
  footer: t(
    "TenantHawk | Open Source MIT | Creato da Alessio Quagliara",
    "TenantHawk | MIT Open Source | Created by Alessio Quagliara",
    "TenantHawk | MIT Open Source | Creado por Alessio Quagliara"
  ),
};

export const ctaText = {
  latestReleases: t("Ultime release", "Latest releases", "Ultimos releases"),
  openRelease: t("Apri release su GitHub", "Open release on GitHub", "Abrir release en GitHub"),
  exploreArchitecture: t("Esplora architettura", "Explore architecture", "Explorar arquitectura"),
  seeAllFeatures: t("Vedi tutte le feature", "See all features", "Ver todas las funciones"),
  exploreDocs: t("Esplora docs", "Explore docs", "Explorar docs"),
  readStory: t("Leggi la storia di TenantHawk", "Read the story behind TenantHawk", "Lee la historia de TenantHawk"),
  changelog: t("Changelog", "Changelog", "Changelog"),
};

export const homeText = {
  seoTitle: t(
    "TenantHawk - Template SaaS multi-tenant open source MIT",
    "TenantHawk - Open Source MIT Multi-tenant SaaS Template",
    "TenantHawk - Template SaaS multi-tenant open source MIT"
  ),
  seoDescription: t(
    "Template SaaS multi-tenant open source MIT creato da Alessio Quagliara: FastAPI, Next.js, Stripe, n8n, Traefik e LiteLLM.",
    "MIT open source multi-tenant SaaS template by Alessio Quagliara: FastAPI, Next.js, Stripe, n8n, Traefik and LiteLLM.",
    "Template SaaS multi-tenant open source MIT creado por Alessio Quagliara: FastAPI, Next.js, Stripe, n8n, Traefik y LiteLLM."
  ),
  h1: t(
    "TenantHawk - Multi-tenant SaaS senza complessita inutile",
    "TenantHawk - Multi-tenant SaaS without unnecessary complexity",
    "TenantHawk - SaaS multi-tenant sin complejidad innecesaria"
  ),
  subtitle: t(
    "Costruisci SaaS multi-tenant piu velocemente, con un'architettura solida e senza reinventare ogni volta autenticazione, routing e gestione tenant.",
    "Build multi-tenant SaaS faster, with a solid architecture and without reinventing authentication, routing and tenant management every time.",
    "Construye SaaS multi-tenant mas rapido, con una arquitectura solida y sin reinventar autenticacion, routing y gestion de tenants cada vez."
  ),
  sections: {
    problemTitle: t("Il problema", "The Problem", "El problema"),
    problemBody: t(
      "Costruire un SaaS multi-tenant reale non è banale. La complessita cresce rapidamente tra isolamento tenant, ruoli, routing e integrazioni.",
      "Building a real multi-tenant SaaS is not trivial. Complexity grows quickly across tenant isolation, roles, routing and integrations.",
      "Construir un SaaS multi-tenant real no es trivial. La complejidad crece rapido entre aislamiento de tenants, roles, routing e integraciones."
    ),
    problemBullets: [
      t("isolamento dei tenant", "tenant isolation", "aislamiento de tenants"),
      t("autenticazione e ruoli", "authentication and roles", "autenticacion y roles"),
      t("routing per dominio o header", "domain or header routing", "routing por dominio o header"),
      t("integrazione tra servizi", "service integration", "integracion entre servicios"),
      t("scalabilita e manutenzione", "scalability and maintenance", "escalabilidad y mantenimiento"),
    ],
    solutionTitle: t("La soluzione", "The Solution", "La solucion"),
    solutionBody: t(
      "TenantHawk è una base progettata per risolvere questi problemi con multi-tenancy reale, integrazione semplice e architettura evolvibile.",
      "TenantHawk is a foundation designed to solve these issues with real multi-tenancy, simple integrations and an evolvable architecture.",
      "TenantHawk es una base disenada para resolver estos problemas con multi-tenancy real, integracion simple y arquitectura evolutiva."
    ),
    howTitle: t("Come funziona", "How It Works", "Como funciona"),
    howBullets: [
      t("gestione tenant via header o dominio", "tenant handling via header or domain", "gestion tenant por header o dominio"),
      t("backend FastAPI", "FastAPI backend", "backend FastAPI"),
      t("rendering server-side con HTMX", "server-side rendering with HTMX", "renderizado server-side con HTMX"),
      t("routing dinamico con Traefik", "dynamic routing with Traefik", "routing dinamico con Traefik"),
      t("API pronte per estensioni future", "APIs ready for future extensions", "APIs listas para extensiones futuras"),
    ],
    audienceTitle: t("Per chi è", "Who It Is For", "Para quien es"),
    audienceBullets: [
      t("sviluppatori che vogliono lanciare SaaS", "developers launching SaaS products", "desarrolladores que quieren lanzar SaaS"),
      t("agenzie che gestiscono piu clienti", "agencies managing multiple clients", "agencias que gestionan multiples clientes"),
      t("aziende con sistemi interni multi-tenant", "companies with internal multi-tenant systems", "empresas con sistemas internos multi-tenant"),
      t("prodotti con dashboard operative", "products with operational dashboards", "productos con dashboards operativos"),
    ],
  },
  cta: {
    title: t("Call to action", "Call to action", "Llamada a la accion"),
    subtitle: t(
      "Se stai costruendo un SaaS e vuoi partire da una base solida:",
      "If you are building a SaaS and want to start from a solid base:",
      "Si estas creando un SaaS y quieres empezar desde una base solida:"
    ),
    accessTemplate: t("Accedi al template", "Access the template", "Accede al template"),
    requestAccess: t("Richiedi accesso", "Request access", "Solicitar acceso"),
    demo: t("Guarda la demo", "Watch the demo", "Ver la demo"),
  },
};

export const featuresText = {
  seoTitle: t("TenantHawk Features", "TenantHawk Features", "Funciones de TenantHawk"),
  seoDescription: t(
    "Feature principali di TenantHawk per costruire SaaS multi-tenant in produzione.",
    "Core TenantHawk features to build production-ready multi-tenant SaaS.",
    "Funciones principales de TenantHawk para construir SaaS multi-tenant en produccion."
  ),
  h1: t("Feature principali", "Core Features", "Funciones principales"),
  items: [
    {
      title: t("Multi-tenant core", "Multi-tenant core", "Nucleo multi-tenant"),
      description: t(
        "Gestione tenant progettata per applicazioni reali, con isolamento e flessibilita.",
        "Tenant management built for real products, with isolation and flexibility.",
        "Gestion de tenants pensada para productos reales, con aislamiento y flexibilidad."
      ),
    },
    {
      title: t("Autenticazione e ruoli", "Authentication and roles", "Autenticacion y roles"),
      description: t(
        "Sistema pronto per gestione utenti, accessi e permessi.",
        "Ready-to-use system for users, access and permissions.",
        "Sistema listo para gestionar usuarios, accesos y permisos."
      ),
    },
    {
      title: t("Architettura scalabile", "Scalable architecture", "Arquitectura escalable"),
      description: t(
        "Struttura progettata per crescere senza diventare ingestibile.",
        "Designed to scale without becoming unmanageable.",
        "Disenada para crecer sin volverse inmanejable."
      ),
    },
    {
      title: t("API-first", "API-first", "API-first"),
      description: t(
        "Integrazione semplice con servizi esterni, AI e automazioni.",
        "Easy integration with external services, AI and automations.",
        "Integracion sencilla con servicios externos, IA y automatizaciones."
      ),
    },
    {
      title: t("Automazione", "Automation", "Automatizacion"),
      description: t(
        "Compatibile con strumenti come n8n per workflow operativi reali.",
        "Compatible with tools like n8n for real operational workflows.",
        "Compatible con herramientas como n8n para flujos operativos reales."
      ),
    },
    {
      title: t("Container-ready", "Container-ready", "Preparado para contenedores"),
      description: t(
        "Pronto per Docker e routing dinamico con Traefik.",
        "Ready for Docker deployments and dynamic routing with Traefik.",
        "Listo para Docker y routing dinamico con Traefik."
      ),
    },
  ] satisfies FeatureItem[],
};

export const useCasesText = {
  seoTitle: t("TenantHawk Use Cases", "TenantHawk Use Cases", "Casos de uso TenantHawk"),
  seoDescription: t(
    "Scenari reali dove TenantHawk accelera la costruzione di SaaS multi-tenant.",
    "Real scenarios where TenantHawk accelerates multi-tenant SaaS delivery.",
    "Escenarios reales donde TenantHawk acelera la creacion de SaaS multi-tenant."
  ),
  h1: t("Casi d'uso", "Use Cases", "Casos de uso"),
  items: [
    {
      title: t("SaaS per agenzie", "Agency SaaS", "SaaS para agencias"),
      description: t(
        "Gestione multi-cliente con isolamento dati e configurazioni separate.",
        "Multi-client management with data isolation and separate configurations.",
        "Gestion multi-cliente con aislamiento de datos y configuraciones separadas."
      ),
    },
    {
      title: t("Dashboard operative", "Operational dashboards", "Dashboards operativos"),
      description: t(
        "Sistemi per produzione, logistica e monitoraggio.",
        "Systems for production, logistics and monitoring.",
        "Sistemas para produccion, logistica y monitoreo."
      ),
    },
    {
      title: t("Sistemi aziendali interni", "Internal business systems", "Sistemas internos empresariales"),
      description: t(
        "Applicazioni multi-tenant per processi interni.",
        "Multi-tenant applications for internal processes.",
        "Aplicaciones multi-tenant para procesos internos."
      ),
    },
    {
      title: t("Prodotti AI-powered", "AI-powered products", "Productos impulsados por IA"),
      description: t(
        "Base per costruire applicazioni con integrazione AI.",
        "Foundation to build applications with AI integration.",
        "Base para construir aplicaciones con integracion de IA."
      ),
    },
    {
      title: t("Automazione e integrazione", "Automation and integration", "Automatizacion e integracion"),
      description: t(
        "Collegamento tra sistemi, dati e workflow operativi.",
        "Bridging systems, data and operational workflows.",
        "Conexion entre sistemas, datos y flujos operativos."
      ),
    },
  ] satisfies UseCaseItem[],
};

export const architectureText = {
  seoTitle: t("TenantHawk Architecture", "TenantHawk Architecture", "Arquitectura TenantHawk"),
  seoDescription: t(
    "Dettaglio tecnico dell'architettura TenantHawk: backend, frontend, routing e multi-tenancy.",
    "Technical breakdown of TenantHawk architecture: backend, frontend, routing and multi-tenancy.",
    "Detalle tecnico de la arquitectura TenantHawk: backend, frontend, routing y multi-tenancy."
  ),
  h1: t("Architettura", "Architecture", "Arquitectura"),
  intro: t(
    "TenantHawk e progettato per essere semplice ma potente.",
    "TenantHawk is designed to be simple yet powerful.",
    "TenantHawk esta disenado para ser simple pero potente."
  ),
  blocks: [
    {
      title: t("Backend", "Backend", "Backend"),
      bullets: [t("FastAPI", "FastAPI", "FastAPI"), t("API modulari", "Modular APIs", "APIs modulares"), t("gestione asincrona", "async architecture", "arquitectura asincrona")],
    },
    {
      title: t("Frontend", "Frontend", "Frontend"),
      bullets: [t("HTMX", "HTMX", "HTMX"), t("server-side rendering", "server-side rendering", "renderizado server-side"), t("interfacce leggere", "lightweight interfaces", "interfaces ligeras")],
    },
    {
      title: t("Routing", "Routing", "Routing"),
      bullets: [t("Traefik", "Traefik", "Traefik"), t("multi-domain", "multi-domain", "multi-dominio"), t("gestione tenant dinamica", "dynamic tenant resolution", "resolucion dinamica de tenants")],
    },
    {
      title: t("Multi-tenancy", "Multi-tenancy", "Multi-tenancy"),
      bullets: [t("header-based", "header-based", "header-based"), t("domain-based", "domain-based", "domain-based"), t("isolamento dati", "data isolation", "aislamiento de datos")],
    },
    {
      title: t("Integrazione", "Integration", "Integracion"),
      bullets: [t("API-first", "API-first", "API-first"), t("compatibile con n8n", "n8n compatible", "compatible con n8n"), t("estendibile con AI", "AI-extensible", "extensible con IA")],
    },
  ] satisfies ArchitectureBlock[],
  philosophyTitle: t("Filosofia", "Philosophy", "Filosofia"),
  philosophyBody: t(
    "Ridurre complessita inutile e costruire sistemi realmente utilizzabili.",
    "Reduce unnecessary complexity and build systems that stay usable over time.",
    "Reducir complejidad innecesaria y construir sistemas realmente utilizables."
  ),
};

export const whyText = {
  seoTitle: t("Perché esiste TenantHawk", "Why TenantHawk Exists", "Por que existe TenantHawk"),
  seoDescription: t(
    "Story e positioning di TenantHawk: meno complessita e basi solide per prodotti SaaS reali.",
    "TenantHawk story and positioning: less complexity, stronger foundations for real SaaS products.",
    "Historia y posicionamiento de TenantHawk: menos complejidad y bases solidas para productos SaaS reales."
  ),
  h1: t("Perché esiste TenantHawk", "Why TenantHawk Exists", "Por que existe TenantHawk"),
  body: t(
    "Costruire SaaS multi-tenant e spesso piu complesso del necessario. TenantHawk nasce per semplificare il processo e renderlo sostenibile nel tempo.",
    "Building multi-tenant SaaS is often more complex than it should be. TenantHawk was created to simplify the process and keep it sustainable over time.",
    "Construir SaaS multi-tenant suele ser mas complejo de lo necesario. TenantHawk nace para simplificar el proceso y hacerlo sostenible en el tiempo."
  ),
  objectiveTitle: t("L'obiettivo", "Goal", "Objetivo"),
  objectiveBullets: [
    t("ridurre il tempo di sviluppo", "reduce development time", "reducir tiempo de desarrollo"),
    t("evitare architetture fragili", "avoid fragile architectures", "evitar arquitecturas fragiles"),
    t("costruire basi solide per prodotti reali", "build strong foundations for real products", "construir bases solidas para productos reales"),
  ],
  philosophyTitle: t("Filosofia", "Philosophy", "Filosofia"),
  philosophyBody: t(
    "Non aggiungere complessita per moda. Costruire sistemi che funzionano davvero nel tempo.",
    "Do not add complexity for trends. Build systems that truly work over time.",
    "No agregar complejidad por moda. Construir sistemas que funcionen de verdad en el tiempo."
  ),
};

export const pricingText = {
  seoTitle: t("Pricing TenantHawk", "TenantHawk Pricing", "Precios TenantHawk"),
  seoDescription: t(
    "Piani TenantHawk: Open Source, Extended e Custom.",
    "TenantHawk plans: Open Source, Extended and Custom.",
    "Planes de TenantHawk: Open Source, Extended y Custom."
  ),
  h1: t("Pricing", "Pricing", "Precios"),
  intro: t("TenantHawk e disponibile in diverse modalita.", "TenantHawk is available in different options.", "TenantHawk esta disponible en diferentes opciones."),
  plans: [
    {
      title: t("Open Source", "Open Source", "Open Source"),
      description: t("Accesso al core del progetto.", "Access to the project core.", "Acceso al nucleo del proyecto."),
    },
    {
      title: t("Extended", "Extended", "Extended"),
      description: t("Template completo con feature avanzate.", "Complete template with advanced features.", "Template completo con funciones avanzadas."),
    },
    {
      title: t("Custom", "Custom", "Custom"),
      description: t("Supporto e sviluppo su misura.", "Custom support and development.", "Soporte y desarrollo a medida."),
    },
  ] satisfies FeatureItem[],
  contact: t("Contattami per dettagli.", "Contact me for details.", "Contactame para mas detalles."),
};

export const docsText = {
  seoTitle: t("TenantHawk Docs - Guida Template SaaS", "TenantHawk Docs - SaaS Template Guide", "TenantHawk Docs - Guia del Template SaaS"),
  seoDescription: t(
    "Documentazione completa TenantHawk: stack tecnico, avvio progetto, codice fondamentale e best practices.",
    "Complete TenantHawk documentation: tech stack, project setup, core code and best practices.",
    "Documentacion completa TenantHawk: stack tecnico, inicio proyecto, codigo fundamental y mejores practicas."
  ),
  h1: t("Documentazione Completa", "Complete Documentation", "Documentacion Completa"),
  intro: t(
    "SaaS Template multi-tenant production-ready basato su FastAPI + Next.js, pensato per passare da idea a prodotto funzionante.",
    "Production-ready multi-tenant SaaS Template based on FastAPI + Next.js, designed to go from idea to working product.",
    "SaaS Template multi-tenant listo para produccion basado en FastAPI + Next.js, disenado para ir de idea a producto funcionando."
  ),
  openRepo: t("Apri repository GitHub", "Open GitHub repository", "Abrir repositorio GitHub"),
  goFeatures: t("Vai alle feature", "Go to features", "Ir a funciones"),
  
  // Section titles
  overview: t("Panoramica", "Overview", "Resumen"),
  techStack: t("Stack Tecnologico", "Tech Stack", "Stack Tecnologico"),
  quickStart: t("Avvio Rapido", "Quick Start", "Inicio Rapido"),
  projectStructure: t("Struttura Progetto", "Project Structure", "Estructura Proyecto"),
  coreCode: t("Codice Fondamentale", "Core Code", "Codigo Fundamental"),
  database: t("Database", "Database", "Base de Datos"),
  sessions: t("Sessioni", "Sessions", "Sesiones"),
  auth: t("Autenticazione", "Authentication", "Autenticacion"),
  security: t("Sicurezza", "Security", "Seguridad"),
  csrf: t("Protezione CSRF", "CSRF Protection", "Proteccion CSRF"),
  rbac: t("RBAC Multi-Tenant", "Multi-Tenant RBAC", "RBAC Multi-Tenant"),
  tenancy: t("Tenancy", "Tenancy", "Tenancy"),
  ormModels: t("Modelli ORM", "ORM Models", "Modelos ORM"),
  billing: t("Billing", "Billing", "Facturacion"),
  dockerInfra: t("Infrastruttura Docker", "Docker Infrastructure", "Infraestructura Docker"),
  configuration: t("Configurazione", "Configuration", "Configuracion"),
  cli: t("CLI Scaffolding", "CLI Scaffolding", "CLI Scaffolding"),
  litellm: t("LiteLLM Proxy", "LiteLLM Proxy", "Proxy LiteLLM"),
  performance: t("Performance", "Performance", "Rendimiento"),
  production: t("Checklist Produzione", "Production Checklist", "Checklist Produccion"),

  // Content text
  techStackTable: t(
    "| Layer | Tecnologia | Ruolo |\n|---|---|---|\n| Backend | FastAPI (async) | API + Admin SSR |\n| ORM | SQLAlchemy async | Accesso DB |\n| Database | PostgreSQL 16 | Persistenza dati |\n| Sessioni | Redis 7 | Session store server-side |\n| Frontend | Next.js | Landing page + SEO |\n| Template Admin | Jinja2 + HTMX | UI Admin senza SPA |\n| Reverse Proxy | Traefik v3 | Routing + TLS |\n| Billing | Stripe | Checkout + Webhook |\n| Automazioni | n8n | Workflow + AI Agent |\n| LLM Proxy | LiteLLM | Provider switching |\n| Migrations | Alembic | Schema versioning |\n| Test | k6 | Load testing |",
    "| Layer | Technology | Role |\n|---|---|---|\n| Backend | FastAPI (async) | API + Admin SSR |\n| ORM | SQLAlchemy async | DB Access |\n| Database | PostgreSQL 16 | Data persistence |\n| Sessions | Redis 7 | Server-side session store |\n| Frontend | Next.js | Landing page + SEO |\n| Admin Template | Jinja2 + HTMX | Admin UI without SPA |\n| Reverse Proxy | Traefik v3 | Routing + TLS |\n| Billing | Stripe | Checkout + Webhook |\n| Automations | n8n | Workflow + AI Agent |\n| LLM Proxy | LiteLLM | Provider switching |\n| Migrations | Alembic | Schema versioning |\n| Testing | k6 | Load testing |",
    "| Capa | Tecnologia | Rol |\n|---|---|---|\n| Backend | FastAPI (async) | API + Admin SSR |\n| ORM | SQLAlchemy async | Acceso DB |\n| Database | PostgreSQL 16 | Persistencia datos |\n| Sesiones | Redis 7 | Almacen sesiones server-side |\n| Frontend | Next.js | Landing page + SEO |\n| Template Admin | Jinja2 + HTMX | UI Admin sin SPA |\n| Reverse Proxy | Traefik v3 | Routing + TLS |\n| Billing | Stripe | Checkout + Webhook |\n| Automatizaciones | n8n | Workflow + AI Agent |\n| Proxy LLM | LiteLLM | Cambio proveedor |\n| Migraciones | Alembic | Versionado esquema |\n| Testing | k6 | Load testing |"
  ),

  quickStartDesc: t(
    "L'intero stack si avvia con un singolo comando Docker:",
    "The entire stack starts with a single Docker command:",
    "Todo el stack se inicia con un solo comando Docker:"
  ),

  quickStartCommands: t(
    "Prima dell'avvio, bisogna applicare le migrazioni Alembic:",
    "Before starting, you need to apply Alembic migrations:",
    "Antes de iniciar, debes aplicar las migraciones de Alembic:"
  ),

  quickStartSeed: t(
    "Per creare il primo tenant+admin senza passare dalla UI di registrazione:",
    "To create the first tenant+admin without going through the registration UI:",
    "Para crear el primer tenant+admin sin pasar por la UI de registro:"
  ),

  projectStructureDesc: t(
    "Struttura del progetto con tutti i moduli principali:",
    "Project structure with all main modules:",
    "Estructura del proyecto con todos los modulos principales:"
  ),

  coreCodeDesc: t(
    "Il file main.py usa il pattern factory function + lifespan per gestire il ciclo di vita dell'applicazione:",
    "The main.py file uses the factory function + lifespan pattern to manage the application lifecycle:",
    "El archivo main.py usa el patron factory function + lifespan para gestionar el ciclo de vida de la aplicacion:"
  ),

  databaseDesc: t(
    "Il pool di connessioni async è configurato con limiti espliciti per prevenire esaurimento risorse:",
    "The async connection pool is configured with explicit limits to prevent resource exhaustion:",
    "El pool de conexiones async se configura con limites explicitos para prevenir agotamiento de recursos:"
  ),

  sessionsDesc: t(
    "Il SessionManager gestisce l'intero ciclo di vita delle sessioni server-side con sliding window TTL:",
    "The SessionManager manages the entire lifecycle of server-side sessions with sliding window TTL:",
    "El SessionManager gestiona todo el ciclo de vida de las sesiones server-side con TTL de ventana deslizante:"
  ),

  authDesc: t(
    "La dependency prendi_utente_corrente è il guardiano di tutte le route protette:",
    "The prendi_utente_corrente dependency is the guardian of all protected routes:",
    "La dependencia prendi_utente_corrente es el guardian de todas las rutas protegidas:"
  ),

  securityDesc: t(
    "bcrypt è CPU-intensive e bloccherebbe l'event loop se eseguito in modo sincrono. La soluzione usa un semaforo:",
    "bcrypt is CPU-intensive and would block the event loop if executed synchronously. The solution uses a semaphore:",
    "bcrypt es intensivo en CPU y bloquearia el event loop si se ejecuta sincronamente. La solucion usa un semaforo:"
  ),

  csrfDesc: t(
    "I token CSRF sono firmati con itsdangerous e legati alla sessione utente:",
    "CSRF tokens are signed with itsdangerous and bound to the user session:",
    "Los tokens CSRF se firman con itsdangerous y se vinculan a la sesion del usuario:"
  ),

  rbacDesc: t(
    "Il sistema di ruoli è per-tenant: lo stesso utente può essere SUPERUTENTE su un tenant e semplice UTENTE su un altro:",
    "The role system is per-tenant: the same user can be SUPERUSER on one tenant and simple USER on another:",
    "El sistema de roles es por-tenant: el mismo usuario puede ser SUPERUSUARIO en un tenant y simple USUARIO en otro:"
  ),

  tenancyDesc: t(
    "La dependency prendi_tenant_corrente risolve il tenant dallo slug nel path URL e verifica la sottoscrizione:",
    "The prendi_tenant_corrente dependency resolves the tenant from the slug in the URL path and verifies the subscription:",
    "La dependencia prendi_tenant_corrente resuelve el tenant desde el slug en la ruta URL y verifica la suscripcion:"
  ),

  ormModelsDesc: t(
    "Modelli ORM principali per Tenant e Sottoscrizione con relazioni e stati:",
    "Main ORM models for Tenant and Subscription with relationships and states:",
    "Modelos ORM principales para Tenant y Subscription con relaciones y estados:"
  ),

  billingDesc: t(
    "Il cuore del billing è billing_sync.py, che mappa gli stati Stripe agli stati interni con grace period:",
    "The heart of billing is billing_sync.py, which maps Stripe states to internal states with grace period:",
    "El corazon del billing es billing_sync.py, que mapea estados Stripe a estados internos con periodo de gracia:"
  ),

  dockerInfraDesc: t(
    "Il compose.yaml definisce 6 servizi su una rete bridge condivisa con Traefik come reverse proxy:",
    "The compose.yaml defines 6 services on a shared bridge network with Traefik as reverse proxy:",
    "El compose.yaml define 6 servicios en una red bridge compartida con Traefik como reverse proxy:"
  ),

  configurationDesc: t(
    "La configurazione usa pydantic-settings con prefisso APP_ per tutte le variabili d'ambiente:",
    "Configuration uses pydantic-settings with APP_ prefix for all environment variables:",
    "La configuracion usa pydantic-settings con prefijo APP_ para todas las variables de entorno:"
  ),

  cliDesc: t(
    "La CLI elimina il boilerplate ripetitivo con comandi per scaffolding e gestione tenant:",
    "The CLI eliminates repetitive boilerplate with commands for scaffolding and tenant management:",
    "La CLI elimina el boilerplate repetitivo con comandos para scaffolding y gestion de tenant:"
  ),

  litellmDesc: t(
    "LiteLLM fa da intermediario tra n8n e i provider LLM reali, esponendo un endpoint OpenAI-compatible:",
    "LiteLLM acts as an intermediary between n8n and real LLM providers, exposing an OpenAI-compatible endpoint:",
    "LiteLLM actua como intermediario entre n8n y proveedores LLM reales, exponiendo un endpoint compatible con OpenAI:"
  ),

  performanceDesc: t(
    "Il load test su k6 simula 700 VU concorrenti per 30 secondi sul flusso completo di login:",
    "The k6 load test simulates 700 concurrent VUs for 30 seconds on the complete login flow:",
    "La prueba de carga k6 simula 700 VU concurrentes durante 30 segundos en el flujo completo de login:"
  ),

  productionDesc: t(
    "Checklist critica prima di andare in produzione con sicurezza e configurazione:",
    "Critical checklist before going to production with security and configuration:",
    "Checklist critica antes de ir a produccion con seguridad y configuracion:"
  ),

  codeBlock: t("Codice", "Code", "Codigo"),
  commandBlock: t("Comando", "Command", "Comando"),
  structureBlock: t("Struttura", "Structure", "Estructura"),
  tableBlock: t("Tabella", "Table", "Tabla"),
  importantNote: t("Nota importante:", "Important note:", "Nota importante:"),
  criticalStep: t("Passo critico:", "Critical step:", "Paso critico:"),
  advantage: t("Vantaggio:", "Advantage:", "Ventaja:"),
  keyPoint: t("Punto chiave:", "Key point:", "Punto clave:"),
  productionTip: t("Tip produzione:", "Production tip:", "Tip produccion:"),
};

export const changelogText = {
  seoTitle: t("TenantHawk Changelog", "TenantHawk Changelog", "Changelog TenantHawk"),
  seoDescription: t(
    "Release e aggiornamenti ufficiali TenantHawk da GitHub.",
    "Official TenantHawk releases and updates from GitHub.",
    "Releases y actualizaciones oficiales de TenantHawk desde GitHub."
  ),
  h1: t("Changelog", "Changelog", "Changelog"),
  intro: t(
    "Cronologia ufficiale delle release pubbliche.",
    "Official timeline of public releases.",
    "Cronologia oficial de releases publicas."
  ),
  backHome: t("Torna alla home", "Back to home", "Volver al inicio"),
  viewReleases: t("Apri release GitHub", "View GitHub releases", "Ver releases de GitHub"),
};

export function localize(text: LocalizedText, locale: Locale): string {
  return text[locale];
}

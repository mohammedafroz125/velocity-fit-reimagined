# Velocity Fit — Architectural Decision Records (ADR)

## ADR-001: Next.js App Router & React Server Components (RSC)
- **Status:** Approved
- **Context:** The legacy WordPress site suffered from slow mobile load times, heavy jQuery bundles, and plugin script conflicts. The client requires a modern, production-grade application optimized for mobile conversions.
- **Decision:** Adopt Next.js 15+ (App Router) with React Server Components as the core framework.
- **Consequences:** Layouts, static editorial pages (`/about`, `/how-it-works`, `/faq`), and SEO metadata execute completely on the server with zero client JS footprint. Client hydration is isolated strictly to interactive islands (assessment wizard, mobile drawer, contact form).

---

## ADR-002: Centralized CSS Variable Design Token Architecture
- **Status:** Approved
- **Context:** The official brand color palette is provisional (deep charcoal, warm champagne gold, soft warm off-white/neutrals) and may be fine-tuned by the client later. Hardcoding hex colors across hundreds of component classes would create immense technical debt.
- **Decision:** Establish all colors, radii, typography, and spacing tokens as CSS Custom Properties in `src/styles/tokens.css`, mapped into Tailwind utility classes in `tailwind.config.ts`.
- **Consequences:** Any future palette adjustment can be made in a single file (`tokens.css`), propagating instantly across every component with zero layout regressions.

---

## ADR-003: Decoupled Typed Data Repositories for Multi-Phase Backend Integration
- **Status:** Approved
- **Context:** Phase 1 requires immediate launch of the public website and lead foundation without waiting for full PostgreSQL database configuration and hosting setup.
- **Decision:** Structure all business entities (programs, FAQs, assessments, leads) behind strongly typed TypeScript data repositories (`src/data/*`).
- **Consequences:** Phase 1 runs blazingly fast with zero external database latency. In Phase 2, the data access layer can switch to Supabase PostgreSQL SDK client queries without modifying any frontend UI components.

---

## ADR-004: Preservation of Verified Commercial Products & Real Pricing
- **Status:** Approved
- **Context:** The live WooCommerce site had real active product variations: `VELOCITYFIT TRANSFORMATION` with tracks `Flex` and `Grit`, support tiers `Prime` and `Elite`, and durations `1-month` and `3-months` priced from ₹2,000 to ₹8,000.
- **Decision:** Faithfully retain and structure this exact product hierarchy into `src/data/programs.ts`, preserving the client's existing commercial model.
- **Consequences:** No commercial data is invented. The pricing and tracks match real-world client operations.

---

## ADR-005: 5-Stage Clinical Health Assessment Schema
- **Status:** Approved
- **Context:** The live site ran a FluentForms pre-signup assessment featuring 5 distinct clinical categories (Demographics, Body Snapshot, Medical Background, Lifestyle & V6 Audit™, and Readiness).
- **Decision:** Re-implement this comprehensive intake as an interactive, accessible, multi-step wizard at `/get-started`.
- **Consequences:** Qualified patient leads are generated directly into the system, drastically improving consultation conversion rates compared to generic contact forms.

---

## ADR-006: Omnichannel Attribution Engine (First-Touch & Last-Touch)
- **Status:** Approved
- **Context:** Inbound traffic originates across Instagram bios, reels, stories, WhatsApp links, and Google search. The client lacked visibility into which channel produced paying clients.
- **Decision:** Deploy a lightweight client-side attribution listener that persists UTM parameters, referrer URLs, and landing pages to `sessionStorage` and attaches this metadata to all lead and assessment submissions.
- **Consequences:** 100% attribution transparency for Dr. Fatima's marketing spend.

---

## ADR-007: Strict Zero-Fabrication Policy for Unverified Content
- **Status:** Approved
- **Context:** Certain assets (high-res vector logo, official clinic physical address, verified patient transformation photos) have not yet been provided by the client.
- **Decision:** Strictly prohibit AI invention of fake testimonials, fake client counts, or fabricated medical claims. Where content is pending, deploy structured, visually appealing semantic placeholders clearly flagged for future admin/CMS insertion.
- **Consequences:** Protects the clinical reputation of Dr. Lubna Fatima and guarantees legal compliance with medical advertising standards in India.

---

## ADR-008: Supabase PostgreSQL Architecture & Dual-Mode DB Gateway
- **Status:** Approved
- **Context:** Transitioning from Phase 1 to Phase 2A requires enterprise-grade persistence, Row-Level Security, and authentication without breaking offline development or CI build pipelines.
- **Decision:** Deploy Supabase PostgreSQL with complete DDL migrations (`supabase/migrations/`) and `@supabase/ssr`. Route all database operations through a unified gateway (`src/lib/supabase/db.ts`) that executes against Supabase when credentials exist, and falls back to a thread-safe in-memory store during offline development and testing.
- **Consequences:** Production readiness with zero environment-locking. `next build` and local testing run cleanly without requiring remote database availability.

---

## ADR-009: Lead Deduplication & Zero Medical Data Leak Policy
- **Status:** Approved
- **Context:** Multiple form submissions by the same prospective client could pollute the CRM. Furthermore, sensitive health conditions, medications, and bowel habits must comply with clinical confidentiality.
- **Decision:** Implement automatic phone normalization (E.164) and deduplication. Re-engaging clients are updated and reactivated to `FOLLOW_UP`. Enforce a strict boundary where health assessments are visible only to authenticated doctors in `/admin/leads/[id]` and never exposed to analytics, URLs, or notification logs.
- **Consequences:** Clean CRM records and ironclad medical privacy protection.

---

## ADR-010: Strict Server-Side Commercial Pricing Resolution
- **Status:** Approved
- **Context:** Client-side form tampering could attempt to manipulate program pricing before dispatching checkout transactions.
- **Decision:** Establish `src/lib/payments/pricing.ts` as the single authoritative source of truth, strictly mapping program track, support tier, and duration to verified commercial rates (Prime: ₹2,000/₹5,500, Elite: ₹3,000/₹8,000). The server computes order amount and ignores any client-submitted prices.
- **Consequences:** 100% price integrity and protection against malicious price manipulation.

---

## ADR-011: Calendar Provider Abstraction & Double-Booking Prevention in Asia/Kolkata (IST)
- **Status:** Approved
- **Context:** Consultation slots must align with Dr. Lubna Fatima's operating hours in Hyderabad (IST, GMT+5:30) while supporting seamless future migration to Google Calendar or Cal.com.
- **Decision:** Implement `CalendarProvider` interface with `MockCalendarProvider` and `ExternalCalendarProvider`. Operating hours are strictly bounded to Mon–Sat (10:00–13:00, 15:00–18:00 IST), Sunday closed. Availability queries and appointment bookings verify non-cancelled appointment collisions in the database.
- **Consequences:** Robust double-booking prevention, clear local IST time displays, and zero vendor lock-in.

---

## ADR-012: Cryptographic Payment Verification & Gated Lead Conversion
- **Status:** Approved
- **Context:** Marking leads as converted upon checkout initiation or order creation leads to false conversion metrics if the payment subsequently fails or gets cancelled.
- **Decision:** Gated lead conversion: Leads transition to `PAYMENT_PENDING` upon order creation, and are marked `CONVERTED` **only** upon cryptographic HMAC-SHA256 signature verification on `POST /api/payments/verify` or idempotent webhook `order.paid` on `POST /api/payments/webhook`. Failed or cancelled checkouts preserve pre-conversion status.
- **Consequences:** Accurate conversion reporting and zero unearned conversions.



# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Read this entire file before starting any task.

This project is a **React + TypeScript + Vite frontend** with a **Node.js/Express backend** for KITES (Kuwait Institute for Training & Engineering Simulations).

The goal is to deliver an **enterprise-grade, institutional website** that positions KITES as a **value-added engineering simulation partner**, not a software reseller.

---

# Core Objective

This is NOT a typical website.

This is a **high-trust, executive-level engineering platform**.

Every decision must reinforce:

- Authority
- Clarity
- Professionalism
- Technical depth

The website must feel like:

"This is a long-term engineering partner — not a vendor."

---

# Commands

## Frontend

```bash
bun install        # Install dependencies
bun run dev        # Dev server on port 8080
bun run build      # Production build → dist/
bun run lint       # ESLint
bun run preview    # Preview build
```

`npm` also works — `.npmrc` sets `legacy-peer-deps=true`. No test suite is configured.

## Backend

```bash
cd backend
npm install
npm run dev        # Nodemon dev server
npm run migrate    # Run DB migrations
npm run build      # Compile TypeScript
```

See [backend/SETUP.md](backend/SETUP.md) for database setup and environment variables.

---

# Architecture

## Frontend

**Path alias:** `@/` maps to `src/`.

**Routing** (`src/App.tsx`): React Router v6. Every page is wrapped in `<PageTransition>`. A `<SplashScreen>` fires on route changes. Provider stack (outermost → innermost): `HelmetProvider` → `QueryClientProvider` → `LanguageProvider` → `AuthContext` → `TooltipProvider` → `BrowserRouter`.

Pages live in `src/pages/`. Dynamic routes: `/services/:serviceId`, `/partners/:partnerId`. Admin routes live under `src/pages/admin/`, guarded by `src/components/admin/PrivateRoute.tsx`.

**Localization:** English/Arabic (RTL) via `src/contexts/LanguageContext.tsx`, which flips `document.dir`/`document.lang`. JSON content is in `src/content/{en,ar}/` and loaded with the `useContent<T>()` hook (`src/hooks/useContent.ts`) via Vite glob imports. Hard-coded content (service detail copy, course metadata) lives in `src/data/`.

**UI Components:**
- shadcn/ui primitives in `src/components/ui/` (Radix UI based). Add new ones via the shadcn CLI.
- Domain components grouped by feature: `src/components/{home,sections,services,training,layout,admin,…}`.
- Design tokens defined in `tailwind.config.ts`.

**State & Data Fetching:** TanStack Query v5 for server state. Auth state via `src/contexts/AuthContext.tsx`. Form state via React Hook Form + Zod. API calls go through `src/lib/apiClient.ts`.

**SEO:** Per-route metadata in `src/config/seo.config.ts`, rendered by `src/components/common/SEO.tsx` via `react-helmet-async`.

**Third-party widgets:** Voiceflow chatbot injected in `index.html`. WhatsApp floating button at `src/components/WhatsAppFloatingButton.tsx`.

## Backend

Node.js + Express + TypeScript, located in `backend/`. PostgreSQL database accessed via `pg` connection pool (`backend/src/db/pool.ts`).

Key areas:
- **Auth:** JWT-based (`backend/src/config/jwt.ts`), middleware in `backend/src/middleware/auth.ts`, RBAC in `backend/src/middleware/rbac.ts`.
- **Payments:** Hesabe payment gateway (`backend/src/services/hesabe.service.ts`).
- **Routes:** auth, courses, enrollments, payments, admin (users, courses, enrollments, analytics).
- **Migrations:** SQL files in `backend/src/db/migrations/`, run via `backend/src/db/migrate.ts`.
- **File uploads:** Multer config at `backend/src/config/multer.ts`.

Environment variables required: see `backend/.env.example` and `.env.example` (frontend).

---

# Tech Stack

- React 18 + TypeScript + Vite (SWC)
- Tailwind CSS + shadcn/ui
- React Router v6
- GSAP (primary animation engine)
- Framer Motion (secondary, only if needed)
- @react-three/fiber + drei (hero visuals)
- Lottie (`lottie-react`) — pre-rendered JSON animations; definitions in `src/lib/lottieAnimations.ts`
- TanStack Query v5
- react-helmet-async
- Express + PostgreSQL (backend)

---

# Design System Rules

## Color Rules

Primary base:
- Dark / black (from logo)

Accent:
- Blue (ONLY accent color)

Rules:

- Never introduce new accent colors
- Never overuse blue
- Blue is used ONLY for:
  - hover states
  - CTAs
  - active states
  - subtle highlights

Avoid:

- gradients with multiple colors
- random color usage
- flashy UI

---

## Typography Rules

- Clean, modern sans-serif
- Clear hierarchy
- No decorative fonts
- No excessive bold usage

Headlines:
- Calm, strong, not aggressive

---

## Layout Rules

- Large spacing (py-24, py-32)
- Balanced whitespace
- No clutter
- Controlled max width

---

# Motion System (CRITICAL)

## Global Motion Rules

All animations must feel:

- Calm
- Smooth
- Premium
- Controlled

Use:

```
cubic-bezier(0.4, 0, 0.2, 1)
```

Never use:

- bounce
- elastic
- overshoot
- exaggerated scaling

---

## GSAP Rules (PRIMARY)

GSAP is the main animation engine. Utilities in `src/lib/gsap.ts`.

Use GSAP for:

- Hero entrance
- KPI number counters
- Scroll-based reveals
- Partner logo animations
- Section transitions

Do NOT mix multiple animation systems unnecessarily.

When using GSAP:

- Never break layout
- Never shift content unexpectedly
- Always test responsiveness
- Always clean up animations on unmount

---

## Animation Behavior

Allowed:

- fade + slight translate (8–12px)
- scale (1 → 1.05 max, except logos)
- opacity transitions
- stagger (80–120ms)

Avoid:

- large movement
- chaotic motion
- fast aggressive transitions

---

# Hero Section Rules

Hero must:

- Be vertically centered (NOT top aligned)
- Left-aligned content
- Strong but calm headline

Must include:

- Headline
- Supporting paragraph
- 2 CTAs
- KPI stats (GSAP count-up, smooth, trigger on load or scroll)

---

# Services Section Rules

Service cards must:

- Be rectangular (no rounded styles)
- Have clean spacing (p-10)
- Include: title, description, subtle CTA

Hover behavior:

- top border (2px blue)
- slight lift (-translate-y-1)
- shadow increase

CTA style: text-based, underline animation, arrow shift.

---

# Clients / Organizations Section

Logos must:

- ALWAYS be visible
- ALWAYS be full color

Never: grayscale by default, hide until hover, fade to invisible.

Hover: slight scale (1.04), subtle blue glow.

---

# Technology Partners (Scrolling Logos)

- Horizontal auto-scroll ONLY
- Logos must be large, equal size, fully visible
- Center logo zooms in (1.15–1.25) then zooms out smoothly, continuous loop
- Speed must be readable and smooth
- Never: vertical scrolling, tiny logos, grayscale logos

---

# Navigation (Mega Menu)

Services and Partners use full-width dropdowns, white background, rectangular layout.

- Services: list + context panel
- Partners: categories + logo grid

---

# Content & Messaging Rules

Avoid: "we sell software", "buy now", aggressive marketing language.

Use: "engineering solutions", "capability development", "partnership", "long-term value".

Tone: advisory, expert, institutional.

---

# Development Rules

- Do NOT create duplicate components — reuse shared ones
- Do NOT introduce new UI styles randomly
- Do NOT change layout structure unless required
- Do NOT add flashy animations
- Always preserve design consistency
- Mobile-first, no horizontal scroll, proper spacing across all breakpoints

---

# Coding Principles (Karpathy Skills)

Behavioral guidelines to reduce common LLM coding mistakes.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

# Learned Rules

<!-- Append new rules below -->

1. [UX] Logos must always be visible in full color — because hidden or grayscale logos reduce trust.
2. [MOTION] Avoid aggressive GSAP animations — because the site must feel executive and calm.
3. [DESIGN] Blue is the only accent color — because brand consistency is critical.

# CLAUDE.md

Read this entire file before starting any task.

This project is a **React + TypeScript + Vite frontend** for KITES (Kuwait Institute for Training & Engineering Simulations).

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

# Tech Stack

- React 18 + TypeScript + Vite (SWC)
- Tailwind CSS + shadcn/ui
- React Router v6
- GSAP (primary animation engine)
- Framer Motion (secondary use only if needed)
- @react-three/fiber + drei (hero visuals)
- TanStack Query
- react-helmet-async

---

# Commands

## Install dependencies
bun install

## Start dev server
bun run dev

## Build
bun run build

## Lint
bun run lint

## Preview build
bun run preview

---

# Architecture

Routes are defined in:

src/App.tsx

All pages use:

Layout (Header + Footer)

Pages include:

- Home
- Services
- Expertise
- Partners
- Events
- Contact
- Service detail pages (/services/:serviceId)

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

cubic-bezier(0.4, 0, 0.2, 1)

Never use:

- bounce
- elastic
- overshoot
- exaggerated scaling

---

## GSAP Rules (PRIMARY)

GSAP is the main animation engine.

Use GSAP for:

- Hero entrance
- KPI number counters
- Scroll-based reveals
- Partner logo animations
- Section transitions

Do NOT mix multiple animation systems unnecessarily.

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
- KPI stats

---

## Hero KPIs

Stats must:

- Animate using GSAP count-up
- Trigger on load or scroll
- Be smooth and readable

Never:

- jump instantly
- flicker
- animate aggressively

---

# Services Section Rules

Service cards must:

- Be rectangular (no rounded styles)
- Have clean spacing (p-10)
- Include:
  - title
  - description
  - subtle CTA

Hover behavior:

- top border (2px blue)
- slight lift (-translate-y-1)
- shadow increase

CTA style:

- text-based
- underline animation
- arrow shift

---

# Clients / Organizations Section

Logos must:

- ALWAYS be visible
- ALWAYS be full color

Never:

- grayscale by default
- hide until hover
- fade to invisible

Hover:

- slight scale (1.04)
- subtle blue glow

---

# Technology Partners (Scrolling Logos)

This section is HIGH IMPACT.

Rules:

- horizontal auto-scroll ONLY
- logos must be:
  - large
  - equal size
  - fully visible

Animation:

- center logo zooms in (1.15–1.25)
- then zooms out smoothly
- continuous loop

Speed:

- must be readable (not too slow)
- adjustable but smooth

Never:

- vertical scrolling
- tiny logos
- grayscale logos

---

# Navigation (Mega Menu)

Services and Partners must use:

- full-width dropdown
- white background
- rectangular layout

Structure:

Services:
- list + context panel

Partners:
- categories + logo grid

---

# Content & Messaging Rules

Avoid:

- "we sell software"
- "buy now"
- aggressive marketing language

Use:

- "engineering solutions"
- "capability development"
- "partnership"
- "long-term value"

Tone:

- advisory
- expert
- institutional

---

# UI Consistency Rules

- Do NOT create duplicate components
- Reuse shared components
- Maintain spacing consistency
- Maintain typography consistency

---

# Responsiveness Rules

- Mobile-first
- No horizontal scroll
- Clean stacking
- Proper spacing across all breakpoints

---

# GSAP Safety Rules

When using GSAP:

- Never break layout
- Never shift content unexpectedly
- Always test responsiveness
- Always clean up animations

---

# Debugging Rules

If animation breaks:

- check positioning
- check transform conflicts
- check container height
- check overflow issues

---

# Development Rules

- Do NOT introduce new UI styles randomly
- Do NOT change layout structure unless required
- Do NOT add flashy animations
- Always preserve design consistency

---

# Safe Refactoring Rules

- Do not break existing sections
- Do not remove working animations without reason
- Do not change core structure

---

# Learned Rules

<!-- Append new rules below -->

1. [UX] Logos must always be visible in full color — because hidden or grayscale logos reduce trust.
2. [MOTION] Avoid aggressive GSAP animations — because the site must feel executive and calm.
3. [DESIGN] Blue is the only accent color — because brand consistency is critical.
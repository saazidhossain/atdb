## Goal

Recreate https://atdb-seven.vercel.app/ inside this Lovable project by porting code from `saazidhossain/ATDB-before-launch` — a Vite + React Router + Tailwind v3 app — onto our TanStack Start + Tailwind v4 stack. End result: identical look, same pages, same content, same assets.

## Scope

All routes from the source repo:

- `/` — Home (Hero, BrandMarquee, LiveFleetPhotos, EquipmentCategories, FeaturedEquipment, ProjectHighlights, WhyATDB, StandardsStrip, CTASection)
- `/equipment` — Catalog with filters
- `/equipment/$id` — Equipment detail (galleries, specs, related)
- `/equipment/rollers`, `/equipment/cranes`, etc. — Category landing (handled inside Equipment route via param)
- `/projects` — Project highlights
- `/about` — About / certifications / team
- `/contact` — Contact info + WhatsApp CTAs
- 404

Shared chrome: Navbar (logo, nav, EN/বাংলা toggle, cart icon, WhatsApp + phone + email shortcuts, Get Quote CTA), Footer, floating WhatsApp FAB, ScrollProgress, error boundary.

## Approach

1. **Copy assets verbatim** from the cloned repo into our project:
   - `public/assets/**` (~80 webp/jpg images: hero, equipment, project, brand logos)
   - `public/equipment/**` (per-unit photo folders)
   - `public/videos/**`
   - `src/assets/*` (logos, certifications)

2. **Port data layer** (`src/data/equipment.ts`) as-is — this is the source of truth for all equipment.

3. **Port the i18n hook** (`src/hooks/useLang.tsx`) — provides `{ lang, setLang, t }` with EN/বাংলা strings and persists choice to localStorage. Wrap the app with its provider in `src/routes/__root.tsx`.

4. **Port components** (`Navbar`, `Footer`, `WhatsAppFAB`, `ScrollProgress`, `RevealOnScroll`, `SectionDivider`, `AnimatedLogo`, `BrandMarquee`, `HeroSection`, `HeroGallery`, `HeroMedia`, `LiveFleetPhotos`, `EquipmentCategories`, `FeaturedEquipment`, `ProjectHighlights`, `WhyATDB`, `StandardsStrip`, `CTASection`, `CartDrawer`, `useCart`).
   - Replace all `react-router-dom` imports (`Link`, `useNavigate`, `useParams`, `useLocation`) with the `@tanstack/react-router` equivalents.
   - Use TanStack params: `Route.useParams()` and typed `<Link to="/equipment/$id" params={{ id }}>`.

5. **Convert pages → TanStack route files** under `src/routes/`:
   - `index.tsx`, `equipment.tsx`, `equipment.$id.tsx`, `projects.tsx`, `about.tsx`, `contact.tsx`.
   - Each with its own `head()` (title, description, og tags) tailored per page; root sets defaults + favicon.

6. **Migrate styling from Tailwind v3 → v4**:
   - Translate the source `tailwind.config.ts` palette (orange brand, dark theme, custom font stack) and `src/index.css` tokens into our `src/styles.css` using oklch CSS variables under `@theme inline`.
   - Brand color: orange `#f97316`-family on dark backgrounds.
   - Add Google Fonts (Inter / Noto Sans Bengali) via `<link>` in `__root.tsx` head.
   - Drop `tailwind.config.ts` / `tailwindcss-animate` (already replaced by `tw-animate-css`).

7. **Install missing dependencies** the source uses and we don't yet have: `framer-motion`, `embla-carousel-react`, `next-themes`, `jspdf`, `jspdf-autotable`, `react-hook-form`, `@hookform/resolvers`, `zod`, `date-fns`, `recharts`, `cmdk`, `vaul`, `sonner`, `input-otp`, `react-day-picker`, `react-resizable-panels`, plus the Radix primitives not already in our shadcn set (`react-toast`, `react-slot` etc.). Most shadcn UI files we already have; add the few missing ones (`toast.tsx`, `toaster.tsx`, `use-toast.ts`).

8. **Skip / drop** items not relevant to a clone in this stack:
   - `playwright.config.ts`, `tests/`, `vitest.config.ts` (keep current test setup).
   - `src/App.tsx` / `src/main.tsx` / `index.html` (TanStack handles bootstrap).
   - `lovable-tagger`, `sharp` dev deps.
   - `HitboxDebug` (debug-only).

9. **Replace** the placeholder `src/routes/index.tsx`.

## Features confirmed

- EN / বাংলা language toggle in navbar (persisted, applies to all UI strings).
- WhatsApp quote buttons with prefilled message → `wa.me/8801712106242`.
- Cart/Quote drawer (shipped with the original; lets users collect equipment then export a PDF quote via `jspdf`). Worth keeping since the data layer assumes it — let me know if you'd rather strip it.
- No Lovable Cloud / database — purely static site like the original.

## File map (new files in our repo)

```text
src/
  routes/
    __root.tsx                    (updated: providers, Navbar, Footer, FAB, ScrollProgress)
    index.tsx                     (home, replaces placeholder)
    equipment.tsx
    equipment.$id.tsx
    projects.tsx
    about.tsx
    contact.tsx
  components/
    Navbar.tsx, Footer.tsx, WhatsAppFAB.tsx, ScrollProgress.tsx,
    RevealOnScroll.tsx, SectionDivider.tsx, AnimatedLogo.tsx,
    NavLink.tsx, CartDrawer.tsx, PagePreloader.tsx, SkeletonShimmer.tsx,
    ErrorBoundary.tsx,
    home/{BrandMarquee,CTASection,EquipmentCategories,FeaturedEquipment,
          HeroGallery,HeroMedia,HeroSection,LiveFleetPhotos,
          ProjectHighlights,StandardsStrip,WhyATDB}.tsx
  hooks/
    useLang.tsx, useCart.tsx
  data/
    equipment.ts
  lib/
    generatePDF.ts
  assets/
    atdb-logo-dark.webp, atdb-logo-light.webp, atdb-logo-mark.png,
    cert-1st-class.png, cert-cis.png, cert-iso-9001.png
public/
  assets/**         (full copy)
  equipment/**      (full copy)
  videos/**         (full copy)
styles.css           (extended with brand tokens, fonts, dark default)
```

## Risks / notes

- ~100 binary assets to copy — done in one batch.
- React Router → TanStack Router rewrite touches every file that navigates; mechanical but must be exhaustive for typecheck to pass.
- Original ships as dark theme by default — I'll set our `<html>` to `class="dark"` so colors match.
- `framer-motion` is heavy; the source uses it widely for hero animations and reveals — keeping it for parity.

Say the word and I'll build it.
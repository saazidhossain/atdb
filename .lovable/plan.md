
# Full Audit & Top 1% Production Quality Upgrade

## Phase 1: Critical Bug Fixes

### 1.1 Fix SSR Hydration Mismatch
The HeroMedia component uses `window.matchMedia` in `useState` initializer, causing server/client mismatch. The server renders `false` (no window), but the client may render `true` on mobile.

**Fix:** Default `isMobile` to `false` on both server and client initial render, then update in `useEffect` only. This eliminates the hydration error.

**Files:** `src/components/home/HeroMedia.tsx`

### 1.2 Fix SectionDivider SSR crash
`window.matchMedia` called at effect top-level without SSR guard.

**Fix:** Add `typeof window !== "undefined"` check.

**Files:** `src/components/SectionDivider.tsx`

### 1.3 Fix PagePreloader SSR safety
Direct `window` access in `useEffect` is fine, but `document.readyState` should be guarded.

**Files:** `src/components/PagePreloader.tsx` (minor)

---

## Phase 2: Animation & Transition Upgrade (Top 1%)

### 2.1 GPU-accelerated smooth scrolling
Replace CSS `scroll-behavior: smooth` with Lenis smooth scroll for buttery 120fps scrolling with momentum. This is the single biggest UX differentiator for premium sites.

**Files:** `src/pages/Index.tsx`, `src/styles.css`, install `lenis` package

### 2.2 Staggered reveal animations
Upgrade `RevealOnScroll` to support stagger delays for child elements (cards, grid items). Currently all children appear at once -- premium sites stagger them 50-80ms apart.

**Files:** `src/components/RevealOnScroll.tsx`

### 2.3 Enhanced page transitions
Add smooth cross-fade transitions between route changes using `framer-motion` `AnimatePresence` at the root layout level.

**Files:** `src/routes/__root.tsx`, create `src/components/PageTransition.tsx`

### 2.4 Magnetic hover effects on CTA buttons
Add subtle magnetic cursor-follow effect on primary CTA buttons (hero "Browse Equipment", "Get Quote") for premium desktop UX.

**Files:** Create `src/components/MagneticButton.tsx`, update `src/components/home/HeroSection.tsx`

### 2.5 Parallax depth on hero section
Add subtle parallax scroll effect on the hero background (moves slower than content) for cinematic depth.

**Files:** `src/components/home/HeroMedia.tsx`

### 2.6 Number counter animation
Hero stats (26+, 30+, 25, 2) should count up from 0 when scrolled into view.

**Files:** `src/components/home/HeroSection.tsx`

### 2.7 Smooth card hover with spring physics
Upgrade `card-tilt` and `glass-hover` from CSS transitions to spring-based transforms for more natural feel.

**Files:** `src/styles.css`

---

## Phase 3: UI/UX Polish

### 3.1 Navbar scroll animation refinement
- Add blur intensity increase on scroll
- Smooth logo size transition with cubic-bezier
- Active nav link indicator (animated underline, not just color)

**Files:** `src/components/Navbar.tsx`

### 3.2 Mobile menu upgrade
- Slide-in from right with backdrop blur (currently just drops down)
- Staggered link animations on open

**Files:** `src/components/Navbar.tsx`

### 3.3 Footer entrance animations
- Stagger footer columns on scroll-in
- Social icons with scale-up sequence

**Files:** `src/components/Footer.tsx`

### 3.4 Equipment card hover state
- Image zoom with slight rotate for 3D feel
- Gradient overlay shift on hover
- Action buttons slide up on hover (hidden by default on desktop)

**Files:** `src/pages/Equipment.tsx`

### 3.5 Gallery carousel upgrade
- Add smooth Ken Burns effect per slide
- Crossfade with scale transition (not just opacity)
- Progress bar under dots showing auto-advance timing

**Files:** `src/components/home/HeroGallery.tsx`

### 3.6 Loading skeleton shimmer upgrade
- More refined shimmer gradient (triple-color)
- Match actual content layout shapes

**Files:** `src/components/SkeletonShimmer.tsx`

---

## Phase 4: Performance & Quality

### 4.1 Scroll event optimization
- ScrollProgress uses raw scroll listener -- switch to `requestAnimationFrame` throttle
- Navbar scroll detection should use same RAF approach

**Files:** `src/components/ScrollProgress.tsx`, `src/components/Navbar.tsx`

### 4.2 Image loading optimization
- Add `fetchPriority="high"` on hero/above-fold images
- Ensure all below-fold images use `loading="lazy"` and `decoding="async"`
- Equipment detail gallery: preload next thumbnail

**Files:** Multiple components

### 4.3 Reduce layout shifts
- Set explicit `width`/`height` or `aspect-ratio` on all images
- Equipment cards: fixed height for text area

**Files:** Multiple components

---

## Phase 5: Link & Navigation Audit

### 5.1 Verify all internal links
- Home nav links (/, /equipment, /projects, /about, /contact)
- Equipment category links (/equipment/{slug})
- Equipment detail links (/equipment/{category}/{id})
- Footer links
- Breadcrumb navigation on detail pages

### 5.2 Verify all external links
- WhatsApp links (fab, cards, detail, cart checkout)
- Phone links (tel:)
- Email links (mailto:)
- Facebook link
- Behance credit link

### 5.3 Active state verification
- Navbar active link highlighting
- Equipment filter active states
- Gallery dot indicators

---

## Phase 6: Language Toggle Audit

### 6.1 Verify bilingual strings
- Every `t("EN", "BN")` call has both strings
- Bengali font (Hind Siliguri) loads and applies correctly
- `html.lang-bn` class toggles
- Language persists on reload (localStorage)
- All pages render correctly in both languages

### 6.2 Fix potential issues
- Equipment detail: breadcrumb category labels should be bilingual
- Cart drawer: all validation messages are bilingual (already done)
- QA page: hardcoded English strings (acceptable -- internal tool)

---

## Phase 7: Responsive Layout Audit

### 7.1 Mobile (390px viewport -- current user viewport)
- Navbar hamburger + mobile menu
- Hero text sizing and padding
- Equipment cards single column
- Footer stacking
- WhatsApp FAB positioning
- Cart drawer full-width

### 7.2 Tablet (768-1024px)
- Grid transitions (2-col layouts)
- Gallery aspect ratio
- Filter bar layout

### 7.3 Desktop (1280px+)
- Full grid layouts (3-4 columns)
- Hover effects active
- Video autoplay

---

## Technical Details

### New dependencies
- `lenis` -- smooth scroll library (lightweight, GPU-accelerated)

### Files created
- `src/components/PageTransition.tsx` -- route transition wrapper
- `src/components/MagneticButton.tsx` -- magnetic hover CTA
- `src/components/CountUp.tsx` -- animated number counter

### Files modified (major)
- `src/components/home/HeroMedia.tsx` -- hydration fix + parallax
- `src/components/home/HeroSection.tsx` -- magnetic buttons + counter
- `src/components/home/HeroGallery.tsx` -- Ken Burns + progress bar
- `src/components/RevealOnScroll.tsx` -- stagger support
- `src/components/Navbar.tsx` -- enhanced scroll + mobile menu
- `src/components/ScrollProgress.tsx` -- RAF optimization
- `src/styles.css` -- spring physics, new animations
- `src/routes/__root.tsx` -- page transitions
- `src/pages/Equipment.tsx` -- card hover polish
- `src/components/SectionDivider.tsx` -- SSR fix

### Estimated scope
~15-18 file changes, 3 new components, 1 new package. All changes are frontend-only -- no backend or data changes.

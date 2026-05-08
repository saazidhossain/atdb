## 0. Findings from re-audit

I re-cloned `saazidhossain/ATDB-before-launch`, parsed your `Product_Inventory_Master_List.pdf`, and diffed everything against the live project.

### A. Inventory mismatches vs master list (CRITICAL — data correctness)

The current `src/data/equipment.ts` contains many fabricated / wrong entries that do not match your master list. These must be fixed before handover.

**Cranes (master = 7)**
- `CR-004`: master = **Kato KR-35H-III, 35T, 2012**. Current shows "Kato KR-25H-V (Unit A), 25T, 2000". Wrong.
- `CR-005`: master = **Kato KR-25H-V7, 25T, 2017**. Current shows "KR-25H-V (Unit B), 25T, 2002". Wrong year/variant.
- `CR-007`: master = **Kato KR-10H, 10T, 2002**. Current shows "Kato KR-100 Lattice Boom, 10T, 1995". Wrong model.
- CR-001/002/003/006: OK (minor field polish).

**Road Rollers (master = 9)**
- `RR-003`: master = **Dynapac HP89042ST, 10T, 1 Drum + 2 Tier Wheel, Sweden, 2013**. Current shows "Advance 3-Wheel, 8T, India". Completely wrong unit.
- `RR-005`: origin should be **Japan** (current says Germany).
- `RR-006`: master = **Hawa JV-40-CW1, 4/6T, Vibration, Japan, 2013**. Current shows "Hawa Tandem, 2T, India, 2018". Wrong.
- `RR-007`: master = **Advance, 8.5T, 3-Wheel Steel, 2015**. Current shows "CAT CS54, 5T, Vibratory Soil". Wrong unit (CAT CS54 doesn't exist in master — must be removed).
- `RR-009`: master = **Sakai 920, 3.5/5T, Drum Steel Vibration, 2014**. Current shows "Sakai SV902 (Unit B), 10T, 2012". Wrong (duplicate of RR-001 image).

**Excavators & Heavy Machinery (master = 3 under EX prefix)**
- `EX-001`: master = **CAT CAT11020 Soil Compactor, 12/18T, 2014**. Current shows "Komatsu PC40 Mini Excavator". Swapped.
- `EX-002`: OK (CAT 320BU).
- `EX-003`: master = **Komatsu PC40, 2017**. Current shows "CAT Plate Compactor, 200 kg". Wrong (and CAT plate compactor isn't in master).

**Loaders (master = 3)**
- `LD-002`: master model = **XCMG KMC 950 Pay Loader, 2017**. Current shows "XCMG Wheel Loader, 3T, 2020". Model/year wrong.
- `LD-003`: master = **JCB JC 0.6 Backhoe Loader, 2014, India**. Current shows "JCB Backhoe, UK, 2015". Origin/year wrong.

**Support Equipment (master = 9 line items, ~21 units)**
The current SP-001..SP-009 list is largely fabricated (Honda GX160 vibrator, Robin EY20, Welding machine, Bar bending machine, etc.) and does NOT match your master list. Must be replaced with the actual master list:
1. Honda GQR-350 Cutting Machine (2 units, 2021)
2. Honda HSP-500C Cutting Machine (2 units, 2020)
3. Honda HZR-90 Plate Compactor (2 units)
4. Honda 80k-100 Sand Compactor (2 units) — already present as SP-004 ✓
5. Honda ER2500CX Generator (3 units) — present as SP-005 (qty wrong, "01" → "03")
6. Zhejiang BS-8000WT Generator (1 unit)
7. Honda 700 RPM Asphalt Core Cutter
8. Honda GXCR200ST Big Drill Hammer (5 units)
9. TATA T7 Ultra Drum Truck (2 units) — currently mis-labelled as "TATA LPT 1613"

### B. Image-to-product mapping issues
- Many items reuse `/assets/support-tools-Dnowl7z-.webp` or `/assets/sakai-sv900-CJzZY7Ph.webp` regardless of model — wrong product photos showing on wrong products.
- Real-photo folders that exist on disk (verified): `CR-002, EX-002, LD-001, RR-004, RR-005, RR-008, SP-004, SP-005`. Only these IDs should declare `realPhotos`. Any other entry referencing real photos that don't exist will 404 — must be cleaned.
- Items with no brand-specific mockup must fall back to a category placeholder (cranes / rollers / excavators / loaders / support), not to an unrelated unit.

### C. UI / UX issues spotted
- Equipment category index counts are stale strings ("9 units", "7 units" etc.) and will lie once we fix the data. Should compute from `equipmentData` at runtime.
- `/equipment` landing page shows 5 categories but layout is `md:grid-cols-2` → an awkward orphan card on the last row. Should be `lg:grid-cols-3`.
- Navbar / hero / cards sometimes overflow at 360–414 px — Bengali strings wrap badly because `font-display` lacks Bengali glyphs (need `font-bengali` swap when `lang === "bn"`).
- WhatsApp FAB and Cart drawer can overlap the sticky footer CTA on mobile.
- Equipment detail "related" section can show duplicates and the same image repeated.
- Spec-sheet PDF (`generatePDF.ts`) prints labels in English only and skips Bengali rows; needs an `lang`-aware variant + ATDB header/logo + correct unit counts.
- No `<title>` / meta differentiation on `equipment.$category.index` and `equipment.$category.$id` routes.
- No 404 component on the root route.
- Images missing `width`/`height` (CLS), `loading="lazy"` on below-fold, and `decoding="async"`.
- Hero gallery autoplays a video without `playsinline` + `muted` + reduced-motion guard.

### D. Production-readiness gaps
- No `robots.txt` sitemap entry, no `sitemap.xml`.
- No JSON-LD (`Organization`, `Product` per equipment, `BreadcrumbList`).
- No Open Graph image per route (uses generic).
- No analytics opt-in (consent-respecting).
- No error boundary at route level (only global).
- ESLint + Prettier formatting drift across ported files.
- Dead/duplicate logo files in `public/assets` (`atdb-logo-dark.webp` AND `atdb-logo-dark-CMkcsUAi.webp`).
- No favicons beyond `favicon.ico` (no `apple-touch-icon`, no PNG sizes, no `manifest.webmanifest`).

---

## 1. Plan — Phase by phase

### Phase 1 — Data correctness (highest priority)
1. Rewrite `src/data/equipment.ts` so every item matches the master list 1:1 (IDs, brand, model, capacity, year, origin, fuel, quantity, notes). No fabricated SKUs. Quantities match master ("01", "02", "03", "05" for HZR/GQR/HSP/ER2500CX/GXCR200ST etc.).
2. Replace the fabricated Support items SP-001..SP-009 with the 9 real master entries. Renumber so each line item gets one ID; keep `quantity` field for multi-unit lines (e.g. `"02"` for cutters).
3. Map every product to the correct image:
   - Use brand/model-specific mockup when one exists in `/public/assets`.
   - Otherwise fall back to a category hero (`/assets/eq-crane-liebherr-…`, `/assets/eq-roller-sakai-…`, `/assets/eq-excavator-cat-…`, `/assets/loader-detail-…`, `/assets/eq-support-…`).
   - Strip `realPhotos` from any item whose folder doesn't exist; keep them only for `CR-002, EX-002, LD-001, RR-004, RR-005, RR-008, SP-004, SP-005`.
4. Compute `equipmentCategories[*].units` and `range` at runtime from the data — no more hardcoded counts.
5. Add a tiny dev-only assertion (`if (import.meta.env.DEV) validateEquipment()`) that warns on duplicate IDs, missing images, or broken `realPhotos`.

### Phase 2 — Guided smoke-test checklist page
New route `/qa` (hidden from nav, indexable=`noindex`) — a one-page checklist for you to walk through before handover. It includes:
- Live deep-links to: Home, every Equipment category, 2–3 Equipment detail pages (one with real photos + video, one mockup-only), Projects, About, Contact.
- Inline checks: "Toggle EN/বাংলা — does this string change?", "Click WhatsApp FAB → opens wa.me with prefilled message", "Click Quote on WhatsApp on a card", "Click Download PDF — opens spec sheet", "Add to cart → drawer opens → WhatsApp checkout link contains the item".
- Each row has a checkbox (state stored in localStorage) and a "Test now" button that opens the target route in a new tab.
- A summary bar showing X/Y checks complete, plus an "Export report" button (downloads a JSON of pass/fail with timestamps).

### Phase 3 — UI/UX polish (no content/feature change)
- Switch Bengali text to `font-bengali` (Hind Siliguri / Noto Sans Bengali) automatically when `lang === "bn"` via a `lang` attribute and CSS `:lang(bn)` selector. Fix wrap/overflow on small screens with `text-balance` and consistent `min-w-0`.
- `/equipment` landing grid → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` and ensure the last row balances (`auto-rows-fr`, equal heights).
- Equipment cards: consistent aspect ratio, brand chip top-left, unit-count badge for multi-quantity items, lazy-load all below-fold images, add `width`/`height` to prevent CLS.
- Equipment detail: image gallery with thumbnails + keyboard nav + Esc-to-close lightbox; spec table rendered with semantic `<dl>`; related-items strip excludes self and dedupes.
- Navbar: collapse correctly at 414 px; cart count badge placement; visible focus rings; sticky behavior with backdrop blur.
- Hero: respect `prefers-reduced-motion`; ensure hero `<video>` has `muted`, `playsinline`, `preload="metadata"`, `poster=`; provide an LCP-friendly poster image.
- Footer: align columns at all breakpoints; add NAP (Name/Address/Phone) consistent with Contact page; clickable `tel:` and `mailto:` links.
- WhatsApp FAB: lift above sticky bars, add tooltip, respect safe-area-inset on iOS.
- Cart drawer: empty state, Clear-all confirm, locale-aware date inputs.

### Phase 4 — Spec-sheet PDF upgrade
- Add ATDB logo + brand bar + "Quotation request" footer with WhatsApp/phone/email.
- Render Bengali rows when `lang === "bn"` using a Bengali-capable font embedded in jsPDF (`Hind Siliguri` woff → ttf via base64).
- Include all spec rows (ID, brand, model, capacity, year, origin, fuel, quantity, notes) and an embedded thumbnail.
- File name pattern: `ATDB-<id>-spec.pdf`.

### Phase 5 — SEO, performance, accessibility, a11y
- Per-route `head()` with unique `<title>` (≤60 chars, includes "ATDB"), description (≤160 chars), `og:title`, `og:description`, `og:image` (route-specific), `twitter:card`.
- JSON-LD: `Organization` on root, `Product` on each equipment detail (`name`, `brand`, `category`, `image`), `BreadcrumbList` on category + detail, `LocalBusiness` on Contact.
- `sitemap.xml` (statically generated from routes + equipment ids) and `robots.txt` linking to it.
- Canonical tags on every route.
- Lighthouse pass: image dimensions, `font-display: swap`, code-split route bundles, drop unused Radix primitives.
- a11y: skip-to-content link, `aria-label` on icon-only buttons (some are missing), color-contrast pass on orange-on-dark CTAs, keyboard nav for cart drawer + lightbox, `prefers-reduced-motion` for framer-motion animations.

### Phase 6 — Production hardening
- Add favicons set: `apple-touch-icon-180.png`, `icon-192.png`, `icon-512.png`, `manifest.webmanifest` (PWA-installable).
- Clean duplicate assets (`atdb-logo-dark.webp` vs `…CMkcsUAi.webp`) and unused files.
- Add an `ErrorBoundary` per top-level route segment.
- Add `noindex` on `/qa`.
- Run lint + typecheck + format and commit a clean baseline.
- Final visual smoke walk on mobile (375 × 812) + tablet (768) + desktop (1440).

---

## 2. Out of scope (per your instruction "do not change core features or data")
- I will NOT change the brand voice, project list, "Why ATDB" copy, or the WhatsApp number `+8801712106242`.
- I will NOT add a backend, contact-form submission, or auth — staying static.
- I will NOT alter the orange/dark theme — only refine spacing and Bengali type.

---

## 3. Two questions before I start

1. **Support-equipment SKU scheme** — your master list groups support equipment by *type* (e.g. "Honda GQR-350 cutting machines, 2 units"). Should I keep one ID per *line item* with `quantity: "02"` (cleaner; matches PDF), or split into one ID per *physical unit* (`SP-CUT-001A`, `SP-CUT-001B`)?
2. **Removing fabricated entries** — items like "Robin EY20 Generator", "Lincoln Welding Machine", "Bar Bending Machine", "Honda GX160 Vibrator", "CAT CS54", "CAT Plate Compactor" are NOT in your master list. Confirm I should **remove** them entirely (not just rename).

Once you approve and answer the two questions, I'll execute Phases 1 → 6 in one continuous pass and hand back a verified, tonight-ready build.

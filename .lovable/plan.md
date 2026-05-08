## ATDB Trade — Full Website Audit Report

আমি live preview-এ আপনার সাইটটি (mobile 390×844) reproduce করে এবং পুরো codebase scan করে নিচের issue-গুলো খুঁজে পেয়েছি। সবচেয়ে গুরুত্বপূর্ণ থেকে শুরু করে নিচে সাজানো হলো।

---

### 🔴 P0 — Blocking bugs (এখনই ঠিক করতে হবে)

**1. Mobile hamburger menu খুলছে না** ✅ reproduced

- File: `src/components/Navbar.tsx:41`
- Cause: `useEffect(() => { setIsOpen(false); }, [location])` — কিন্তু `useLocation()` shim (`src/lib/router-compat.tsx:68`) প্রতি render-এ নতুন object return করে। তাই dependency array কখনোই stable না, effect প্রতি render-এ চলে এবং menu খোলার সাথে সাথেই বন্ধ করে দেয়।
- Fix: dependency `[location.pathname]` করতে হবে।

**2. Hero section-এর fade-in animation চোখে পড়ে না**

- File: `src/components/PagePreloader.tsx`
- Cause: Preloader overlay 1.2s পর্যন্ত (worst-case 6s) screen cover করে থাকে। Hero-এর `animate-fade-in` 200/400/600/800ms delay-এ চলে — মানে preloader fade হবার আগেই animation শেষ, user শুধু static screen দেখে।
- Fix: preloader কে minimal "first-paint only" mode-এ আনতে হবে (overlay ৩০০ms-এ hide), অথবা hero animation কে `atdb:preloader-exit` event-এর পরে trigger করতে হবে।

**3. React DOM warning: `fetchpriority` lowercase** ✅ console-এ দেখা গেছে

- Files: `src/components/home/HeroMedia.tsx:169`, `src/routes/__root.tsx:112,120`
- React 19-এ camelCase `fetchPriority` দরকার। ছোট bug কিন্তু prod warning + future-incompat।

---

### 🟠 P1 — Performance (ছবি load slow, scroll jank)

**4. ছবিগুলোয় explicit `width`/`height` নেই**

- Affected: `Projects.tsx`, `EquipmentDetail.tsx`, `Equipment.tsx`, `ProjectHighlights.tsx`, `LiveFleetPhotos.tsx`, `FeaturedEquipment.tsx`, `HeroGallery.tsx` — সবগুলো `<img>` শুধু `loading="lazy"` দিয়ে।
- Impact: Cumulative Layout Shift (CLS) — page jump করে, browser image size জানে না বলে reservation করতে পারে না।
- Fix: প্রতিটা `<img>`-এ `width` + `height` অথবা `aspect-ratio` wrapper।

**5. ছবির format/responsive variants নেই**

- হিরোতে webp + sm/lg variants আছে, বাকি pages-এ raw imports। AVIF/WebP `<picture>` + `srcset` দরকার।
- `@/assets/...` import হলে Vite optimize করে, কিন্তু runtime `src` strings (e.g. project images) optimize হয় না।

**6. Lenis smooth-scroll + parallax mobile-এ jank তৈরি করে**

- `src/pages/Index.tsx:24` — Lenis `touchMultiplier: 1.5` mobile-এও on।
- `HeroMedia.tsx` parallax scroll listener প্রতি hero-visible scroll-এ `setState` করে → React re-render।
- Fix: Lenis কে desktop-only গেট করতে হবে (`window.matchMedia("(pointer: coarse)").matches` হলে skip)। Parallax মোবাইলে disable।

**7. PagePreloader 6s hard cap + 2.6s arbitrary CountUp wait**

- `__APP_READY__` flag e2e-এর জন্য, কিন্তু এর জন্যই overlay বেশিক্ষণ থাকে। দুটো timeline আলাদা করা আছে — তবু পুরো logic অপ্রয়োজনীয়ভাবে complex।

---

### 🟡 P2 — Architecture / DX

**8. router-compat shim সব hook-এ unstable references দেয়**

- `useLocation` প্রতি call-এ নতুন object — শুধু hamburger নয়, যে কোনো `useEffect([location])` ভাঙবে। Same risk: `useNavigate`।
- Fix: shim-এ `useMemo` দিয়ে stable object।

**9. Layered effects overload**

- `SkeletonShimmer` + `PagePreloader` + `ScrollProgress` + `RevealOnScroll` (প্রতি section-এ IO) + Lenis + Parallax scroll + CountUp IO + HeroMedia IO — সব একসাথে mount। প্রতিটা নিজে light, কিন্তু সব মিলে mobile-এ first-interaction-delay বাড়ে।

**10. RevealOnScroll-এর initial opacity:0**

- SSR/no-JS অবস্থায় content invisible (search engine ও crawler-এ ঠিক আছে কারণ JS hydrate হয়, কিন্তু slow connection-এ কয়েক সেকেন্ড blank lookup)।
- Fix: `prefers-reduced-motion` এর মতো একটা "above-the-fold" exemption।

**11. Console-এ `RESET_BLANK_CHECK` warning** — Lovable harness-এর; ignore করা যায়।

---

### 🟢 P3 — Polish / SEO / a11y

**12. Hamburger button-এ `aria-label`, `aria-expanded`, `aria-controls` নেই**

- Mobile language toggle button-এও label missing।

**13. CartButton + Cart toggle-এ same focus-ring style নেই** — keyboard nav inconsistent।

**14. `<a>` tags দিয়ে external (Facebook, mail, tel) — ঠিক আছে, কিন্তু WhatsApp FAB-ও focus-trap-free।**

**15. SEO**: পরের audit pass-এ — প্রতিটা route-এ unique og:image (এখন root-এ default থাকলে children override হয় না)।

---

## কী implement করতে চাইছি (পরবর্তী step)

আমি **P0 + P1-এর critical অংশ** এক pass-এ ঠিক করব:

1. `Navbar.tsx` — hamburger বাগ ফিক্স (location.pathname dependency) + a11y attrs।
2. `router-compat.tsx` — `useLocation` কে memoize করে stable reference।
3. `PagePreloader.tsx` — overlay quick-hide (300ms), `__APP_READY__` flag আলাদা থাকবে কিন্তু overlay block করবে না।
4. `HeroMedia.tsx` + `__root.tsx` — `fetchpriority` → `fetchPriority`।
5. `Index.tsx` — Lenis কে coarse-pointer/mobile-এ disable।
6. `HeroMedia.tsx` — parallax mobile-এ skip।
7. ৬-৮টা গুরুত্বপূর্ণ `<img>`-এ `width`/`height` যোগ (ProjectHighlights, FeaturedEquipment, LiveFleetPhotos, HeroGallery, Equipment listings)।

বাকি P2/P3 items পরবর্তী pass-এ — single message-এ সব করলে regression risk বাড়ে।

### Technical detail (developers-এর জন্য)

```text
Navbar.tsx
- useEffect(()=>setIsOpen(false), [location])           // ❌ fires every render
+ useEffect(()=>setIsOpen(false), [location.pathname])  // ✅

router-compat.tsx
- return { pathname, search, hash, state, key }                       // new ref each call
+ return useMemo(()=>({pathname,search,hash,state,key}), [...deps])   // stable

HeroMedia.tsx / __root.tsx
- fetchpriority="high"   →   fetchPriority="high"

Index.tsx (Lenis gate)
- if (reduce) return;
+ if (reduce || matchMedia("(pointer: coarse)").matches) return;

PagePreloader.tsx
- uxSafety = setTimeout(fadeOverlay, 1200)
+ uxSafety = setTimeout(fadeOverlay, 300)   // overlay only covers first paint
```

আপনি plan approve করলে আমি এই ৭টা fix একসাথে apply করে preview-এ verify করব।

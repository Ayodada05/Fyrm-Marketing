# CLAUDE.md

Read this before changing anything. It explains what Fyrm is, how the site is organized, the design language, and the performance rules. Follow it even for one-line edits.

This file is a living document. If your change is major, updating this file is part of the change (see section 7). Do not finish a major task with a stale CLAUDE.md.

**Verify before you present. Precision over speed.** A change isn't done until you've confirmed it actually does what it should. For UI work this means rendering the page and looking at (or measuring) the result, not just confirming the code reads correctly. Checking that markup/CSS exists is not the same as checking it renders right. When in doubt, render it, measure it, test it.

## 1. What Fyrm is

Fyrm incorporates Canadian businesses and keeps them compliant automatically: name search, incorporation, minute book, government filings, and deadline tracking from one dashboard. Filed with Corporations Canada and all 13 provincial & territorial registries.

The identity: federal blue and red, geometric type, the lowercase "fyrm." wordmark, and the goose mascot with its dashed flight-path motif. The tone is confident and unbusy — paperwork is our problem, not the founder's.

**This repo is the marketing site only.** It is static. The authenticated product will live at app.<domain>, built from a separate private repo. This repo will link into the app but never contain any of its code (see section 5.5). The domain is not yet decided; see the pending list in section 3.

## 2. Hard rules (never break these)

1. Canada only. We file with Corporations Canada and the 13 provincial & territorial registries. Never present US incorporation (Delaware, LLCs, etc.) as our service.
2. **No price exists.** The pricing page, tiers, subscription model, and government-fee amounts are all undecided. Never invent a price, discount, percentage, or fee number — ask the user. (Deliberate divergence from Ownd's "exactly one price" rule; compliance is likely recurring.)
3. The only stat that exists: **"Trusted by 600+ Canadian businesses."** No reviews, star ratings, savings figures, or testimonials exist. Never invent any.
4. Canonical claims, approved for verbatim reuse: "never miss a filing again"; "Filed with Corporations Canada and all 13 provincial & territorial registries"; "Most founders finish in about twenty minutes and are incorporated within a day."
5. Legal entity: Fyrm Technologies Inc. Every page's footer keeps: "Not a law firm; Fyrm does not provide legal advice."
6. "Fyrm" is capitalized in prose. The few all-caps FYRM instances in index.html are deliberate emphasis — leave them, add no more. The lowercase wordmark only appears via the logo image.
7. Em dashes are part of Fyrm's voice (a deliberate divergence from Ownd). The existing index.html copy is approved as-is, including "about twenty minutes / within a day".

## 3. File map and organization

```
/
├── index.html            Homepage (hero, why-us, trust band, businesses marquee, footer)
├── css/styles.css        THE design system, shared by all pages. CANONICAL here; the future app
│                         repo will carry a synced copy (see 5.5 before renaming/removing anything).
├── js/main.js            Shared: .js gate, reveal animation, mobile nav, marquee. Dependency-free
│                         strict-mode IIFE, loaded from <head> with defer.
├── assets/               fyrm-logo.png (866x288, header + footer), goose-user.png (hero flight-path
│                         goose), goose-why.png (why-badge goose), fyrm-biz-*.webp + fyrm-client-1.webp
│                         (marquee photos), favicon.svg/.ico, favicon-32.png, apple-touch-icon.png
│                         (white goose on --blue square). Logo + favicons sync to the app repo (5.5).
├── serve.json            Local dev server config only, never deployed
├── scripts/build-deploy.sh   Assembles the dist/marketing deploy payload (run locally or via CI)
├── .github/workflows/    deploy.yml (push to main → deploy/marketing branch; the host clones it,
│                         never edit by hand) · health-check.yml (hourly watchdog for the LIVE site;
│                         its cron ships commented out — uncomment it and set DOMAIN at go-live)
├── .gitignore            macOS junk (.DS_Store, ._*) and dist/
└── CLAUDE.md             This file
```

Organization rules:

- Shared components live in `css/styles.css` and nowhere else. Page CSS never redefines a shared class and never introduces a new color.
- Every page uses the same canonical header and a byte-identical footer. One `<h1>` per page. Each page's content sits in a wrapper with a page id (`#fyrm-home` pattern).
- JS hooks are data-attributes (`data-nav-toggle`, `data-nav-panel`, `data-marquee`, `data-marquee-track`), never classes or ids — with one designed exception: the reveal system is class-based (`.reveal`/`.shown` + the `.js` gate on `<html>`). `data-underline` and `data-desktop-nav` are CSS-only attribute hooks. Style classes are flat kebab-case with a component prefix (`hero-`, `why-`, `mq-`, `footer-`, `dd-`, `btn-`).
- The app will be a SEPARATE ORIGIN AND REPO, linked only via absolute URLs. No app code, SDK, API key, or fetch-on-load ever enters this repo.

Link inventory (current dangling state — resolve as pages/sections ship, never silently):

- Resolving anchor: `#what-is-fyrm` (why-us section).
- Dangling bare anchors, no target yet: `#process`, `#pricing` (desktop + mobile-panel Pricing links, Sign in, the nav CTA, hero CTA, why CTA — 6 total), `#partners`, `#platform` (footer ×3), `#faq` (footer ×2). When the header/footer are cloned to subpages, bare anchors must become `index.html#…`.
- `href="#"` placeholders: Blog + Contact us (dropdown and mobile panel), the marquee CTA, footer About/Careers/Press/Contact and Terms/Privacy/PIPEDA/Security.
- Links to pages that don't exist yet: `how-it-works.html` (hero CTA, footer ×2), `pricing.html` (footer ×2).

Pending decisions (blocked on the user — do not guess): domain; hosting target; GitHub repo names; pricing model; the page roster (how-it-works, pricing, partners, about, blog, contact, legal set); whether footer "English · Français" is a real bilingual commitment.

## 4. Design language

### 4.1 Color

All colors are CSS custom properties in `:root` of styles.css. Never write a new hex value.

| Token | Value | Use |
|---|---|---|
| `--blue` | #003CA8 | Primary buttons, links accents, the `.hl-canadian` highlight, active states. |
| `--blue-dark` | #002f86 | Blue button hover. |
| `--red` | #D81824 | The red CTA button, accent words, the highlight text color. |
| `--red-dark` | #b31220 | Red button hover. |
| `--ink` | #0F1116 | Headings and primary text. |
| `--bg` | #F4F7FB | Page background, text on dark/colored surfaces. |
| `--surface` | #FFFFFF | Cards, the dropdown, the why-badge. |
| `--footer-bg` | #0B0E15 | The footer. Nothing else is this color. |
| `--path` | #a3add9 | The dashed flight-path motif only. |
| `--ink-aNN` / `--bg-aNN` | rgba scales | `--ink`/`--bg` at NN% opacity (a02–a82). Reuse a step; add a step only if no neighbor fits. |
| `--shadow-btn-nav/-hero/-cta/-red` | colored shadows | The heavy colored button shadows. Part of the look, never soften. |
| `--ease` | cubic-bezier(.22,1,.36,1) | Every transition on the site (one blessed exception, see 4.6). |

Blessed quirks, leave them alone: the one-off blue-tinted decorations still written literally (why-badge border/shadow, why-card hover shadow/border, dropdown hover tint, the dropdown's ink shadow); the marquee tile sizes inline in the HTML; the `.hl-squiggle`/`.hl-goose` magic offsets (361/801/-92/-134px), tuned to the headline's line break. They are part of the approved look. Do not "fix" them.

### 4.2 Typography

- Display: **Poppins** 500/600/700 — headings, nav, buttons. Headings use 600; nav links and micro-badges 700.
- Body: **Hanken Grotesk** 400–700; the body default is weight 500.
- Micro-labels only: **IBM Plex Mono** 400/500 (`.why-num`, `.footer-heading` — letterspaced tiny caps).
- Google Fonts with `preconnect` and `display=swap` (already set). No new families or weights.
- Scale comes from clamp(), already defined: hero h1 `clamp(2.9rem, 6.3vw, 5rem)`, section h2 `clamp(1.9rem, 3.6vw, 2.8rem)`, trust h2 `clamp(1.6rem, 3.2vw, 2.4rem)`. Heading letter-spacing -.015em (hero) / -.01em (sections). Reuse existing classes instead of inventing sizes.

### 4.3 Layout and spacing

- Container: max-width 1220px, `clamp(20px, 5vw, 40px)` side padding (`.section-inner`, `.header-inner`, `.hero-inner`, `.footer-inner`).
- Sections: `clamp(56px, 7vw, 96px)` vertical padding; the trust band and marquee run tighter.
- Radius: cards 12px, marquee tiles 10px, the why-badge pill 999px. **Buttons are sharp-cornered — no border-radius, ever.**
- Breakpoints in use: 880/881px (nav collapse) and 1100px (squiggle + goose appear) — the only media queries besides reduced-motion. Grids stack fluidly via `auto-fit`/`minmax`, not breakpoints.

### 4.4 Components and distinctive elements (reuse these; never "optimize away")

| Element | Classes / hooks | Notes |
|---|---|---|
| Buttons | `.btn` + `.btn-blue`/`.btn-red`/`.btn-ghost`, sizes `.btn-nav`/`.btn-hero`/`.btn-marquee`, `.btn-lift` | Sharp corners, heavy colored drop shadows (`--shadow-btn-*`). |
| Keyword highlight | `.hl-canadian` | Red text on `--blue` block, `box-decoration-break: clone`. |
| Flight path | `.hero-sweep`, `.hl-squiggle` + `.hl-goose` | Dashed `--path` stroke 2.2, dasharray 6 8, `vector-effect="non-scaling-stroke"`, ends at the goose. The sweep renders at all widths; the squiggle + goose only ≥1100px. |
| Link underline | `[data-underline]` | Gradient grows 0%→100% on hover, 1.5px `--blue`. |
| Why card | `.why-card` > `.why-bar` + body | Top bar 36px→100% on hover; card lifts 6px. |
| Why badge | `.why-badge` | White pill, goose overlapping the label. |
| Nav dropdown | `.dd` family, `data-dd` | Pure CSS hover/focus-within. |
| Mobile nav | `.nav-panel`, `data-nav-toggle` | Toggled by main.js below 880px. |
| Marquee | `.marquee` family, `data-marquee(-track)` | rAF auto-scroll 0.6px/frame, drag-to-scroll, 2500ms pause after interaction, reduced-motion aware, track duplicated once by main.js for the seamless loop. |
| Trust band | `.trust` | The one stat + supporting line, Poppins 600 blue. |

### 4.5 Iconography

Inline SVG only, `fill="none" stroke="currentColor"`, stroke-width 1.4–1.8, simple geometry, small viewBoxes as authored (12/15/16/18). One blessed exception: the hero-note shield keeps a literal `stroke="#003CA8"` because its icon is deliberately bluer than its muted text. No icon fonts, no libraries, no emoji in UI. Reuse existing icons when the meaning matches (arrow, shield, chevron, hamburger).

### 4.6 Motion

- Scroll reveal: `class="reveal"` (+ optional `style="--d:.16s"` stagger). main.js stamps `.js` on `<html>` as its first statement; CSS hides `.reveal` only under `.js`, so everything renders if JS is off, blocked, or broken. **Never gate above-the-fold content, especially the h1, on JS any other way.**
- Reveals: opacity + 24px rise, .95s `--ease`. Hovers: buttons lift 2px (`.btn-lift`), why-cards 6px. Every transition uses `--ease` (one blessed exception: `.why-card`'s border-color fade uses plain `ease`).
- `prefers-reduced-motion`: reveals render instantly, marquee auto-scroll stops (drag still works).
- Nothing else. No parallax, no autoplay video, no scroll-jacking.

### 4.7 Voice and copy

- First person "we". Confident, calm, benefit-first. No exclamation marks.
- Em dashes are welcome — they are part of Fyrm's voice. Title pattern: "Fyrm — {statement}".
- Sentence case for new button labels. Existing index.html copy is approved as-is; don't rewrite it in passing.

## 5. Performance and scalability

This site must hold up if millions of people hit it. The strategy is boring on purpose: static pages with zero per-user rendering are infinitely cacheable, so a CDN does the scaling. Protect that property.

### 5.1 Standing rules

- Stay static. No framework, no build step, no client-side routing, no fetch-on-load, no external JS libraries. Every page must render meaningful content with JavaScript disabled.
- Budgets: HTML under 35KB per page, per-page CSS under 8KB, total JS under 12KB. The SHARED styles.css is exempt from the per-page CSS budget (~13KB today; cached once for all pages).
- Scripts load from `<head>` with `defer`. main.js stays a dependency-free strict-mode IIFE.
- Images: explicit `width`/`height` attributes always; `loading="lazy"` below the fold; `decoding="async"` everywhere. Compress before committing; prefer WebP for new photos. The logo and geese stay PNG (transparency).
- Fonts: locked to the three families in 4.2.
- All asset paths are relative, so the site deploys to any CDN or subpath unchanged. Serve css/js/assets with long cache TTLs; if a css/js file's behavior must reach returning visitors immediately, rename the file (styles.v2.css), never query-string busting.

### 5.2 Lists and pagination (for future content)

Blog or guide content, when it arrives: paginate at 12 items per page, pre-rendered static pages (blog/page-2.html), never infinite scroll for indexable content. List pages stay light: title, one-line summary, links.

### 5.3 APIs at scale

Marketing pages never call APIs on load. Any future interactive demo (name search) is deterministic and client-side. If a real API ever backs it: debounce 300ms, cancel in-flight requests, cache identical queries, cursor pagination.

### 5.4 SEO and indexing

- Every page: unique `<title>` ("Fyrm — {statement}"), unique meta description, one h1, `theme-color` #F4F7FB, semantic HTML, real anchor links. Anchor ids are public URL surface; renames are breaking changes.
- **Pending domain:** canonical URLs, Open Graph tags, robots.txt, and sitemap.xml are all absent until the domain is decided. index.html marks the spot with a head comment. When the domain lands: add canonical + OG to every page, create robots.txt (allow all, point at sitemap) and sitemap.xml, set the health-check DOMAIN, and delete this pending note.

### 5.5 The app boundary (future app.<domain>)

The authenticated product will be a separate origin AND a separate private repo. The boundary is hard:

- This repo never contains app code, an SDK, any API key, or any fetch-on-load. Linking is the only integration: absolute `https://app.<domain>/...` URLs once the app exists.
- `css/styles.css`, the logo, and the favicons are CANONICAL in this repo. The app repo will keep synced copies pulled by a sync script (model: Ownd/scripts/sync-design.sh). Additive styling changes are safe; renaming/removing a shared class or changing a logo file needs coordination with the app repo in the same task.
- Legal-page prose will be canonical here with adapted copies in the app, edited as one task.

Backend conventions for the FUTURE app repo (document here, implement nothing in this repo): one Supabase client module; auth guards are UX, RLS is the security boundary; all queries in a single db.js; RLS on every table with a verify-gate migration kept last in the chain; idempotent, zero-padded numbered migrations; explicit column grants (service_role's BYPASSRLS does not bypass GRANTs); SECURITY DEFINER functions set `search_path = ''`; role stored server-side, never user-writable; keyset (never offset) pagination for admin lists; only the anon key ships to the client — service_role and payment secrets live only in edge-function env; every app page `noindex,nofollow` + robots.txt `Disallow: /` + HTML `no-store` + content-hashed asset names. Genuinely NEW territory with no Ownd precedent: recurring compliance deadlines need scheduled jobs, and billing is likely subscription-based rather than one-time checkout.

## 6. Adding a page (checklist)

1. Copy the head pattern from index.html: charset/viewport, "Fyrm — {statement}" title, unique description, theme-color, the three favicon links, canonical + OG (once the domain exists), fonts preconnect block, `styles.css`, `main.js` deferred.
2. Paste the canonical header and the footer byte-for-byte, then convert bare `#anchor` hrefs to `index.html#anchor`. Keep the footer disclaimer (hard rule 5).
3. One h1. Wrap the page in `<div id="fyrm-<page>">`. Build from the component inventory (4.4).
4. Page-specific styles go in `css/<page>.css` with a fresh prefix, tokens only, under the 8KB budget.
5. Add the page to sitemap.xml (once it exists) and the health-check page loop; link it from nav or footer only per the approved roster.
6. Before you call it done: every link and anchor resolves across all pages, `node --check` passes on touched JS, images have width/height, one h1, budgets respected — and render the page at desktop and mobile widths and look at it.
7. Update this file: file map and link inventory (section 3) and anything else your page changed (see section 7).

## 7. Keeping this file current (mandatory)

Whenever you make a major change, update the matching section of this file in the same task. The next person (or model) working here should never discover the truth by diffing code against stale docs.

Update CLAUDE.md when you:

- Add, remove, or rename a page, an anchor id used in nav or footer, or any file in the file map (update section 3, and sitemap.xml once it exists).
- Add a shared component to `styles.css` or change how an existing one is used (update 4.4; remember the future app will consume it too).
- Add or change a design token, font, or breakpoint (update 4.1–4.3). New tokens need a stated purpose in the table.
- Change anything about the business: pricing, stats, jurisdiction, product scope, voice rules (update sections 1 and 2). These changes also require the user to have explicitly asked for them.
- Add a dependency, build step, API call, or anything that affects the performance rules or budgets (update section 5, and justify it).
- Learn a hard-won lesson the next contributor needs (a gotcha, a constraint, a decision with a non-obvious reason). Add one short line where it belongs; this file is documentation, not a changelog.

What does NOT belong here: routine copy tweaks, bug fixes that change no rules, anything already obvious from the code, or session-specific context. When in doubt, ask: would the next model do something wrong without this note? If no, leave the file alone.

Keep edits surgical. Update the relevant section in place, keep the numbering stable, and never let this file grow past roughly 250 lines; tighten old text when you add new text.

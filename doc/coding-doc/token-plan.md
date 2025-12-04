## Design Token & Styles Architecture (All Pages)

### Layering (4-step)
- **Tokens (`src/styles/tokens.css`)**: Global primitives + semantic vars + responsive overrides (media queries on :root only). Includes color/spacing/grid/radius/shadow/motion/type scale values.
- **Base (`src/app/globals.css`)**: Reset + body/html baseline only; imports tokens -> theme -> utilities -> animations -> page styles.
- **Theme/Context (`src/styles/themes/{page}.css`)**: Scope-based overrides (e.g., `.home-page { --home-* }`) mapping to primitives. No classes.
- **Utilities (`src/styles/home-utilities.css` or page-specific)**: Shared containers/spacing/labels/buttons/radius helpers. If page-specific, scope under `.home-page`.
- **Components (CSS Modules)**: Per-component styles, no hardcoded px/hex; use `var(--token)`; layout media queries allowed, numeric props prefer clamp tokens.
- **Animations**: Motion values in tokens; keyframes in `home-animations.css` (scoped to `.home-page`) or component module if one-off.

### File Map (Home as reference)
- tokens: `src/styles/tokens.css`
- base: `src/app/globals.css`
- theme: `src/styles/themes/home.css` (adds home vars + base overrides like font/background/overflow)
- utilities: `src/styles/home-utilities.css` (containers/spacing/labels/buttons/radius)
- animations: `src/styles/home-animations.css` (hud-flicker, bounce, scoped to `.home-page`)
- components: module CSS for Hero/Carousel/CTA/Section3/Section4
- removed: `home-design-tokens.css` (import dropped, file deleted)

### Migration Playbook (for other pages)
1) **Extract vars**: Move page-specific `--page-*` into `themes/{page}.css`, reference primitives.
2) **Create utilities**: If the page needs shared containers/spacing/labels, add `{page}-utilities.css` and scope under `.page-class` if not global.
3) **Module-ize components**: For each section, add `{component}.module.css`, move classes from legacy stylesheet, replace hardcoded values with `var(--page-*)/var(--token)`, keep layout media queries only.
4) **Animations**: Put durations/easing/stagger in tokens; keyframes in `{page}-animations.css` (scoped) or module CSS.
5) **Imports order**: tokens → globals → themes/{page} → {page}-utilities → {page}-animations → remaining styles.
6) **Cleanup**: After a component migrates, delete its global classes from legacy file; drop the legacy import when empty.
7) **Tailwind bridge**: Map needed vars in `tailwind.config.js` (colors/spacing/radius/shadow) so utilities can read CSS vars.

### Home Status (Dec 2025)
- Modules migrated: Hero, Carousel, CTA (Section5), Section3 placeholder, Section4 platform list.
- Utilities: `home-utilities.css` for containers/spacing/labels/buttons/radius.
- Theme: `themes/home.css` holds all `--home-*` and base overrides.
- Animations: `home-animations.css` (hud-flicker, bounce) scoped to `.home-page`.
- Legacy: `home-design-tokens.css` removed/import dropped.
- Outstanding: Ensure footer styles live in footer module; keep verifying Tailwind v4 config picks up CSS var mappings.

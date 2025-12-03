## Unified Design Token Architecture (Blueprint)

Single source of truth for all visual primitives and semantic aliases. Every page/module should consume tokens from its design-tokens.css instead of hardcoding values.

1) Foundations (global primitives)
- Colors: brand palette, neutrals, status (info/success/warn/error), gradients, RGB channels for opacity use.
- Typography: font stacks (EN/ZN) from `font-design-tokens.css` — AllianceNo1/2 + Noto Sans SC + fallback stack — with responsive type scale (headline/body/label), weights, letter-spacing, line-heights.
- Spacing: 4/8-based scale (spacing-xxs…xl), container widths, grid columns, gutters, safe-area padding.
- Radii/Shadows/Blur: corner radius steps, shadow tiers, blur intensity.
- Motion: durations, easings, stagger defaults, opacity/scale ranges.
- Z-index layers: base/overlay/modal/toast, etc.

2) Semantic aliases (per brand/page theme)
- Text: text-primary, text-muted, text-inverse, text-subtle.
- Surfaces: surface-base, surface-muted, surface-elevated, surface-hero, overlay.
- Borders/Dividers: border-strong, border-subtle, divider.
- States: hover/active/disabled opacity, focus rings, selection.
- Components: button-primary/ghost, input-border, card-bg, badge-bg.

3) Responsive typography & spacing
- Expose size/line/letter/family via tokens (e.g., --headline-200-size/line/letter/family) with media queries inside token files; components only reference tokens (no media queries in components).
- Spacing ladder drives margin/padding/gap; containers and max-widths come from tokens.

4) Page/theme token files
- Each page/theme has its own design-tokens.css mapping semantic aliases to that theme’s palette, plus page-specific role tokens (e.g., home-hero-title, product-meta, contact-label) that point to foundations.
- Page tokens also define layout helpers (containers, section padding) and shared radii/shadows/gradients for that page’s hero/cards/CTA.
- `layout-design-tokens.css` handles shared chrome (nav/footer) typography/spacing; avoid duplicating per page.

5) Usage rules
- No hardcoded hex/px in components. Use semantic tokens (colors, spacing) and role tokens (typography classes) from the page’s design-tokens.
- Media queries for type/spacing live only in token files. Components remain media-query free for type/spacing.
- Reusable effects (gradients, overlays, shadows) should be tokenized; one-offs may stay local but reference primitives instead of raw brand hex.

6) Theming & overrides
- Default theme in :root; page-level overrides in the page token file. Use language-aware font stacks via :lang(zh) for CN, default for EN, wired to font-design-tokens.css.
- Dark/alt themes: override semantic aliases only; components stay unchanged.
- Assistive variants: provide RGB channels and opacity tokens for subtle backgrounds (e.g., rgba(var(--brand-rgb), 0.08)).

7) Governance
- Add lint/PR checks to reject hardcoded values in components.
- Brand changes: update foundations. Page look changes: update page-level semantic aliases/role tokens, not components.

Follow this blueprint: create/extend each page’s design-tokens.css to map semantic tokens to the theme, then refactor components to consume those tokens (no inline colors/spacing/type). One change propagates site-wide.

### Token Categories (What / Examples / Function)
- Color — text, bg, border, status — Establish visual tone & semantics: encode brand identity and clearly signal states (success/warn/error/disabled), forming the base visual hierarchy.
- Typography — size, weight, line-height, family — Build information hierarchy & readability: typographic scale/weight steps convey priority while keeping scanning/readability consistent.
- Spacing — 4px/8px/16px ladders (stack/inline) — Define logical grouping & rhythm: Gestalt spacing drives perceived grouping and breathing room across layouts.
- Layout — container, grid, breakpoints — Unify structure & responsiveness: lock skeleton/alignment and responsive rules across desktop/tablet/mobile.
- Shape — border-radius, border-width — Align geometric character: shared corner/border rules ensure buttons/cards/inputs share the same visual DNA.
- Elevation — box-shadow, z-index, opacity — Build Z-axis depth: shadows/occlusion communicate layering, hover, and focus prominence.
- Motion — duration, easing — Guide attention & smooth transitions: physics-aligned feedback directs gaze and eases state changes without abruptness.

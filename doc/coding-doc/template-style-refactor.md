# Service Template Style Refactor Playbook

How we moved Service pages from inline/Tailwind-heavy styles to the shared CSS module + utilities architecture. Use this as a reference for other templates.

## Goals
- Unify style source: fonts, colors, spacing from global tokens/utilities.
- Make styles discoverable and scoped: one module per section, plus shared base.
- Preserve visuals: keep critical sizes/animations while moving classes.

## Target Architecture
- Global: tokens + utilities (font-types, containers, etc.).
- Theme-level: `src/styles/4-themes/service.css` (kept for layout/spacing theme vars).
- Per-section CSS modules:
  - `hero-section.module.css`
  - `methodology-section.module.css`
  - `engine-section.module.css`
  - `data-section.module.css`
  - `gallery-section.module.css`
  - `cta-section.module.css`
  - `timeline-section.module.css`
- Shared base module:
  - `service-shared.module.css` (sectionBase*, padLg, light/subtle/dark backgrounds).

## Step-by-Step Migration
1) **Identify shared patterns**
   - Find repeated section wrappers (min-height, bg, padding) and move to `service-shared.module.css`.
   - Keep global utilities (e.g., `.service-shell`, font type classes) untouched.

2) **Create per-section modules**
   - For each section, create a module file and move structural/layout classes (grids, dividers, media wrappers) into it.
   - Keep font sizing that was inline if it is highly tuned; otherwise rely on font-type utilities.

3) **Swap imports in TSX**
   - Replace `service-template.module.css` imports with section-specific modules and the shared module where needed.
   - Update `className` to combine shared base + section module + existing utilities. Example:
     ```tsx
     import shared from "./service-shared.module.css";
     import styles from "./methodology-section.module.css";

     <section className={`${shared.sectionBase} ${shared.sectionBaseLight}`}>
       <div className={`service-shell ${shared.padLg}`}>
         <div className={styles.methodGrid}>…</div>
       </div>
     </section>
     ```

4) **Preserve behaviors**
   - Keep animation-related classes (`group-hover`, motion variants) in TSX.
   - Retain special sizes (e.g., clamp on hero titles) inline if moving them would risk visual drift.

5) **Remove the monolithic module**
   - Delete `service-template.module.css` after all imports point to the new modules.

6) **Verify**
   - Run lint/build to catch missing imports or class names.
   - Manual QA at key breakpoints: 1024–1599 (laptop protection) and ≥1600 (desktop).

## Checklist for Other Templates
- [ ] Shared base styles extracted (section wrappers, padding).
- [ ] One CSS module per major section; names mirror component files.
- [ ] Global utilities (font types, containers, theme vars) still referenced directly.
- [ ] Animations and special sizing preserved.
- [ ] Old inline/Tailwind reduced to semantic combinations of module classes + utilities.
- [ ] Obsolete monolithic module removed.
- [ ] Lint/build pass; visual check at laptop/desktop breakpoints.

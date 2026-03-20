# isBIM Official Web

Next.js 15 app for isBIM’s marketing site and embedded Sanity Studio. Uses Paraglide i18n, GSAP/Framer Motion, Lenis, TanStack Query, and typed Sanity data fetching.

## Project Layout
- `src/app/layout.tsx` – fonts + globals only.
- `(website)/` – public site with providers, Topbar, Footer, PageTransition, sitemap/robots.
- `(studio)/studio/[[...index]]/page.tsx` – Sanity Studio (NextStudio) isolated layout.
- Components: `src/components/layout/*`, `src/components/sections/*`, `src/components/motion/lazy-motion.tsx` (LazyMotion `m` factory).
- i18n: `src/lib/i18n/locale-context.tsx`, `route-builder.ts`, barrel `index.ts` (client imports).
- Sanity data layer: `src/sanity/lib/*` (client, fetch, queries, types, image).
- Fonts: `src/app/fonts.ts`.

## Requirements
- Node 18.18+ (Next.js 15), npm.
- Docker 24+ with BuildKit enabled if you want to build the container image.

## Scripts
- `npm run dev` – start dev server.
- `npm run build` – compile Paraglide messages then Next build.
- `npm run start` – run production server.
- `npm run lint` – lint with ESLint.
- `npm run analyze` – build with bundle analyzer (`.next/analyze/*.html`).
- `npm run paraglide:compile` – regenerate Paraglide outputs (`src/paraglide`).

## Key Conventions
- Route groups: `(website)` for public UI, `(studio)` for Studio-only; keep shared providers out of root layout.
- Framer Motion: use `MotionProvider` + `m` from `components/motion/lazy-motion`; import `AnimatePresence` directly when needed.
- i18n: client code imports from `@/lib/i18n/index` (hooks) and server code uses pure functions (`buildHref`, `linkTo`). Locale comes from headers; no `[locale]` segments.
- Sanity: use `sanityFetch` with tags and `REVALIDATE` constants; build image URLs via `urlFor`.
- Styling/layout: Tailwind v4; shared container utilities in `globals.css`; Lenis for smooth scroll.

## Developing
1) Install deps: `npm install`
2) Dev: `npm run dev` and open http://localhost:3000
3) Lint: `npm run lint`
4) Analyze bundles: `npm run analyze` and open `.next/analyze/client.html`

## Docker

Recommended local container flow:

```bash
cp .env.build.example .env.build.local
cp .env.runtime.example .env.runtime
./build.sh 0.1.0 local
docker run --rm -p 3000:3000 --env-file .env.runtime isbim-official-web:0.1.0-local
```

If you need to call Docker directly, build the image with a BuildKit secret so the build-time env file is available during `next build` without being copied into the image layers:

```bash
docker build --secret id=next_env,src=.env.build.local -t isbim-official-web:local .
```

Run the container with runtime envs:

```bash
docker run --rm -p 3000:3000 --env-file .env.runtime isbim-official-web:local
```

`NEXT_PUBLIC_*` variables are compiled into the client bundle at build time. If those values change, rebuild the image.

## CCE Deployment
- Online deployment target is Huawei Cloud CCE, not `docker-compose`.
- The checked-in `Dockerfile` only builds the image. CCE still needs Kubernetes resources to run it.
- Use `deploy/cce/README.md`, `deploy/cce/kustomization.yaml`, and `部署文档/03-华为云CCE部署手册.md` for the deployment layer.
- This repo deploys one Next.js SSR workload. Sanity remains an external managed service, even though `/studio` is served from the same app.
- Build-time and runtime envs are intentionally split:
  - build: `.env.build.example` -> `.env.build.production` (or CI/CD injected equivalents)
  - runtime: `deploy/cce/configmap.yaml` + `deploy/cce/secret.yaml`

## Deployment Docs
- Entry point: `部署文档/00-文档索引.md`
- Resource inventory: `部署文档/01-资源清单.md`
- Env architecture: `部署文档/05-环境变量参考.md`

## Notes
- Studio is excluded from public providers/topbar/footer; keep it minimal.
- Remember to run `npm run paraglide:compile` when message catalog changes.

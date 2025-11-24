# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**isBIM Official Web** - A Palantir-level premium enterprise website built with the "Vibe Coding" tech stack philosophy. This project prioritizes exquisite animations, smooth scrolling experiences, and compile-time optimizations.

**Key Philosophy**: This is a high-performance, animation-rich website designed for **desktop, tablet, and mobile** responsiveness. Every feature should consider multi-device experiences.

## Tech Stack Architecture

This project follows a carefully orchestrated "layered" architecture where each technology has a specific role:

### Core Stack
- **Next.js 15.5.6** (App Router + Turbopack) - SSR/SSG, routing, SEO
- **Tailwind CSS v4** - Atomic CSS with design tokens
- **Shadcn/ui** (New York style) - Composable UI components
- **TypeScript** - Type safety throughout

### Internationalization (i18n)
- **Paraglide JS 2.5.0** - Compile-time i18n (NOT next-intl)
- **Strategy**: URL-based routing (`/zh/*`, `/en/*`) with cookie fallback
- **Base Locale**: Chinese (`zh`), secondary: English (`en`)
- **Critical**: Translations MUST be compiled before builds

### Animation Layer (Three-Tier System)
1. **Lenis** - Global smooth scrolling foundation (required for GSAP)
2. **GSAP + ScrollTrigger** - Large narrative scroll-based animations
3. **Framer Motion** - Component-level micro-interactions (hover, tap)

**Animation Coordination Rule**: Lenis provides the smooth scroll event stream that GSAP ScrollTrigger consumes. Framer Motion handles post-entrance interactions.

### Data & State
- **Sanity CMS** (Project: `4y8vgu6z`) - Headless CMS for dynamic content
- **TanStack Query** - API lifecycle management (loading, caching, errors)
- **Zustand** - Lightweight global state (modals, UI state)
- **React Hook Form + Zod** - Form handling with schema validation

## Critical Commands

### Development
```bash
npm run dev                    # Start dev server (Turbopack)
npm run paraglide:compile      # Compile i18n messages (REQUIRED after editing translations)
npm run build                  # Production build (auto-compiles i18n first)
```

### Adding UI Components
```bash
npx shadcn@latest add button   # Add Shadcn component
npx shadcn@latest add dialog   # Components are copied to src/components/ui/
```

### Sanity CMS
```bash
# Sanity Studio is configured but NOT auto-started
# Project ID: 4y8vgu6z, Dataset: production
# Access token stored in .env.local (do NOT commit)
```

## Architecture Deep Dive

### Directory Structure
```
src/
├── app/[locale]/              # Locale-based routing (REQUIRED for Paraglide)
│   ├── layout.tsx             # Root layout with Lenis + Paraglide SSR setup
│   ├── page.tsx               # Home page
│   ├── globals.css            # Tailwind v4 config + design tokens
│   │
│   ├── about-us/              # About Us page
│   ├── services-products/     # Services & Products overview
│   ├── jarvis-ai-suite/       # JARVIS AI Suite overview
│   ├── jarvis-agent/          # JARVIS Agent detail page
│   ├── jarvis-pay/            # JARVIS Pay detail page
│   ├── jarvis-air/            # JARVIS Air detail page
│   ├── jarvis-eagle-eye/      # JARVIS Eagle Eye detail page
│   ├── jarvis-ssss/           # JARVIS SSSS detail page
│   ├── jarvis-dwss/           # JARVIS DWSS detail page
│   ├── jarvis-cdcp/           # JARVIS CDCP detail page
│   ├── jarvis-assets/         # JARVIS Assets detail page
│   ├── jarvis-jpm/            # JARVIS Project Management page
│   ├── bim-consultancy/       # BIM Consultancy page
│   ├── project-finance/       # Project Finance page
│   ├── venture-investments/   # Venture Investments page
│   ├── newsroom/              # Newsroom page
│   ├── careers/               # Careers page
│   └── contact/               # Contact Us page
│
├── components/
│   ├── layout/                # Layout components
│   │   ├── header.tsx         # Main navigation header
│   │   ├── footer.tsx         # Site footer
│   │   ├── navigation.tsx     # Navigation menu with dropdowns
│   │   └── locale-switcher.tsx # Language switcher
│   │
│   ├── sections/              # Page section components
│   │   ├── hero-section.tsx   # Hero header (title + subtitle)
│   │   ├── cta-section.tsx    # Call-to-action block
│   │   ├── feature-block.tsx  # Feature description block
│   │   ├── product-grid.tsx   # Product cards grid
│   │   ├── product-card.tsx   # Individual product card
│   │   ├── quotation-section.tsx # Quote/testimonial block
│   │   ├── statistics-section.tsx # Metrics/stats display
│   │   ├── scroll-prompt.tsx  # "Scroll to Explore" indicator
│   │   ├── narrative-section.tsx # Long-form content blocks
│   │   └── slideshow-section.tsx # Animated slideshow
│   │
│   ├── animations/            # Animation wrapper components
│   │   ├── fade-in.tsx        # Fade-in animation wrapper
│   │   ├── slide-in.tsx       # Slide-in animation wrapper
│   │   ├── parallax-section.tsx # Parallax scroll wrapper
│   │   └── scroll-reveal.tsx  # Scroll-triggered reveal
│   │
│   ├── smooth-scroll-provider.tsx # Lenis initialization
│   └── ui/                    # Shadcn components (auto-generated)
│
├── hooks/                     # Custom React hooks
│   ├── use-scroll-progress.ts # Track scroll position
│   ├── use-in-view.ts         # Intersection observer hook
│   ├── use-media-query.ts     # Responsive breakpoint hook
│   └── use-smooth-scroll-to.ts # Programmatic smooth scroll
│
├── lib/
│   ├── utils.ts               # cn() utility (Shadcn)
│   ├── constants.ts           # App constants (routes, config)
│   ├── types.ts               # Shared TypeScript types
│   └── animations.ts          # GSAP/Framer Motion configs
│
├── styles/                    # Additional style utilities
│   ├── animations.css         # Custom animation keyframes
│   └── typography.css         # Custom typography styles
│
├── data/                      # Static content data
│   ├── products.ts            # JARVIS products data
│   ├── services.ts            # Services data
│   └── navigation.ts          # Navigation menu structure
│
├── paraglide/                 # Auto-generated i18n code (DO NOT EDIT)
│   ├── messages.js
│   ├── runtime.js
│   └── server.js
│
├── sanity/
│   ├── lib/
│   │   ├── client.ts          # Sanity client configuration
│   │   └── queries.ts         # GROQ queries
│   └── schemaTypes/           # Content schemas
│       ├── postType.ts        # Post schema
│       ├── newsType.ts        # News schema
│       ├── careerType.ts      # Career listing schema
│       └── projectType.ts     # Project case study schema
│
└── middleware.ts              # Paraglide middleware for locale detection

messages/                      # i18n source (EDIT THESE)
├── zh.json                    # Chinese translations
└── en.json                    # English translations

public/                        # Static assets
├── images/                    # Image assets
│   ├── products/              # Product screenshots
│   ├── projects/              # Project photos
│   └── logos/                 # Company/partner logos
├── videos/                    # Video assets
└── icons/                     # Icon assets

project.inlang/
└── settings.json              # Paraglide configuration
```

### Paraglide JS i18n System

**CRITICAL WORKFLOW**:
1. Edit `messages/zh.json` and `messages/en.json`
2. Run `npm run paraglide:compile` to generate TypeScript types
3. Import messages: `import * as m from "@/paraglide/messages"`
4. Use with type safety: `m.hero_title()`

**SSR Setup** (already configured in `src/app/[locale]/layout.tsx`):
- Uses `cache()` for SSR locale scoping
- Reads locale from `x-paraglide-locale` header (set by middleware)
- Middleware handles automatic language detection via URL/cookie/baseLocale strategy

**Adding New Messages**:
```json
// messages/zh.json
{
  "new_key": "新訊息 {param}"
}

// messages/en.json
{
  "new_key": "New message {param}"
}
```
Then compile: `npm run paraglide:compile`

### Smooth Scroll + Animation Integration

**Initialization Order** (in `layout.tsx`):
1. `<SmoothScrollProvider>` wraps children (initializes Lenis)
2. Lenis creates RAF loop for smooth scrolling
3. GSAP ScrollTrigger can now consume Lenis scroll events
4. Framer Motion wraps individual interactive components

**Example Animation Pattern**:
```tsx
// Page-level GSAP scroll animation
useEffect(() => {
  gsap.from('.hero', {
    scrollTrigger: { trigger: '.hero', start: 'top center' },
    opacity: 0, y: 100
  });
}, []);

// Component-level Framer Motion
<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
  Click me
</motion.button>
```

### Sanity CMS Integration

**Client Setup** (`src/sanity/lib/client.ts`):
```typescript
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: '4y8vgu6z',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true  // Use false for draft content
})
```

**Fetching Content** (Server Components):
```tsx
import { client } from '@/sanity/lib/client'
import { POSTS_QUERY } from '@/sanity/lib/queries'

const posts = await client.fetch(POSTS_QUERY)
```

**TanStack Query** (Client Components):
```tsx
import { useQuery } from '@tanstack/react-query'

const { data, isLoading } = useQuery({
  queryKey: ['posts'],
  queryFn: () => client.fetch(POSTS_QUERY)
})
```

### Responsive Design Strategy

**Target Devices**: Desktop, Tablet, Mobile
- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Test animations on all devices (smooth scroll may differ on touch devices)
- Lenis config already disables `smoothTouch` for better mobile performance

**Tailwind v4 Design Tokens** (in `globals.css`):
- Colors: Use `bg-background`, `text-foreground`, etc.
- Radius: Use `rounded-lg`, `rounded-xl` (defined in `--radius` vars)
- Dark mode: Use `.dark` class (configured with `@custom-variant`)

### State Management Patterns

**Zustand** (for UI state like modals):
```typescript
// src/stores/modal-store.ts
import { create } from 'zustand'

export const useModalStore = create((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false })
}))
```

**TanStack Query** (for server state):
- Use for all API requests
- Provides automatic caching, refetching, and error handling
- Integrates seamlessly with Sanity client

## Environment Variables

**`.env.local`** (not committed):
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=4y8vgu6z
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
# SANITY_API_TOKEN=... (for write operations)
```

## Important Constraints

1. **Never install `next-intl`** - This project uses Paraglide JS
2. **Always compile Paraglide after editing translations** - Types won't update otherwise
3. **Lenis must initialize before GSAP ScrollTrigger** - Already configured in layout
4. **Use Server Components by default** - Only add `"use client"` when necessary
5. **Shadcn components use "New York" style** - Don't mix with "Default" style
6. **All text must use Paraglide messages** - No hardcoded strings (for i18n)
7. **Consider mobile responsiveness** - Test on all device sizes

## Build & Deployment

**Production Build**:
```bash
npm run build  # Automatically runs paraglide:compile first
npm start      # Start production server
```

**Build Output**:
- Uses Turbopack for faster builds
- Paraglide output is tree-shakeable (only used messages are bundled)
- Lenis adds ~2KB, GSAP adds ~50KB (essential for animations)

## Node Version

**Current**: v18.20.8 (works but not optimal)
**Recommended**: v20+ for full Next.js 15 and Sanity compatibility

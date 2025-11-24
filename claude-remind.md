# Claude Reminders - isBIM Official Web

## i18n (Paraglide) Key Points

### Version Compatibility
- **paraglide-next v0.8.1** requires **paraglide-js v1.x** (NOT v2.x)
- v2.x exports `locales`, `baseLocale`, `getLocale`
- v1.x exports `availableLanguageTags`, `sourceLanguageTag`, `languageTag`

### Project Settings (project.inlang/settings.json)
```json
{
  "sourceLanguageTag": "en",        // NOT "baseLocale"
  "languageTags": ["en", "zh"],     // NOT "locales"
  "pathPattern": "./messages/{languageTag}.json"  // NOT "{locale}"
}
```

### App Structure
- Use flat `app/` structure (NOT `app/[locale]/`)
- paraglide-next's PrefixStrategy handles routing via middleware
- `[locale]` folder causes redirect loops with PrefixStrategy

### Runtime API
- Use `languageTag()` to get current locale (NOT `getLocale()`)
- Use `availableLanguageTags` array (NOT `locales`)
- Type: `AvailableLanguageTag` (NOT `Locale`)

### Navigation
- Import `Link`, `useRouter`, `usePathname` from `@/lib/i18n`
- Router: `router.push(pathname, { locale: newLocale })`
- These handle locale prefix automatically

### Key Files
- `src/lib/i18n.ts` - Strategy, Middleware, Navigation exports
- `src/middleware.ts` - Re-exports middleware from i18n.ts
- `src/app/layout.tsx` - Wrap with `<LanguageProvider>`

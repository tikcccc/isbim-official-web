# isBIM Website TODO (Coding TODO)

**Purpose:** Tracks all outstanding engineering tasks for the isBIM website. Remove items when done to keep the list lean.  
**Rules:** Finish -> delete; Add new items by priority/category; Review weekly.  
**Usage:** Claim/finish -> delete checkbox; Remove a section if fully done; Add new tasks under the right category.  
**Last Updated:** 2025-11-29

---

## High Priority

### Email system production rollout

**Background:** Contact form email is complete in dev; Resend + Brevo dual providers (v4.1). Production needs custom-domain verification for deliverability.

#### Option A: Resend domain verification (recommended, default)
- [ ] Resend console: https://resend.com/domains
- [ ] Add domain `isbim.com.hk`; fetch DNS records.
- [ ] DNS: SPF `v=spf1 include:_spf.resend.com ~all`; DKIM `resend._domainkey`; DMARC optional `v=DMARC1; p=none; rua=mailto:dmarc@isbim.com.hk`.
- [ ] Wait for DNS propagation; confirm "Verified" in Resend.
- [ ] Vercel env: ensure `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, `EMAIL_FROM_INTERNAL=isBIM Contact Form <noreply@isbim.com.hk>`, `EMAIL_FROM_USER=isBIM <noreply@isbim.com.hk>`, `CONTACT_EMAIL_TO=solution@isbim.com.hk`.
- [ ] Prod test: submit form; log shows resend; internal mail received; user confirmation received; not in spam; rate limit (3/IP/5min) works.

#### Option B: Brevo domain verification (optional fallback)
- [ ] Brevo console: https://app.brevo.com/senders/domain/list
- [ ] Add domain `isbim.com.hk`; fetch DNS records.
- [ ] DNS: SPF `v=spf1 include:spf.brevo.com ~all`; DKIM `mail._domainkey`; DMARC optional `v=DMARC1; p=none; rua=mailto:dmarc@isbim.com.hk`.
- [ ] Wait for DNS propagation; confirm "Authenticated".
- [ ] Note SPF merge if both providers: `v=spf1 include:_spf.resend.com include:spf.brevo.com ~all`.
- [ ] Vercel env when switching: set `EMAIL_PROVIDER=brevo`, ensure `BREVO_API_KEY`, redeploy.
- [ ] Brevo test: submit form; log shows brevo; mail delivered; deliverability acceptable.

**Related files:** `.env.local`, `.env.production`, `src/lib/email/email-client.ts`, `src/lib/email/brevo-client.ts`, `src/lib/email/resend-client.ts`, `src/lib/email/send-contact-email.ts`, `src/lib/env.ts`, `src/schemas/contact-form.schema.ts`.

**Decision guidance:** Prefer Resend first; Brevo optional; merge SPF if dual.

---

### Sanity dynamic content i18n alignment (News/Careers)

**Goal:** Dynamic content follows i18n routes with bilingual data; avoid code-side translation mapping.

**Recommended approach:** Single dataset, two documents per item (`languageTag` en/zh + `translationKey`); localized slug/SEO per language.

**Tasks:**
- [ ] Schema: Add `languageTag` (en/zh) + `translationKey` to `news`/`career`; allow same group slugs per language; show language in preview.
- [ ] Studio: Enable `@sanity/document-internationalization` or custom "Duplicate to zh/en" action to auto-copy and set language/slug.
- [ ] GROQ: List/detail filtered by `languageTag`, fallback to en; cache tags `sanity:{type}:{translationKey}`; routes use language slug.
- [ ] Revalidate/SEO: Webhook revalidates by `translationKey` (news/career together); `hreflang`/sitemap use sibling documents in the same group.

---

## SEO Tasks

### Infrastructure checks
- [ ] Validate metadata and structured data in Google Search Console.

### JARVIS product pages (8)
- [ ] `/jarvis-agent` - metadata + SoftwareApplication schema + breadcrumb
- [ ] `/jarvis-pay` - metadata + SoftwareApplication schema + breadcrumb
- [ ] `/jarvis-air` - metadata + SoftwareApplication schema + breadcrumb
- [ ] `/jarvis-eagle-eye` - metadata + SoftwareApplication schema + breadcrumb
- [ ] `/jarvis-ssss` - metadata + SoftwareApplication schema + breadcrumb
- [ ] `/jarvis-dwss` - metadata + SoftwareApplication schema + breadcrumb
- [ ] `/jarvis-cdcp` - metadata + SoftwareApplication schema + breadcrumb
- [ ] `/jarvis-assets` - metadata + SoftwareApplication schema + breadcrumb

### Services pages (4)
- [ ] `/jarvis-jpm` - metadata + Service schema + breadcrumb
- [ ] `/bim-consultancy` - metadata + Service schema + breadcrumb
- [ ] `/project-finance` - metadata + Service schema + breadcrumb
- [ ] `/venture-investments` - metadata + Service schema + breadcrumb

### Support pages
- [ ] `/careers` - metadata
- [ ] `/privacy` - basic metadata
- [ ] `/terms` - basic metadata
- [ ] `/cookies` - basic metadata

### SEO enhancements
- [ ] OG image per product/service (1200x630) - design task
- [ ] Google Rich Results Test for all structured data
- [ ] News sitemap (optional)
- [ ] Image sitemap (optional)
- [ ] Full Google Search Console audit

**Keyword guardrails:** brand (isBIM/isBIM Limited); geo (Hong Kong/香港); dual identity (AI tech + Construction tech); industry (ConTech, construction AI, building technology, 智能建筑).

**Notes:** Static pages use `messages/en.json` and `messages/zh.json`; Newsroom and Careers use Sanity; target Google & Bing; exclude `/contact`, `/jarvis-ai-suite`.

---

## UI/UX Improvements

_(No open items)_

---

## Bug Fixes

### Brevo email sending 403 error
- [ ] Check Brevo API Key permissions (https://app.brevo.com/settings/keys/api).
- [ ] Verify `sendTransacEmail` parameters per Brevo SDK docs.
- [ ] Add detailed error logging with full Brevo response.
- [ ] Test Brevo API Playground with the key.
- [ ] Consider contacting Brevo support.

**Related files:** `src/lib/email/email-client.ts` (lines 96-112), `src/lib/email/brevo-client.ts`, `.env.local`.

**Workaround:** Use Resend as primary (`EMAIL_PROVIDER=resend`); keep Brevo as backup until fixed.

---

## Other Tasks

_(No open items)_

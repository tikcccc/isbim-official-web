# Coding Plan

**Description:** This file tracks pending implementation tasks and future plans for the isBIM Official Web project.

**Guidelines:**
1. Only write incomplete or pending tasks that need to be done
2. Keep entries concise and actionable
3. Remove completed items immediately

---

## i18n/SEO Future Enhancement (2025-11-26)
- Consider domain-based i18n strategy (`isbim.com` for EN, `isbim.cn` or `zh.isbim.com` for ZH) to achieve clean URLs without SEO penalties - requires DNS/hosting configuration

## SEO/Performance follow-ups (2025-11-26)
- Set `SANITY_WEBHOOK_SECRET` in `.env.local` and configure the Sanity webhook (create/update/delete -> `/api/revalidate`) with the same secret; confirm revalidate 200 OK.
- Add Baidu site verification value in `lib/seo.ts` and verify in Baidu Webmaster.
- Populate Sanity SEO fields (metaTitle/metaDescription/openGraphImage/keywords) and alt text (10-125 chars) for posts/products/images; no empty alt values.
- Choose OG image generation path (Sanity URL builder or `app/og/route.tsx`) and wire previews.
- Add Product/JobPosting `JsonLd` schemas on relevant pages.
- Submit sitemap to Google Search Console + Baidu; run Rich Results Test and PageSpeed (CLS/LCP) checks.
- Monitor webhook logs when publishing Sanity content.
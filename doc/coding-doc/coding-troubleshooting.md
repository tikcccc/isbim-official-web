# Troubleshooting & Bug Fixes (Updated 2025-11-29)

**Purpose:** Record bugs encountered and their solutions. Keep entries concise (< 5 lines per fix).

**When to add:**
- Fixed a non-trivial bug (especially recurring patterns)
- Discovered library limitations or integration gotchas
- Found workarounds for build/deployment errors

**Format:** Problem → Root Cause → Solution
**Cleanup:** Delete outdated issues when dependencies are upgraded or refactored

---

- Problem: /en/jarvis-pay 仍渲染中文文案
  Root Cause: Locale 解析疑似未按 URL 前缀优先，x-language-tag 返回 zh（需确认）
  Solution: 未解决；需检查/调整 @/lib/i18n PrefixStrategy 解析优先级（中间件需优先 URL 前缀）、清理 locale cookie 后重测

- Problem: Jarvis Pay 切换语言后文案错位（URL 与文案语言不一致）
  Root Cause: 页面被静态缓存成 RSC，locale 切换未重新渲染内容
  Solution: 在 src/app/(website)/jarvis-pay/page.tsx 添加 `export const dynamic = "force-dynamic";`（或 `revalidate = 0`）强制按请求 locale 渲染

- Problem: 使用 `next export`（或全量静态化）时 /contact 预渲染失败
  Root Cause: 页面依赖 Server Action（submitContactForm）和 headers()，不支持纯静态导出
  Solution: 未解决；应使用正常 `next build`（动态渲染）。若必须静态导出，需移除 Server Action/headers 依赖，改为 API 路由或外部服务

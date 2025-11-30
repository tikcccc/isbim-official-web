# Troubleshooting & Bug Fixes (Updated 2025-11-29)

**Purpose:** Record bugs encountered and their solutions. Keep entries concise (< 5 lines per fix).

**When to add:**
- Fixed a non-trivial bug (especially recurring patterns)
- Discovered library limitations or integration gotchas
- Found workarounds for build/deployment errors

**Format:** Problem → Root Cause → Solution  
**Cleanup:** Delete outdated issues when dependencies are upgraded or refactored

---

- Problem: /en/jarvis-pay 渲染中文文案  
  Root Cause: Locale 解析未锁定 URL 前缀，x-language-tag 可能返回 zh  
  Solution: 已解决；恢复默认 Middleware，并在 src/app/(website)/jarvis-pay/page.tsx 读取 headers 的 x-language-tag + setLanguageTag，保持 `dynamic = "force-dynamic"`

- Problem: Jarvis Pay 切换语言后文案错位（URL 与文案语言不一致）  
  Root Cause: 页面被静态缓存，locale 切换未重新渲染内容  
  Solution: 已解决；同上在页面中显式 setLanguageTag 并保留 `dynamic = "force-dynamic"`，确保按请求 locale 渲染

- Problem: 使用 `next export`（或全量静态化）时 /contact 预渲染失败  
  Root Cause: 页面依赖 Server Action（submitContactForm）和 headers()，不支持纯静态导出  
  Solution: 未解决；使用常规 `next build`（动态渲染）。若必须静态导出，需改为 API 路由/外部服务以移除 Server Action 依赖

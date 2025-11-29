# isBIM 官网待办事项清单 (Coding TODO)

**文件说明:** 本文件记录 isBIM 官网所有**未完成**的开发任务。已完成的任务会被移除,保持清单简洁实用。

**更新原则:**
- ✅ 任务完成后立即从清单中删除
- 🆕 新任务按优先级和类别添加
- 📅 定期审查和更新(每周)

**使用方式:**
- 以后完成任务时:
- 直接从清单中删除对应的复选框
- 如果某个章节(如邮件系统)全部完成,删除整个章节
- 添加新任务时,放到对应分类下

**最后更新:** 2025-11-29

---

## 🔥 高优先级任务

### 邮件系统生产环境部署

**背景:** 联系表单邮件功能已在开发环境完成,生产环境需要验证自定义域名才能正常发送。

**步骤 1: Resend 域名验证** (需要 DNS 管理员协助)
- [ ] 登录 Resend 控制台: https://resend.com/domains
- [ ] 添加域名: `isbim.com.hk`
- [ ] 获取 DNS 配置记录 (Resend 会提供)
- [ ] 联系 DNS 管理员配置以下记录:
  - [ ] SPF 记录 (Type: TXT, Name: @, Value: `v=spf1 include:_spf.resend.com ~all`)
  - [ ] DKIM 记录 (Type: TXT, Name: `resend._domainkey`, Value: [Resend 提供])
  - [ ] DMARC 记录 (可选) (Type: TXT, Name: `_dmarc`, Value: `v=DMARC1; p=none; rua=mailto:dmarc@isbim.com.hk`)
- [ ] 等待 DNS 传播 (10 分钟 - 48 小时)
- [ ] 在 Resend 控制台确认域名验证状态为 "Verified"

**步骤 2: 配置 Vercel 生产环境变量**
- [ ] 设置 `EMAIL_FROM_INTERNAL=isBIM Contact Form <noreply@isbim.com.hk>`
- [ ] 设置 `EMAIL_FROM_USER=isBIM <noreply@isbim.com.hk>`
- [ ] 确认 `CONTACT_EMAIL_TO=solution@isbim.com.hk`

**步骤 3: 生产环境测试**
- [ ] 提交测试表单
- [ ] 验证内部通知邮件送达 `solution@isbim.com.hk`
- [ ] 验证用户确认邮件正常发送
- [ ] 检查邮件不进垃圾箱 (已验证域名送达率更高)
- [ ] 测试速率限制功能 (3次/IP/5分钟)

**相关文件:**
- `.env.local`, `.env.production`
- `src/lib/email/send-contact-email.ts`
- `src/lib/env.ts` (`getEmailFromInternal()`, `getEmailFromUser()`)
- `src/schemas/contact-form.schema.ts`

---

## 📊 SEO 优化任务

### 基础设施验证
- [ ] 在 Google Search Console 测试元数据和结构化数据

### JARVIS 产品页面 SEO (8 个页面)
- [ ] `/jarvis-agent` - 添加元数据 + SoftwareApplication schema + 面包屑
- [ ] `/jarvis-pay` - 添加元数据 + SoftwareApplication schema + 面包屑
- [ ] `/jarvis-air` - 添加元数据 + SoftwareApplication schema + 面包屑
- [ ] `/jarvis-eagle-eye` - 添加元数据 + SoftwareApplication schema + 面包屑
- [ ] `/jarvis-ssss` - 添加元数据 + SoftwareApplication schema + 面包屑
- [ ] `/jarvis-dwss` - 添加元数据 + SoftwareApplication schema + 面包屑
- [ ] `/jarvis-cdcp` - 添加元数据 + SoftwareApplication schema + 面包屑
- [ ] `/jarvis-assets` - 添加元数据 + SoftwareApplication schema + 面包屑

### 服务页面 SEO (4 个页面)
- [ ] `/jarvis-jpm` - 添加元数据 + Service schema + 面包屑
- [ ] `/bim-consultancy` - 添加元数据 + Service schema + 面包屑
- [ ] `/project-finance` - 添加元数据 + Service schema + 面包屑
- [ ] `/venture-investments` - 添加元数据 + Service schema + 面包屑

### 支持页面 SEO
- [ ] `/careers` - 添加元数据
- [ ] `/privacy` - 添加基本元数据
- [ ] `/terms` - 添加基本元数据
- [ ] `/cookies` - 添加基本元数据

### SEO 增强任务
- [ ] 为每个产品/服务创建 OG 图片 (1200x630) - **设计任务**
- [ ] 使用 Google Rich Results Test 测试所有结构化数据
- [ ] 创建 news sitemap (可选)
- [ ] 添加 image sitemap (可选)
- [ ] Google Search Console 完整审核

**SEO 关键词要求:**
- **品牌**: "isBIM", "isBIM Limited"
- **地理**: "Hong Kong", "香港", "Hong Kong AI company", "香港科技公司"
- **双重身份**: "AI technology company" + "Construction technology company"
- **行业**: "ConTech", "construction AI", "building technology", "智能建筑"

**注意事项:**
- 静态页面使用 `messages/en.json` 和 `messages/zh.json`
- 仅 Newsroom 和 Careers 使用 Sanity
- 针对 Google 和 Bing 优化 (Baidu 延后)
- 排除页面: `/contact`, `/jarvis-ai-suite` (重新设计中)

---

## 🎨 UI/UX 改进

_(暂无待办事项)_

---

## 🐛 Bug 修复

_(暂无待办事项)_

---

## 📦 其他任务

_(暂无待办事项)_

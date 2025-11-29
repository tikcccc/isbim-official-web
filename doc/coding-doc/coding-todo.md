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

**背景:** 联系表单邮件功能已在开发环境完成,已实现 Resend + Brevo 双提供商系统 (v4.1)。生产环境需要验证自定义域名以提升送达率和专业性。

#### 方案 A: Resend 域名验证 (推荐,默认提供商)

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
- [ ] 确认 `EMAIL_PROVIDER=resend` (默认值,可省略)
- [ ] 确认 `RESEND_API_KEY` 已配置
- [ ] 设置 `EMAIL_FROM_INTERNAL=isBIM Contact Form <noreply@isbim.com.hk>`
- [ ] 设置 `EMAIL_FROM_USER=isBIM <noreply@isbim.com.hk>`
- [ ] 确认 `CONTACT_EMAIL_TO=solution@isbim.com.hk`

**步骤 3: 生产环境测试**
- [ ] 提交测试表单
- [ ] 检查控制台日志确认使用 Resend: `✅ Emails sent successfully via resend`
- [ ] 验证内部通知邮件送达 `solution@isbim.com.hk`
- [ ] 验证用户确认邮件正常发送
- [ ] 检查邮件不进垃圾箱 (已验证域名送达率更高)
- [ ] 测试速率限制功能 (3次/IP/5分钟)

---

#### 方案 B: Brevo 域名验证 (备选提供商,可选)

**背景:** Brevo 域名验证是可选的,但推荐配置以提升送达率。即使不验证,Brevo 也可以发送邮件 (使用默认域名,可能进垃圾箱)。

**步骤 1: Brevo 域名验证** (可选但推荐)
- [ ] 登录 Brevo 控制台: https://app.brevo.com/senders/domain/list
- [ ] 添加域名: `isbim.com.hk`
- [ ] 获取 DNS 配置记录 (Brevo 会提供)
- [ ] 联系 DNS 管理员配置以下记录:
  - [ ] SPF 记录 (Type: TXT, Name: @, Value: `v=spf1 include:spf.brevo.com ~all`)
  - [ ] DKIM 记录 (Type: TXT, Name: `mail._domainkey`, Value: [Brevo 提供])
  - [ ] DMARC 记录 (可选) (Type: TXT, Name: `_dmarc`, Value: `v=DMARC1; p=none; rua=mailto:dmarc@isbim.com.hk`)
- [ ] 等待 DNS 传播 (10 分钟 - 48 小时)
- [ ] 在 Brevo 控制台确认域名验证状态为 "Authenticated"

**注意事项:**
- ⚠️ **SPF 冲突**: 如果同时使用 Resend 和 Brevo,SPF 记录需要合并:
  ```
  v=spf1 include:_spf.resend.com include:spf.brevo.com ~all
  ```
- ⚠️ **DKIM 前缀不同**: Resend 使用 `resend._domainkey`,Brevo 使用 `mail._domainkey`,不会冲突

**步骤 2: 配置 Vercel 环境变量 (仅在切换到 Brevo 时需要)**
- [ ] 设置 `EMAIL_PROVIDER=brevo`
- [ ] 确认 `BREVO_API_KEY` 已配置 (当前: `xkeysib-904a45...`)
- [ ] 重新部署 Vercel

**步骤 3: 测试 Brevo 发送**
- [ ] 提交测试表单
- [ ] 检查控制台日志确认使用 Brevo: `✅ Emails sent successfully via brevo`
- [ ] 验证邮件送达
- [ ] 检查送达率 (已验证域名送达率更高)

---

**相关文件:**
- `.env.local`, `.env.production`
- `src/lib/email/email-client.ts` (双提供商路由)
- `src/lib/email/brevo-client.ts`, `src/lib/email/resend-client.ts`
- `src/lib/email/send-contact-email.ts`
- `src/lib/env.ts` (`getEmailFromInternal()`, `getEmailFromUser()`, `getEmailProvider()`)
- `src/schemas/contact-form.schema.ts`

**决策建议:**
- ✅ **先验证 Resend** (默认提供商,免费 3000 封/月)
- ⏸️ **Brevo 验证可延后** (仅在需要切换时配置,免费 9000 封/月)
- ⚠️ **注意 DNS 冲突** (SPF 记录需合并,DKIM 不冲突)

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

### Brevo 邮件发送 403 错误

**问题描述:**
- 在本地环境测试 Brevo 邮件发送时,持续遇到 403 Forbidden 错误
- 已在 Brevo 控制台验证了发件人邮箱 (`chiutikhong11551@gmail.com`)
- 已添加邮件地址解析函数 `parseEmailAddress()` 来处理 "Name <email>" 格式
- 错误依然存在,需要进一步调试

**已尝试的解决方案:**
- ✅ 在 Brevo 控制台验证发件人邮箱
- ✅ 修改 `.env.local` 使用简单邮箱格式 (无发件人名称)
- ✅ 添加 `parseEmailAddress()` 函数解析邮箱格式
- ❌ 仍然返回 403 错误

**可能的原因:**
- API Key 权限不足 (需要检查 Brevo API Key 的权限设置)
- Brevo API 调用参数格式不正确 (需要查看 Brevo SDK 文档)
- 发件人邮箱虽然已验证,但可能需要额外的配置
- Brevo 免费账户可能有未知的限制

**待修复步骤:**
- [ ] 检查 Brevo API Key 权限设置 (https://app.brevo.com/settings/keys/api)
- [ ] 查看 Brevo SDK 官方文档,确认 `sendTransacEmail` 正确调用方式
- [ ] 添加详细错误日志,打印完整的 Brevo API 响应信息
- [ ] 测试 Brevo API Playground,验证 API Key 是否可以正常发送邮件
- [ ] 考虑联系 Brevo 技术支持

**相关文件:**
- `src/lib/email/email-client.ts` (lines 96-112, Brevo 调用逻辑)
- `src/lib/email/brevo-client.ts` (Brevo SDK 初始化)
- `.env.local` (EMAIL_PROVIDER=brevo, 发件人配置)

**临时解决方案:**
- 当前使用 Resend 作为主要邮件提供商 (EMAIL_PROVIDER=resend)
- Brevo 作为备选方案,待修复后启用

---

## 📦 其他任务

_(暂无待办事项)_

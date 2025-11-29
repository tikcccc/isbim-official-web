# isBIM 官网备份方案 (Backup Plan)

**文件说明:** 本文件记录 isBIM 官网关键技术模块的备份方案和替代选项。当主要技术服务出现问题时,可快速切换到备份方案,确保业务连续性。

**备份原则:**
- 🔄 每个关键服务都应有至少一个备份方案
- 📋 记录迁移步骤和预估工作量
- 💰 对比成本差异
- ⚡ 优先选择迁移难度低、功能相近的替代方案

**最后更新:** 2025-11-29

---

## 📧 邮件服务备份方案

### 当前方案: Resend

**使用场景:** 联系表单邮件发送 (内部通知 + 用户确认)

**优点:**
- 现代化 API 设计,开发体验好
- 免费额度充足 (3,000 封/月)
- 文档清晰,TypeScript SDK 完善
- 域名验证流程简单
- 邮件送达率高

**缺点:**
- 免费额度有限 (超过 3,000 封/月需付费)
- 仅支持发送邮件 (无接收功能)
- 国际服务,可能受网络限制影响

---

### 备份方案 1: Brevo (原 Sendinblue)

#### 功能对比

| 功能 | Resend | Brevo |
|------|--------|-------|
| 免费额度 | 3,000 封/月 | 300 封/天 (9,000 封/月) |
| 邮件模板 | HTML + React (React Email) | HTML + 可视化编辑器 |
| API 风格 | RESTful (现代) | RESTful (传统) |
| 送达率 | 高 | 高 |
| 域名验证 | SPF + DKIM + DMARC | SPF + DKIM + DMARC |
| 附加功能 | 无 | SMS, WhatsApp, 营销自动化 |
| TypeScript SDK | 官方 SDK | 社区 SDK |
| 文档质量 | 优秀 | 良好 |

#### 成本对比

**Resend:**
- 免费: 3,000 封/月
- 付费: $20/月 (50,000 封)
- 超额: $1/1,000 封

**Brevo:**
- 免费: 300 封/天 (9,000 封/月)
- 付费: $25/月 (20,000 封)
- 超额: $1/1,000 封

**结论:** 如果月发送量 < 3,000 封,Resend 更优。如果月发送量 3,000-9,000 封,Brevo 免费额度更大。

#### 迁移难度评估

**工作量:** 4-8 小时

**影响范围:**
- `src/lib/email/resend-client.ts` - 需更换 SDK
- `src/lib/email/send-contact-email.ts` - 调整 API 调用方式
- `.env.local`, `.env.production` - 更换 API Key
- `src/lib/env.ts` - 更新环境变量名称

**难度等级:** ⭐⭐ (中低) - API 相似度高,主要是 SDK 替换

#### 迁移步骤

**步骤 1: 注册 Brevo 账号**
1. 访问 https://www.brevo.com/
2. 注册账号并验证邮箱
3. 获取 API Key (Settings > SMTP & API > API Keys)

**步骤 2: 域名验证**
1. 在 Brevo 控制台添加域名 `isbim.com.hk`
2. 配置 DNS 记录 (SPF, DKIM)
3. 等待验证通过

**步骤 3: 安装 SDK**
```bash
npm install @getbrevo/brevo
npm uninstall resend
```

**步骤 4: 更新代码**

修改 `src/lib/email/brevo-client.ts` (新建):
```typescript
import * as brevo from '@getbrevo/brevo';
import { getBrevoApiKey } from '@/lib/env';

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  getBrevoApiKey()
);

export { apiInstance as brevoClient };
```

修改 `src/lib/email/send-contact-email.ts`:
```typescript
// Before (Resend)
const internalResult = await resend.emails.send({
  from: getEmailFromInternal(),
  to: internalEmailTo,
  subject: internalEmail.subject,
  html: internalEmail.html,
  text: internalEmail.text,
  replyTo: data.email,
});

// After (Brevo)
const sendSmtpEmail = new brevo.SendSmtpEmail();
sendSmtpEmail.sender = {
  email: 'noreply@isbim.com.hk',
  name: 'isBIM Contact Form'
};
sendSmtpEmail.to = [{ email: internalEmailTo }];
sendSmtpEmail.subject = internalEmail.subject;
sendSmtpEmail.htmlContent = internalEmail.html;
sendSmtpEmail.textContent = internalEmail.text;
sendSmtpEmail.replyTo = { email: data.email };

const internalResult = await brevoClient.sendTransacEmail(sendSmtpEmail);
```

修改 `.env.local`:
```env
# Before
RESEND_API_KEY=re_xxx

# After
BREVO_API_KEY=xkeysib-xxx
```

修改 `src/lib/env.ts`:
```typescript
// Before
RESEND_API_KEY: process.env.RESEND_API_KEY,

export function getResendApiKey(): string {
  const apiKey = env.RESEND_API_KEY;
  // ...
}

// After
BREVO_API_KEY: process.env.BREVO_API_KEY,

export function getBrevoApiKey(): string {
  const apiKey = env.BREVO_API_KEY;
  // ...
}
```

**步骤 5: 测试**
1. 提交测试表单
2. 验证内部通知邮件送达
3. 验证用户确认邮件送达
4. 检查邮件不进垃圾箱

#### 何时考虑迁移到 Brevo?

**建议迁移的情况:**
- 月发送量持续超过 3,000 封
- 需要 SMS 或 WhatsApp 功能
- 需要营销自动化功能
- 需要可视化邮件模板编辑器

**不建议迁移的情况:**
- 月发送量 < 3,000 封 (Resend 免费额度足够)
- 重视开发体验 (Resend API 更现代)
- 项目使用 React Email 组件 (Resend 原生支持)

---

### 备份方案 2: AWS SES (Simple Email Service)

#### 优点
- 成本极低 ($0.10/1,000 封)
- 高可靠性 (AWS 基础设施)
- 无月发送量限制
- 与 AWS 生态集成好

#### 缺点
- 初期需要申请退出沙箱模式 (24-48 小时审核)
- 配置复杂 (IAM, SES, SMTP)
- 无邮件模板可视化编辑器
- SDK 相对臃肿 (AWS SDK)

#### 迁移难度
**工作量:** 8-12 小时
**难度等级:** ⭐⭐⭐ (中高) - 需要配置 AWS 账号和 IAM 权限

#### 何时考虑?
- 月发送量 > 50,000 封 (成本优势明显)
- 已使用 AWS 生态 (Lambda, S3, CloudFront)
- 需要极高的可靠性和扩展性

---

### 备份方案 3: Postmark

#### 优点
- 专注于事务性邮件 (不支持营销邮件)
- 送达率极高
- 详细的邮件追踪和分析
- 优秀的开发体验

#### 缺点
- 无免费额度 (最低 $15/月 起步)
- 价格较高

#### 迁移难度
**工作量:** 4-6 小时
**难度等级:** ⭐⭐ (中低) - API 与 Resend 相似

#### 何时考虑?
- 对送达率要求极高
- 需要详细的邮件追踪分析
- 预算充足

---

## 推荐决策树

```
月发送量 < 3,000 封?
├─ 是 → 继续使用 Resend (免费额度足够)
└─ 否 → 月发送量 < 9,000 封?
    ├─ 是 → 迁移到 Brevo (免费额度更大)
    └─ 否 → 月发送量 > 50,000 封?
        ├─ 是 → 迁移到 AWS SES (成本最低)
        └─ 否 → 根据预算和功能需求选择 Brevo/Postmark
```

---

## 🗄️ 其他模块备份方案

### CMS 备份方案 (Sanity 替代)

_(待补充)_

可选方案: Strapi, Contentful, Payload CMS

---

### CDN 备份方案 (华为云 OBS 替代)

_(待补充)_

可选方案: AWS S3 + CloudFront, Cloudflare R2, 阿里云 OSS

---

### 部署平台备份方案 (Vercel 替代)

_(待补充)_

可选方案: Netlify, AWS Amplify, Cloudflare Pages

---

## 📝 使用指南

**添加新备份方案时:**
1. 记录当前方案的优缺点
2. 列出至少 2-3 个备份选项
3. 对比功能、成本、迁移难度
4. 提供详细的迁移步骤
5. 说明何时应该考虑迁移

**评估备份方案时:**
- 迁移难度: ⭐ (简单 1-2 小时) 到 ⭐⭐⭐⭐⭐ (复杂 > 40 小时)
- 成本对比: 列出免费额度和付费价格
- 功能差异: 关键功能是否支持
- 业务影响: 停机时间、数据迁移等

# isBIM SEO 优化实施计划

## 第 1 阶段: 基础设施 ✅ 已完成

### ✅ 已完成
- [x] 创建 `src/lib/seo-generators.ts` 关键词系统
  - [x] 分层关键词系统 (品牌、身份、地理、技术、产品/服务)
  - [x] `composeKeywords()` 函数确保核心关键词始终包含
  - [x] 产品、服务、关于、新闻、职业页面生成器
  - [x] 双语支持 (en/zh)
- [x] 扩展 `src/components/seo/json-ld.tsx` 添加 `SoftwareApplication` schema
  - [x] `createSoftwareApplicationSchema()` 函数
  - [x] 支持 provider, featureList, offers, aggregateRating
- [x] 为 P0 页面添加元数据:
  - [x] 主页增强 (添加 Organization + SoftwareApplication schemas)
  - [x] 关于我们 `/about-us` (添加 Organization schema)
  - [x] 服务与 AI 产品 `/services-products` (添加 Breadcrumb schema)
  - [x] 新闻中心 `/newsroom` (添加 Breadcrumb schema)
- [x] 更新 sitemap 优先级
  - [x] 排除 `/jarvis-ai-suite` (正在重新设计)
  - [x] 降低 `/contact` 优先级 (正在重新设计)

### 🚧 待办
- [ ] 在 Google Search Console 测试

## 第 2 阶段: 产品与服务页面

### JARVIS 产品页面 (8 个)
- [ ] `/jarvis-agent` - 添加元数据 + SoftwareApplication schema + 面包屑
- [ ] `/jarvis-pay` - 添加元数据 + SoftwareApplication schema + 面包屑
- [ ] `/jarvis-air` - 添加元数据 + SoftwareApplication schema + 面包屑
- [ ] `/jarvis-eagle-eye` - 添加元数据 + SoftwareApplication schema + 面包屑
- [ ] `/jarvis-ssss` - 添加元数据 + SoftwareApplication schema + 面包屑
- [ ] `/jarvis-dwss` - 添加元数据 + SoftwareApplication schema + 面包屑
- [ ] `/jarvis-cdcp` - 添加元数据 + SoftwareApplication schema + 面包屑
- [ ] `/jarvis-assets` - 添加元数据 + SoftwareApplication schema + 面包屑

### 服务页面 (4 个)
- [ ] `/jarvis-jpm` - 添加元数据 + Service schema + 面包屑
- [ ] `/bim-consultancy` - 添加元数据 + Service schema + 面包屑
- [ ] `/project-finance` - 添加元数据 + Service schema + 面包屑
- [ ] `/venture-investments` - 添加元数据 + Service schema + 面包屑

### 其他任务
- [ ] 为每个产品/服务创建 OG 图片 (设计任务)
- [ ] 使用 Google Rich Results Test 测试结构化数据

## 第 3 阶段: 支持页面

- [ ] `/careers` - 添加元数据
- [ ] `/privacy` - 添加基本元数据
- [ ] `/terms` - 添加基本元数据
- [ ] `/cookies` - 添加基本元数据
- [ ] 创建 news sitemap (可选)
- [ ] 添加 image sitemap (可选)
- [ ] Google Search Console 完整审核

## 排除的页面
- ❌ `/contact` - 重新设计中
- ❌ `/jarvis-ai-suite` - 重新设计中

## 关键词要求
✅ **必须包含的核心关键词:**
- **品牌**: "isBIM", "isBIM Limited"
- **地理位置**: "Hong Kong", "香港", "Hong Kong AI company", "香港科技公司"
- **双重身份**:
  - "AI technology company" / "AI 科技公司"
  - "Construction technology company" / "建筑科技公司"
  - "AI construction technology" / "AI 建筑科技"
- **行业**: "ConTech", "construction AI", "building technology", "智能建筑"

## 注意事项
- 静态页面使用 `messages/en.json` 和 `messages/zh.json`
- 仅 Newsroom 和 Careers 使用 Sanity
- 针对 Google 和 Bing 优化
- Baidu 优化延后至未来阶段
- 所有页面元数据必须强调 isBIM 在香港的 AI + 建筑科技双重定位

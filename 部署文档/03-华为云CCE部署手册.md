# 华为云 CCE 部署手册

**最后更新：** 2026-03-20

## 1. 部署边界

当前仓库在华为云上部署的是一个 `Next.js SSR` 工作负载：

- `Ingress / ELB / CDN / WAF`
- `Service`
- `Deployment`
- `ConfigMap / Secret`

不在本仓库里部署的资源：

- Sanity 自建 CMS 容器
- Strapi 容器
- 邮件服务容器

也就是说，`Sanity`、`Resend`、`Brevo`、媒体 CDN 都是外部依赖。

## 2. 构建期与运行时的分工

### 2.1 构建期

来源：

- 推荐由 CI/CD 直接注入与 `.env.build.production` 同名的变量。
- 没有流水线时，可本地执行：

```bash
cp .env.build.example .env.build.production
./build.sh 0.1.0 production
```

构建期至少要锁定：

- `SWR_REGION`
- `SWR_ORG`
- `IMAGE_NAME`
- `DOCKER_PLATFORM`
- `PUSH_IMAGE`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_MEDIA_URL`
- `NEXT_PUBLIC_VIDEO_CDN_URL`
- `NEXT_PUBLIC_FEATURE_VIDEO_CDN_URL`

### 2.2 运行时

来源：

- `deploy/cce/configmap.yaml`
- `deploy/cce/secret.yaml`

至少要补齐：

- `NODE_ENV`
- `SANITY_API_TOKEN`
- `SANITY_WEBHOOK_SECRET`
- `EMAIL_PROVIDER`
- `CONTACT_EMAIL_TO`
- `EMAIL_FROM_INTERNAL`
- `EMAIL_FROM_USER`
- `RESEND_API_KEY`
- `BREVO_API_KEY`

按需补齐：

- `RATE_LIMIT_REDIS_URL`
- `NEXT_CACHE_DIR`

## 3. 发布前准备

1. 确认 SWR 仓库已经创建。
2. 确认 CCE 命名空间、ServiceAccount、镜像拉取密钥策略与 `deploy/cce/*` 一致。
3. 确认 `www.isbim.com.hk` 对应的 TLS 证书和 Ingress Host 已补成真实值。
4. 确认外网出口允许访问：
   - `*.sanity.io`
   - Resend API
   - Brevo API
   - 视频/媒体 CDN 或 OBS 回源域名
5. 确认当前仍按单副本运行；如果要多副本，先完成 Redis / DCS 方案。

## 4. 构建并推送镜像

```bash
cp .env.build.example .env.build.production
./build.sh 0.1.0 production
```

如果要推送：

- 把 `.env.build.production` 中的 `PUSH_IMAGE` 改成 `true`
- 填好真实 `SWR_REGION` 和 `SWR_ORG`

## 5. 准备 CCE 清单

```bash
cp deploy/cce/secret.example.yaml deploy/cce/secret.yaml
```

至少编辑这些文件：

- `deploy/cce/configmap.yaml`
- `deploy/cce/secret.yaml`
- `deploy/cce/kustomization.yaml`
- `deploy/cce/ingress.yaml`

要点：

- `kustomization.yaml` 的 `images` 要对上刚推送的 SWR 镜像地址和 tag。
- `configmap.yaml` 应与构建期 `NEXT_PUBLIC_*` 保持一致，避免服务端和客户端口径分叉。
- `secret.yaml` 只放敏感值，不要提交回仓库。

## 6. 应用到集群

```bash
kubectl apply -k deploy/cce
```

推荐检查：

```bash
kubectl get pods -n isbim-web
kubectl get svc -n isbim-web
kubectl get ingress -n isbim-web
kubectl describe deployment isbim-web -n isbim-web
```

## 7. 发布后最少验证项

- `GET /api/revalidate` 返回健康 JSON。
- 首页和关键内容页可以正常访问。
- `/studio` 可以打开并连通 Sanity。
- 提交一条联络表单，确认：
  - 能写入 Sanity
  - 能发送内部通知邮件
  - 能发送用户确认邮件
- 图片和视频没有出现 404 或跨域/远程域名未放行问题。

## 8. 和 Jarvis `web` 的关键区别

- 这里没有 `cms` 容器，也没有第二套 `deploy/cce`。
- 这里不需要 `STRAPI_URL`、`STRAPI_API_TOKEN`、`STRAPI_WEBHOOK_SECRET`。
- 这里额外需要 `Sanity` 写入与 `Resend/Brevo` 邮件发送相关变量。

# 本地 Docker 部署手册

**最后更新：** 2026-03-20

## 1. 适用场景

这份手册用于本地验证容器镜像，而不是华为云 CCE 正式发布。

适合的场景：

- 想确认 `Dockerfile` 是否能独立构建。
- 想验证 `NEXT_PUBLIC_*` 构建期变量与运行时变量是否分层正确。
- 想在本机复现“和线上接近”的 SSR 容器运行方式。

## 2. 先准备两个文件

```bash
cp .env.build.example .env.build.local
cp .env.runtime.example .env.runtime
```

填写原则：

- `.env.build.local` 只放镜像构建期需要的值，尤其是 `SWR_*` 和 `NEXT_PUBLIC_*`。
- `.env.runtime` 只放容器启动时需要的值，例如 `SANITY_API_TOKEN`、`SANITY_WEBHOOK_SECRET`、邮件服务变量。

## 3. 本地构建镜像

```bash
./build.sh 0.1.0 local
```

说明：

- 这会优先读取 `.env.build.local`。
- 生成的本地镜像标签是 `isbim-official-web:0.1.0-local`。
- 如果你只是本地验证，不必把 `PUSH_IMAGE` 改成 `true`。

## 4. 本地运行容器

```bash
docker run --rm -p 3000:3000 --env-file .env.runtime isbim-official-web:0.1.0-local
```

然后访问：

- 站点主页：`http://localhost:3000`
- Studio：`http://localhost:3000/studio`
- Webhook 健康检查：`http://localhost:3000/api/revalidate`

## 5. 什么时候必须重新构建

以下变量变化后，必须重新执行 `./build.sh`：

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_MEDIA_URL`
- `NEXT_PUBLIC_VIDEO_CDN_URL`
- `NEXT_PUBLIC_FEATURE_VIDEO_CDN_URL`

原因：

- 这些值会进入 `next build` 产物。
- 仅仅重启容器不会刷新浏览器端代码和 `next.config.ts` 中的远程资源配置。

## 6. 常见误区

- 不要把 `SANITY_API_TOKEN`、`RESEND_API_KEY` 这类运行时密钥写进 `.env.build.local`。
- 不要期望 `docker run --env-file .env.runtime` 能覆盖已经打进镜像的 `NEXT_PUBLIC_*`。
- 不要按 Jarvis 的方式去填 `STRAPI_URL`，isBIM 当前没有自建 Strapi/CMS 容器。

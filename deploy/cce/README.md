# isBIM Web CCE Deployment

This repository deploys one workload to Huawei Cloud CCE:

- `web`: the Next.js SSR container built from the root `Dockerfile`

Sanity is an external managed service. It is not a second containerized CMS workload in this repository. `/studio` is served by the same Next.js container.

## What Must Be Uploaded

For Huawei Cloud CCE, `Dockerfile` alone is not enough.

- `Dockerfile` defines how the application image is built
- SWR stores the built image
- CCE still needs Kubernetes manifests to run the image:
  `Deployment`, `Service`, `Ingress`, `ConfigMap`, `Secret`, and namespace/service-account wiring

This folder is that online deployment layer.

## Files

- `namespace.yaml`: target namespace
- `serviceaccount.yaml`: workload service account for SWR pull wiring
- `configmap.yaml`: non-secret runtime config
- `secret.example.yaml`: template for runtime secrets
- `deployment.yaml`: Next.js SSR workload
- `service.yaml`: ClusterIP service for the pod
- `ingress.yaml`: HTTP/TLS entry
- `kustomization.yaml`: apply all resources together

## Before Apply

1. Prepare build-time env values through CI/CD or by copying `.env.build.example` to `.env.build.production`.
2. Build and push the image to SWR with `./build.sh <version> production`.
3. Copy `secret.example.yaml` to `secret.yaml` and replace placeholders.
4. Update `kustomization.yaml` with the real SWR image path and tag.
5. Update `ingress.yaml` host, TLS secret name, and ingress class if your cluster does not use `nginx`.

## Recommended Flow

1. Build image in CI / CodeArts Build

Use the checked-in `Dockerfile` through `./build.sh` to build a standalone Next.js image and push it to SWR.

Example:

```bash
cp .env.build.example .env.build.production
./build.sh 0.1.0 production
```

2. Prepare runtime manifests

```bash
cp deploy/cce/secret.example.yaml deploy/cce/secret.yaml
```

Edit:

- `deploy/cce/secret.yaml`
- `deploy/cce/configmap.yaml`
- `deploy/cce/kustomization.yaml`
- `deploy/cce/ingress.yaml`

Runtime env here differs from Jarvis `web`:

- no Strapi variables
- includes `SANITY_API_TOKEN` / `SANITY_WEBHOOK_SECRET`
- includes `RESEND_API_KEY` / `BREVO_API_KEY` and email sender/recipient settings

3. Allow the service account to pull from SWR

If your namespace already uses CCE `default-secret`, you can keep the default service account and remove `serviceAccountName` from `deployment.yaml`.

If not, patch the dedicated service account:

```bash
kubectl patch serviceaccount isbim-web-swr -p '{"imagePullSecrets": [{"name": "default-secret"}]}' -n isbim-web
```

4. Apply to CCE

```bash
kubectl apply -k deploy/cce
```

## Runtime Notes

- `replicas` stays at `1` for now because contact-form rate limiting is still in-memory.
- `GET /api/revalidate` is used as the temporary HTTP probe because this repo does not yet have a dedicated `/api/health`.
- Runtime env in CCE does not replace build-time `NEXT_PUBLIC_*` values already compiled into the client bundle. If public URLs change, rebuild the image.
- More deployment context lives in `部署文档/03-华为云CCE部署手册.md` and `部署文档/05-环境变量参考.md`.

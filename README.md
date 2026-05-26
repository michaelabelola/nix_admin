# Suiteonix UI

This repository contains the Suiteonix admin and customer web apps.

## Docker Images

Build Docker images from the repository root so Bun can resolve the workspace packages.

### Admin

```sh
docker build \
  -f apps/admin/Dockerfile \
  --build-arg VITE_API_BASE_URL=https://api.suiteonix.com \
  -t suiteonix-admin .
```

Run the admin image:

```sh
docker run --rm -p 3000:80 suiteonix-admin
```

Open `http://localhost:3000`.

### Customer

```sh
docker build \
  -f apps/customer/Dockerfile \
  --build-arg VITE_API_BASE_URL=https://api.suiteonix.com \
  -t suiteonix-customer .
```

Run the customer image:

```sh
docker run --rm -p 3001:80 suiteonix-customer
```

Open `http://localhost:3001`.

## Configuration

`VITE_API_BASE_URL` is a build-time value. Rebuild the image when changing the API URL.

The container listens on port `80` by default. Override it with `PORT` only when the container runtime also maps the matching internal port.

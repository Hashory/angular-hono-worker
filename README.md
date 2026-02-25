# Angular + Hono + Cloudflare Workers

This project is a modern boilerplate integrating **Angular 21** and **Hono 4**, optimized for deployment as a **Cloudflare Worker**.

## Architecture Overview

Hono serves as the main entry point and handles:
1. **API Routes**: All requests under `/api` are handled by Hono.
2. **OpenAPI**: Automatic documentation generation using `hono-openapi`.
3. **Angular SSR**: All other routes are delegated to the `AngularAppEngine` for Server-Side Rendering.

## Key Features

- 🚀 **Angular 21**: Latest features and performance.
- 🔥 **Hono 4**: Lightweight, fast, and extensible web framework.
- ☁️ **Cloudflare Workers**: Edge-first deployment.
- 📝 **OpenAPI Documentation**: Interactive API spec at `/api/openapi`.
- ✅ **Type-safe Validation**: Powered by `valibot`.
- 🧪 **Vitest**: Fast unit testing.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS)
- [pnpm](https://pnpm.io/)

### Installation

```bash
pnpm install
```

### Development

To start the Angular development server (client-side only):
```bash
pnpm start
```

### Preview (Full Integration)

To test the full integration (Hono + Angular SSR + Cloudflare Worker environment) locally:
```bash
pnpm run preview
```
This runs `wrangler dev` against the built artifacts.

## API Usage

API routes are defined in `src/api/routes`.

- **Users**: `/api/users`
- **Posts**: `/api/posts`
- **OpenAPI Spec**: `/api/openapi`

Type-safe client generation is supported via Hono's `AppType`.

## Deployment

Deploy to Cloudflare Workers using Wrangler:

```bash
pnpm run deploy
```

## Related Commands

- `pnpm run build`: Build both browser and server artifacts.
- `pnpm run test`: Run unit tests with Vitest.
- `pnpm run cf-typegen`: Generate Cloudflare Worker types from `wrangler.jsonc`.

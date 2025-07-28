# PairDish

A Cloudflare Workers application for intelligent dish pairing suggestions.

## Development

```txt
npm install
npm run dev
```

## Deployment

```txt
npm run deploy
```

## Type Generation

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiating `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```

## Deployment Status

- **Last Update**: July 28, 2025
- **Platform**: Cloudflare Workers
- **Auto-deploy**: Enabled via GitHub integration

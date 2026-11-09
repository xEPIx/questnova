# QuestNova

Automated gaming utility platform. Next.js 15 + TypeScript + Tailwind, deployed on Cloudflare Pages.

## Development
npm install
npm run dev

## Build
npm run build
npm run lint

## Cloudflare Pages Deployment
- Build command: `npm run build`
- Output directory: `.next`
- Node version: 20
- For Pages Functions support use `@cloudflare/next-on-pages`: `npm run pages:build`

## Environment
Copy `.env.example` to `.env.local`.

## Phase Status
Phase 2 complete: Cloudflare-compatible config, sample dataset, SEO JSON-LD, codes/guide routes. Ready for Phase 3.

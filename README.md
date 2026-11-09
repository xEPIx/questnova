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

## Content Check
Run `npm run content:check` to validate freshness and sources.

## Tests
Run `npm test`.

## Phase Status
Phase 11 complete: calculator framework (sample data, not live game data).

## Content Quality
Checks cover duplicate slugs, missing/invalid sources, freshness window, future dates, and page validity.

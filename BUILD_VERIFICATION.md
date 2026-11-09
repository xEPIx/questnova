# Build Verification

## Steps
1. npm install
2. npm run lint
3. npm run build
4. Verify routes: /, /games, /game/[slug], /game/[slug]/codes, /guide, /values
5. Verify /sitemap.xml and /robots.txt

## Cloudflare
- Static generation enabled for all game routes via generateStaticParams.
- No server-only APIs used.
- Images unoptimized for Pages compatibility.

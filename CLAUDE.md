# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Browser memory game ("絵画神経衰弱") where the player matches pairs of paintings by the same artist. SPA built with Vite + React 19 + TypeScript + Tailwind v4. No backend, no test suite.

UI strings and in-source comments are in Japanese — match that convention when editing.

## Commands

```bash
npm run dev        # Vite dev server
npm run build      # tsc -b && vite build (type-checks then builds to dist/)
npm run lint       # biome check .
npm run format     # biome format --write .
npm run preview    # Serve the production build
```

Biome is the single source of truth for lint + format (double quotes, 2-space indent). There is no ESLint/Prettier. `biome.json` excludes `dist/` and respects `.gitignore`.

TypeScript is configured strictly (`strict`, `noUnusedLocals`, `noUnusedParameters`, `noUncheckedSideEffectImports`). `npm run build` will fail on unused symbols.

## Deploy

Hosted on Cloudflare Pages, connected to this GitHub repo — pushing to `master` triggers an automatic build and deploy. There is no manual deploy step. Production URL: https://art-memory-game.tebukuro.me/

Note: `package-lock.json` must keep cross-platform optional deps (e.g. `@img/sharp-linux-*`) — an `npm install` that drops them breaks the Pages build (see commit 66ac7ab).

## Architecture

`src/App.tsx` is a thin shell; everything lives under `src/components/ArtMemoryGame.tsx`, which is purely view/layout. **All game state lives in `src/hooks/useMemoryGame.ts`**, which internally composes two smaller hooks:

- `useGameTimer` — starts on the first card click (`start()` is idempotent), `stop()` returns the final elapsed ms and freezes display.
- `useBestScores` — persists per-difficulty best records to `localStorage` under key `art-memory-best-scores`. Tracks **fewest turns** and **fastest time** independently (a result can beat one without beating the other).

The flow per turn lives in `useMemoryGame.handleCardClick`:
1. Reject clicks on already-matched / already-flipped cards, or when 2 are already up.
2. On the 2nd flip, increment `turns`. Compare `cards[i].author` of the two flipped indexes.
3. Match → push author to `matchedPairs`, fire `feedback: "match"` (green pulse, 900ms), clear `flippedIndexes` immediately. If all pairs matched → stop timer, call `recordResult`, set `gameOver`.
4. Mismatch → fire `feedback: "mismatch"` (red ring + shake, 1500ms), then clear `flippedIndexes`.

`feedback` (transient animation hint) is separate from `flippedIndexes` (logical state) on purpose — don't merge them.

## Card data & selection

`src/data/artworkData.ts` is a hand-maintained list of `Artwork` records (id, author, title, image path, thumbnail path, original width/height). Each artist must have **≥ 2 works** to be eligible for selection.

`selectRandomArtworks(numPairs)` (in `src/utils/selectArtworks.ts`) groups by `author`, filters to eligible artists, picks `numPairs` artists at random, then 2 works per artist. Pair identity is **the author string**, not artwork id — `useMemoryGame` keys matches by `card.author`.

Use the Fisher–Yates `shuffle` in `src/utils/shuffle.ts`. The file's leading comment explicitly warns against `.sort(() => Math.random() - 0.5)` because it produces biased orderings.

## Images

Images live in `public/images/` and are referenced by absolute paths like `/images/foo.webp`. Each `Artwork` needs both a full-size WebP and a `-thumb.webp` variant.

`npm run process-images` (script in `scripts/process-images.mjs`, uses `sharp`) does both jobs: converts any new `.jpg/.jpeg/.png` in `public/images/` to WebP (q80) + a `-thumb.webp` variant (max 200×200, q60), deletes the source `.jpg/.jpeg/.png` after both WebP files exist, then scans `artworkData.ts` and prints ready-to-paste entry templates for any WebP that isn't yet registered. Width/height are read from the WebP; `author` and `title` come out as `"TODO"` for you to fill in. Conversion is idempotent — existing WebPs are skipped, but matching source files are still removed. `Card.tsx` uses `originalWidth`/`originalHeight` to preserve aspect ratio when fitting into a 220×180 box.

### Adding new artwork (Wikipedia → process-images → artworkData.ts)

Standard workflow when adding paintings. Only use sources that are **public domain** (artist died before ~1955, depending on jurisdiction) — works under copyright (Picasso, Dalí, etc.) must not be added.

1. **Find the Wikimedia Commons file URL.** Open the painting's Wikipedia article and locate the infobox image. The displayed thumbnail URL looks like `https://upload.wikimedia.org/wikipedia/commons/thumb/X/YY/FILENAME.jpg/500px-FILENAME.jpg`. Strip `/thumb/` and the trailing `/NNNpx-...` segment to get the full-resolution file: `https://upload.wikimedia.org/wikipedia/commons/X/YY/FILENAME.jpg`.
2. **Download with curl.** Wikimedia requires a descriptive User-Agent. Save as `<artist>_<work>.jpg` in `public/images/` using ASCII snake_case (e.g. `millet_gleaners.jpg`, `raffaello_atene.jpg`). One artist = one prefix.
   ```bash
   curl -sSL -A "art-memory-game/1.0 (contact@example.com)" \
     -o public/images/millet_gleaners.jpg \
     "https://upload.wikimedia.org/wikipedia/commons/1/1f/Jean-Fran%C3%A7ois_Millet_-_Gleaners_-_Google_Art_Project_2.jpg"
   ```
3. **Run `npm run process-images`.** Generates `.webp` + `-thumb.webp`, deletes the downloaded source image, and prints entry templates with `author: "TODO"`, `title: "TODO"`, and auto-detected dimensions. Note the assigned IDs — they are `max(existing id) + 1, +2, ...`.
4. **Paste the templates into `src/data/artworkData.ts`** and fill in `author` / `title`. Conventions:
   - `author`: full Japanese name (e.g. `"ジャン=フランソワ・ミレー"`, `"ラファエロ・サンティ"`). The author string is the pair key, so it must match exactly across all works by the same artist.
   - `title`: Japanese name followed by the original title in parentheses (e.g. `"落穂拾い (Des glaneuses)"`). Japanese-origin works use Japanese only (e.g. `"神奈川沖浪裏"`).
   - Group entries by artist with a `// 画家名の作品 - 短い説明` comment above the block, matching existing style.
5. **Keep IDs contiguous.** If you notice a gap (e.g. someone deleted an entry), renumber to close it — IDs aren't referenced from anywhere else, but the file is hand-maintained so gaps invite mistakes.
6. **Verify with `npm run build`.** The strict `tsc -b` will catch any missing field; biome check runs via `npm run lint`.

## Styling

Tailwind v4 is wired via `@tailwindcss/vite`; the only CSS entry is `src/index.css` (`@import "tailwindcss"` + a handful of custom utilities). The custom classes are load-bearing:

- `perspective-1000`, `preserve-3d`, `backface-hidden`, `rotateY-180` — required for the 3D card flip in `Card.tsx`. The "front" of the card is pre-rotated 180° so the flip animation reveals it.
- `animate-match-pulse`, `animate-mismatch-shake`, `animate-banner-fade` — feedback animations whose durations are coupled to JS `setTimeout`s in `useMemoryGame.ts` and `ArtMemoryGame.tsx`. If you change a duration, update both places.

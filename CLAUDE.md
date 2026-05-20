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

Source images live in `public/images/` and are referenced by absolute paths like `/images/foo.webp`. Each `Artwork` needs both a full-size and a `-thumb` variant.

`npm run process-images` (script in `scripts/process-images.mjs`, uses `sharp`) does both jobs: converts any new `.jpg/.jpeg/.png` in `public/images/` to WebP (q80) + a `-thumb.webp` variant (max 200×200, q60), then scans `artworkData.ts` and prints ready-to-paste entry templates for any WebP that isn't yet registered. Width/height are read from the image; `author` and `title` come out as `"TODO"` for you to fill in. Conversion is idempotent — existing WebPs are skipped. `Card.tsx` uses `originalWidth`/`originalHeight` to preserve aspect ratio when fitting into a 220×180 box.

## Styling

Tailwind v4 is wired via `@tailwindcss/vite`; the only CSS entry is `src/index.css` (`@import "tailwindcss"` + a handful of custom utilities). The custom classes are load-bearing:

- `perspective-1000`, `preserve-3d`, `backface-hidden`, `rotateY-180` — required for the 3D card flip in `Card.tsx`. The "front" of the card is pre-rotated 180° so the flip animation reveals it.
- `animate-match-pulse`, `animate-mismatch-shake`, `animate-banner-fade` — feedback animations whose durations are coupled to JS `setTimeout`s in `useMemoryGame.ts` and `ArtMemoryGame.tsx`. If you change a duration, update both places.

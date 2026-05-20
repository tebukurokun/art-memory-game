# AGENTS.md

This file provides guidance to Codex and other coding agents when working with code in this repository.

## Project

Browser memory game ("絵画神経衰弱") where the player matches pairs of paintings by the same artist. SPA built with Vite + React 19 + TypeScript + Tailwind v4. No backend, no test suite.

UI strings and in-source comments are in Japanese. Match that convention when editing.

## Commands

```bash
npm run dev        # Vite dev server
npm run build      # tsc -b && vite build (type-checks then builds to dist/)
npm run lint       # biome check .
npm run format     # biome format --write .
npm run preview    # Serve the production build
```

Biome is the single source of truth for lint + format: double quotes and 2-space indent. There is no ESLint or Prettier. `biome.json` excludes `dist/` and respects `.gitignore`.

TypeScript is configured strictly: `strict`, `noUnusedLocals`, `noUnusedParameters`, and `noUncheckedSideEffectImports`. `npm run build` fails on unused symbols.

## Architecture

`src/App.tsx` is a thin shell. Most UI and layout live under `src/components/ArtMemoryGame.tsx`. All game state lives in `src/hooks/useMemoryGame.ts`, which internally composes two smaller hooks:

- `useGameTimer`: starts on the first card click. `start()` is idempotent. `stop()` returns the final elapsed ms and freezes display.
- `useBestScores`: persists per-difficulty best records to `localStorage` under key `art-memory-best-scores`. Tracks fewest turns and fastest time independently, so a result can beat one record without beating the other.

The flow per turn lives in `useMemoryGame.handleCardClick`:

1. Reject clicks on already-matched or already-flipped cards, or when two cards are already up.
2. On the second flip, increment `turns`. Compare `cards[i].author` of the two flipped indexes.
3. Match: push author to `matchedPairs`, fire `feedback: "match"` for the green pulse, clear `flippedIndexes` immediately. If all pairs matched, stop timer, call `recordResult`, and set `gameOver`.
4. Mismatch: fire `feedback: "mismatch"` for the red ring and shake, then clear `flippedIndexes` after the timeout.

`feedback` is a transient animation hint. `flippedIndexes` is logical state. Keep them separate.

## Card Data And Selection

`src/data/artworkData.ts` is a hand-maintained list of `Artwork` records: `id`, `author`, `title`, `imagePath`, `thumbnailPath`, `originalWidth`, and `originalHeight`. Each artist must have at least two works to be eligible for selection.

`selectRandomArtworks(numPairs)` in `src/utils/selectArtworks.ts` groups by `author`, filters to eligible artists, picks `numPairs` artists at random, then picks two works per artist. Pair identity is the author string, not artwork id. `useMemoryGame` keys matches by `card.author`.

Use the Fisher-Yates `shuffle` in `src/utils/shuffle.ts`. Its leading comment explicitly warns against `.sort(() => Math.random() - 0.5)` because it produces biased orderings.

## Images

Images live in `public/images/` and are referenced by absolute paths such as `/images/foo.webp`. Each `Artwork` needs both a full-size WebP and a `-thumb.webp` variant.

`npm run process-images` runs `scripts/process-images.mjs`, which uses `sharp` to:

- Convert new `.jpg`, `.jpeg`, and `.png` files in `public/images/` to WebP at q80.
- Generate `-thumb.webp` variants at max 200x200 and q60.
- Delete the source `.jpg`, `.jpeg`, or `.png` after both WebP files exist.
- Scan `artworkData.ts` and print ready-to-paste entry templates for WebP files not yet registered.

Conversion is idempotent; existing WebPs are skipped, but matching source files are still removed. Width and height are read from the WebP. Generated templates use `author: "TODO"` and `title: "TODO"` for manual completion. `Card.tsx` uses `originalWidth` and `originalHeight` to preserve aspect ratio when fitting into a 220x180 box.

### Adding New Artwork

Standard workflow for adding paintings from Wikipedia or Wikimedia Commons:

1. Use only public-domain sources. Avoid works still under copyright.
2. Find the Wikimedia Commons file URL. If the displayed thumbnail URL contains `/thumb/` and a trailing `/NNNpx-...` segment, strip those parts to get the full-resolution file URL.
3. Download with `curl` using a descriptive User-Agent. Save as `<artist>_<work>.jpg` in `public/images/` with ASCII snake_case. Use one artist prefix consistently.
4. Run `npm run process-images`; it deletes the downloaded source image after generating the WebP files.
5. Paste the printed templates into `src/data/artworkData.ts` and fill in `author` and `title`.
6. Keep IDs contiguous. IDs are not referenced elsewhere, but the file is hand-maintained and gaps invite mistakes.
7. Verify with `npm run build`; run `npm run lint` for Biome checks.

Conventions for `artworkData.ts`:

- `author`: full Japanese name, such as `"ジャン=フランソワ・ミレー"` or `"ラファエロ・サンティ"`. The author string is the pair key, so it must match exactly across all works by the same artist.
- `title`: Japanese name followed by the original title in parentheses, such as `"落穂拾い (Des glaneuses)"`. Japanese-origin works use Japanese only, such as `"神奈川沖浪裏"`.
- Group entries by artist with a `// 画家名の作品 - 短い説明` comment above the block, matching existing style.

## Styling

Tailwind v4 is wired via `@tailwindcss/vite`. The only CSS entry is `src/index.css`, which imports Tailwind and defines a handful of custom utilities.

The custom classes are load-bearing:

- `perspective-1000`, `preserve-3d`, `backface-hidden`, `rotateY-180`: required for the 3D card flip in `Card.tsx`. The front of the card is pre-rotated 180 degrees so the flip animation reveals it.
- `animate-match-pulse`, `animate-mismatch-shake`, `animate-banner-fade`: feedback animations whose durations are coupled to JavaScript `setTimeout`s in `useMemoryGame.ts` and `ArtMemoryGame.tsx`. If changing an animation duration, update both CSS and JS.

## Working Rules

- Keep changes scoped to the requested behavior and the existing architecture.
- Preserve Japanese UI copy and Japanese source comments.
- Prefer existing hooks, utilities, and Tailwind patterns over introducing new abstractions.
- Do not merge `feedback` and `flippedIndexes`.
- Run `npm run build` after TypeScript or game-logic changes when practical.
- Run `npm run lint` after style or formatting-sensitive changes when practical.

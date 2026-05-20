#!/usr/bin/env node
// public/images/ にある画像を WebP に変換し、artworkData.ts に未登録のものは
// エントリ雛形を標準出力に出す。jpg/jpeg/png → .webp と -thumb.webp を生成する。
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const IMAGES_DIR = "public/images";
const DATA_FILE = "src/data/artworkData.ts";
const SOURCE_EXTS = new Set([".jpg", ".jpeg", ".png"]);
const QUALITY = 80;
const THUMB_QUALITY = 60;
const THUMB_MAX = 200;

const allFiles = readdirSync(IMAGES_DIR);

// 1) ソース画像（jpg/jpeg/png）を WebP とサムネに変換（既存ファイルはスキップ）
const sources = allFiles.filter((f) =>
  SOURCE_EXTS.has(extname(f).toLowerCase()),
);
for (const src of sources) {
  const stem = basename(src, extname(src));
  const srcPath = join(IMAGES_DIR, src);
  const webpPath = join(IMAGES_DIR, `${stem}.webp`);
  const thumbPath = join(IMAGES_DIR, `${stem}-thumb.webp`);

  if (!existsSync(webpPath)) {
    console.log(`Converting ${src} -> ${stem}.webp`);
    await sharp(srcPath).webp({ quality: QUALITY }).toFile(webpPath);
  }
  if (!existsSync(thumbPath)) {
    console.log(`Creating thumbnail ${stem}-thumb.webp`);
    await sharp(srcPath)
      .resize(THUMB_MAX, THUMB_MAX, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: THUMB_QUALITY })
      .toFile(thumbPath);
  }
}

// 2) artworkData.ts に未登録の .webp を検出し、エントリ雛形を生成
const dataSource = readFileSync(DATA_FILE, "utf8");
const referencedPaths = new Set(
  [...dataSource.matchAll(/image:\s*"([^"]+)"/g)].map((m) => m[1]),
);
const existingIds = [...dataSource.matchAll(/id:\s*(\d+)/g)].map((m) =>
  Number(m[1]),
);
let nextId = existingIds.length ? Math.max(...existingIds) + 1 : 1;

const webps = readdirSync(IMAGES_DIR)
  .filter((f) => f.endsWith(".webp") && !f.endsWith("-thumb.webp"))
  .sort();

const newEntries = [];
for (const webp of webps) {
  const stem = basename(webp, ".webp");
  const imagePath = `/images/${webp}`;
  const thumbPath = `/images/${stem}-thumb.webp`;
  if (referencedPaths.has(imagePath)) continue;

  const meta = await sharp(join(IMAGES_DIR, webp)).metadata();
  newEntries.push(
    [
      "  {",
      `    id: ${nextId++},`,
      `    author: "TODO",`,
      `    title: "TODO",`,
      `    image: "${imagePath}",`,
      `    thumbnailImage: "${thumbPath}",`,
      `    originalWidth: ${meta.width},`,
      `    originalHeight: ${meta.height},`,
      "  },",
    ].join("\n"),
  );
}

if (newEntries.length === 0) {
  console.log("\nartworkData.ts is up to date — no new entries.");
} else {
  console.log(
    `\n// ${newEntries.length} new entr${newEntries.length === 1 ? "y" : "ies"} — add to ${DATA_FILE}:\n`,
  );
  console.log(newEntries.join("\n"));
}

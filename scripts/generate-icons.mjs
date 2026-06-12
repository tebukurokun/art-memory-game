// public/icon.svg からスマートフォン向けの PNG アイコンを生成するスクリプト
// - apple-touch-icon.png (180x180): iOS ホーム画面用。透過は黒く塗られるため不透明背景にする
// - icon-192.png / icon-512.png: Android ホーム画面 (site.webmanifest) 用。
//   maskable 対応のため、アイコン本体はセーフゾーン内 (中央約 62%) に収める

import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const publicDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
);
const svgPath = path.join(publicDir, "icon.svg");

// theme-color (index.html) と揃えた背景色
const background = "#111827";

async function generate(filename, size, iconRatio) {
  const iconSize = Math.round(size * iconRatio);
  const icon = await sharp(svgPath, { density: 300 })
    .resize(iconSize, iconSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background,
    },
  })
    .composite([{ input: icon, gravity: "centre" }])
    .png()
    .toFile(path.join(publicDir, filename));

  console.log(`generated: ${filename} (${size}x${size})`);
}

await generate("apple-touch-icon.png", 180, 0.72);
await generate("icon-192.png", 192, 0.62);
await generate("icon-512.png", 512, 0.62);

#!/bin/bash
# convert-images.sh

# 画像ディレクトリに移動
cd public/images

# JPG/JPEG画像をWebPに変換
echo "Converting JPG images to WebP..."
for file in *.jpg *.jpeg; do
  [ -f "$file" ] || continue
  echo "Converting $file"
  cwebp -q 80 "$file" -o "${file%.*}.webp"
done

# PNG画像をWebPに変換
echo "Converting PNG images to WebP..."
for file in *.png; do
  [ -f "$file" ] || continue
  echo "Converting $file"
  cwebp -q 80 "$file" -o "${file%.*}.webp"
done

# サムネイル作成
echo "Creating thumbnails..."
for file in *.webp; do
  [ -f "$file" ] || continue
  if [[ "$file" != *"-thumb.webp" ]]; then
    echo "Creating thumbnail for $file"
    convert "$file" -resize "200x200>" -quality 60 "${file%.webp}-thumb.webp"
  fi
done

echo "All done!"

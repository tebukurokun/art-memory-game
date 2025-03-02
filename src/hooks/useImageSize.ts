import { useState, useEffect } from "react";

interface ImageSize {
  width: number;
  height: number;
}

/**
 * カスタムフック: 実際の画像サイズを取得する
 *
 * このフックは画像URLからその実際のサイズを取得します。
 * 画像がロードできない場合は、デフォルトサイズかフォールバックを使用します。
 */
export const useImageSize = (
  imageUrl: string,
  defaultWidth: number,
  defaultHeight: number
): ImageSize => {
  const [size, setSize] = useState<ImageSize>({
    width: defaultWidth,
    height: defaultHeight,
  });

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();

    img.onload = () => {
      setSize({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      // エラー時はデフォルトサイズを使用
      console.warn(`Failed to load image: ${imageUrl}`);
      setSize({ width: defaultWidth, height: defaultHeight });
    };

    img.src = imageUrl;

    // クリーンアップ
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, defaultWidth, defaultHeight]);

  return size;
};

/**
 * 最大サイズに制限したディメンションを計算する関数
 */
export const calculateConstrainedSize = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  const aspectRatio = originalWidth / originalHeight;

  // 幅と高さのどちらを制限するか決定
  if (originalWidth / maxWidth > originalHeight / maxHeight) {
    // 横幅が制限要因
    return {
      width: maxWidth,
      height: Math.round(maxWidth / aspectRatio),
    };
  } else {
    // 高さが制限要因
    return {
      width: Math.round(maxHeight * aspectRatio),
      height: maxHeight,
    };
  }
};

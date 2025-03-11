// 作品データの型定義
export interface Artwork {
  id: number;
  author: string;
  title: string;
  image: string; // 高解像度画像（WebP形式）
  thumbnailImage: string; // 低解像度サムネイル画像（WebP形式）
  originalWidth: number;
  originalHeight: number;
}

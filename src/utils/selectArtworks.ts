import { allArtworkData } from "../data/artworkData";
import type { Artwork } from "../types";
import { shuffle } from "./shuffle";

/**
 * ランダムに指定された数の画家を選び、各画家から2枚の作品を含むデータセットを作成
 */
export const selectRandomArtworks = (numPairs: number): Artwork[] => {
  // 作家ごとに作品をグループ化
  const artistGroups: { [key: string]: Artwork[] } = {};
  allArtworkData.forEach((artwork) => {
    if (!artistGroups[artwork.author]) {
      artistGroups[artwork.author] = [];
    }
    artistGroups[artwork.author].push(artwork);
  });

  // 少なくとも2枚の作品がある画家のリストを作成
  const eligibleArtists = Object.keys(artistGroups).filter(
    (artist) => artistGroups[artist].length >= 2,
  );

  // ランダムに画家を選ぶ
  const selectedArtists = shuffle(eligibleArtists).slice(0, numPairs);

  // 各画家から2枚の作品を選ぶ
  const selected: Artwork[] = [];
  selectedArtists.forEach((artist) => {
    const artistWorks = shuffle(artistGroups[artist]).slice(0, 2);
    selected.push(...artistWorks);
  });

  return selected;
};

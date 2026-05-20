import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "art-memory-best-scores";

export interface BestRecord {
  turns: number;
  ms: number;
}

export type BestScores = Record<number, BestRecord>;

export interface RecordResult {
  turns: boolean;
  time: boolean;
}

export interface UseBestScores {
  bestScores: BestScores;
  recordResult: (difficulty: number, turns: number, ms: number) => RecordResult;
}

/**
 * 難易度別ベストスコアの読み書き。最少ターンと最短タイムを別々に保持する。
 */
export const useBestScores = (): UseBestScores => {
  const [bestScores, setBestScores] = useState<BestScores>({});

  // 初回マウント時にベストスコアを localStorage から復元
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        setBestScores(parsed as BestScores);
      }
    } catch {
      // パース失敗時は無視
    }
  }, []);

  const recordResult = useCallback(
    (difficulty: number, turns: number, ms: number): RecordResult => {
      const prev = bestScores[difficulty];
      const isBetterTurns = !prev || turns < prev.turns;
      const isBetterTime = !prev || ms < prev.ms;

      if (isBetterTurns || isBetterTime) {
        const next: BestRecord = {
          turns: prev ? Math.min(prev.turns, turns) : turns,
          ms: prev ? Math.min(prev.ms, ms) : ms,
        };
        const updated: BestScores = { ...bestScores, [difficulty]: next };
        setBestScores(updated);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // localStorage 不可（プライベートモード等）でも続行
        }
      }

      return { turns: isBetterTurns, time: isBetterTime };
    },
    [bestScores],
  );

  return { bestScores, recordResult };
};

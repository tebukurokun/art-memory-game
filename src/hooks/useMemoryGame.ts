import { useCallback, useEffect, useState } from "react";
import type { Artwork } from "../types";
import { selectRandomArtworks } from "../utils/selectArtworks";
import { shuffle } from "../utils/shuffle";
import { type BestScores, useBestScores } from "./useBestScores";
import { useGameTimer } from "./useGameTimer";

export interface CardFeedback {
  type: "match" | "mismatch";
  indexes: number[];
}

export interface NewRecord {
  turns: boolean;
  time: boolean;
}

export interface UseMemoryGame {
  cards: Artwork[];
  matchedPairs: string[];
  totalPairs: number;
  turns: number;
  elapsedMs: number;
  gameOver: boolean;
  lastMatch: string | null;
  feedback: CardFeedback | null;
  newRecord: NewRecord;
  bestScores: BestScores;
  isFlipped: (index: number) => boolean;
  isMatched: (index: number) => boolean;
  handleCardClick: (index: number) => void;
  resetGame: () => void;
  setLastMatch: (author: string | null) => void;
}

/**
 * 神経衰弱ゲームの状態と振る舞いを束ねるフック。
 * タイマーとベストスコア永続化を内部で合成する。
 */
export const useMemoryGame = (difficulty: number): UseMemoryGame => {
  const timer = useGameTimer();
  const { bestScores, recordResult } = useBestScores();

  const [cards, setCards] = useState<Artwork[]>([]);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [turns, setTurns] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [lastMatch, setLastMatch] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<CardFeedback | null>(null);
  const [newRecord, setNewRecord] = useState<NewRecord>({
    turns: false,
    time: false,
  });

  const totalPairs = cards.length / 2;

  const resetGame = useCallback((): void => {
    const selected = selectRandomArtworks(difficulty);
    setCards(shuffle(selected));
    setFlippedIndexes([]);
    setMatchedPairs([]);
    setTurns(0);
    setGameOver(false);
    setLastMatch(null);
    setFeedback(null);
    setNewRecord({ turns: false, time: false });
    timer.reset();
  }, [difficulty, timer]);

  const handleCardClick = useCallback(
    (index: number): void => {
      // すでにマッチしているカードや、裏返されているカードはクリックできない
      if (
        matchedPairs.includes(cards[index].author) ||
        flippedIndexes.includes(index) ||
        flippedIndexes.length >= 2
      ) {
        return;
      }

      // 最初のカードクリックでタイマー開始（start は idempotent）
      timer.start();

      const newFlippedIndexes = [...flippedIndexes, index];
      setFlippedIndexes(newFlippedIndexes);

      if (newFlippedIndexes.length !== 2) return;

      const nextTurns = turns + 1;
      setTurns(nextTurns);

      const [firstIndex, secondIndex] = newFlippedIndexes;

      if (cards[firstIndex].author === cards[secondIndex].author) {
        // マッチ
        const matchedAuthor = cards[firstIndex].author;
        setMatchedPairs([...matchedPairs, matchedAuthor]);
        setLastMatch(matchedAuthor);
        setFlippedIndexes([]);

        setFeedback({ type: "match", indexes: [firstIndex, secondIndex] });
        setTimeout(() => setFeedback(null), 900);

        // 全ペア一致でクリア → タイム確定とベスト更新
        if (matchedPairs.length + 1 === totalPairs) {
          const finalMs = timer.stop();
          setGameOver(true);
          const result = recordResult(difficulty, nextTurns, finalMs);
          setNewRecord(result);
        }
      } else {
        // ミスマッチ：赤リング＋シェイクを発火し、少し待ってからカードを戻す
        setFeedback({ type: "mismatch", indexes: [firstIndex, secondIndex] });
        setTimeout(() => {
          setFlippedIndexes([]);
          setFeedback(null);
        }, 1500);
      }
    },
    [
      cards,
      flippedIndexes,
      matchedPairs,
      turns,
      totalPairs,
      difficulty,
      timer,
      recordResult,
    ],
  );

  const isMatched = useCallback(
    (index: number): boolean =>
      cards[index] ? matchedPairs.includes(cards[index].author) : false,
    [cards, matchedPairs],
  );

  const isFlipped = useCallback(
    (index: number): boolean =>
      flippedIndexes.includes(index) || isMatched(index),
    [flippedIndexes, isMatched],
  );

  // 難易度変更／初回マウントでゲームを初期化
  // biome-ignore lint/correctness/useExhaustiveDependencies: difficulty 変更時のみリセット
  useEffect(() => {
    resetGame();
  }, [difficulty]);

  return {
    cards,
    matchedPairs,
    totalPairs,
    turns,
    elapsedMs: timer.elapsedMs,
    gameOver,
    lastMatch,
    feedback,
    newRecord,
    bestScores,
    isFlipped,
    isMatched,
    handleCardClick,
    resetGame,
    setLastMatch,
  };
};

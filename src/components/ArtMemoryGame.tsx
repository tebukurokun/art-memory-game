import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useMemoryGame } from "../hooks/useMemoryGame";
import type { Artwork } from "../types";
import { Card } from "./Card";
import { Controls } from "./Controls";
import { GameInstructions } from "./GameInstructions";
import { ImageModal } from "./ImageModal";
import { MatchToast } from "./MatchToast";
import { StatusBar } from "./StatusBar";
import { WinBanner } from "./WinBanner";

const ArtMemoryGame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<number>(6); // 6ペア（12枚）デフォルト
  const game = useMemoryGame(difficulty);

  // 拡大画像モーダル
  const [modalImage, setModalImage] = useState<Artwork | null>(null);
  const closeModal = useCallback(() => setModalImage(null), []);

  // マッチ通知バナーは数秒で自動的に消す（CSSアニメと尺を合わせる）
  useEffect(() => {
    if (!game.lastMatch) return;
    const timer = setTimeout(() => game.setLastMatch(null), 3000);
    return () => clearTimeout(timer);
  }, [game.lastMatch, game.setLastMatch]);

  // ESC でモーダルを閉じる
  useEffect(() => {
    if (!modalImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalImage, closeModal]);

  return (
    <div className="min-h-screen w-full bg-[#f4f1ea] text-stone-900">
      <main className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <header className="mb-4 w-full border-b border-stone-300/80 pb-4 sm:mb-6 sm:pb-5">
          <p className="text-xs font-semibold tracking-[0.18em] text-stone-500">
            ART MEMORY GAME
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-stone-950 sm:text-4xl">
                絵画神経衰弱
              </h1>
              <p className="mt-1 text-sm leading-6 text-stone-600 sm:mt-2 sm:text-base">
                作者でそろえる、静かな展示室のカードゲーム
              </p>
            </div>
            <p className="hidden text-sm text-stone-500 sm:block">
              作品を開き、同じ画家のペアを見つけます
            </p>
          </div>
        </header>

        <section className="mb-4 flex w-full max-w-6xl flex-col gap-3 rounded border border-stone-300/80 bg-white/70 p-3 shadow-[0_18px_50px_rgba(68,64,60,0.10)] backdrop-blur sm:mb-6 sm:p-4 lg:flex-row lg:items-stretch lg:justify-between">
          <StatusBar
            turns={game.turns}
            elapsedMs={game.elapsedMs}
            matchedCount={game.matchedPairs.length}
            totalPairs={game.totalPairs}
            bestRecord={game.bestScores[difficulty]}
          />
          <Controls
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            onNewGame={game.resetGame}
          />
        </section>

        {game.lastMatch && (
          <MatchToast key={game.lastMatch} author={game.lastMatch} />
        )}

        {game.gameOver && (
          <WinBanner
            turns={game.turns}
            elapsedMs={game.elapsedMs}
            newRecord={game.newRecord}
          />
        )}

        <section className="w-full border-t border-stone-300/80 pt-4 sm:pt-6">
          <div className="grid w-full grid-cols-3 gap-x-2 gap-y-4 px-1 sm:gap-x-3 sm:gap-y-8 lg:grid-cols-4 xl:grid-cols-6">
            {game.cards.map((card, index) => {
              const flipped = game.isFlipped(index);
              const matched = game.isMatched(index);
              const isJustMatched =
                game.feedback?.type === "match" &&
                game.feedback.indexes.includes(index);
              const isJustMismatched =
                game.feedback?.type === "mismatch" &&
                game.feedback.indexes.includes(index);

              const onActivate = () => {
                if (flipped) {
                  setModalImage(card);
                } else {
                  game.handleCardClick(index);
                }
              };

              return (
                <Card
                  key={card.id}
                  card={card}
                  isFlipped={flipped}
                  isMatched={matched}
                  isJustMatched={isJustMatched}
                  isJustMismatched={isJustMismatched}
                  onActivate={onActivate}
                />
              );
            })}
          </div>
        </section>

        <GameInstructions />

        <ImageModal
          isOpen={modalImage !== null}
          image={modalImage}
          isMatched={
            modalImage ? game.matchedPairs.includes(modalImage.author) : false
          }
          onClose={closeModal}
        />
      </main>
    </div>
  );
};

export default ArtMemoryGame;

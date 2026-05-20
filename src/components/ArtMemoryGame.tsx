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
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen w-full">
      <h1 className="text-3xl font-bold mb-4">絵画神経衰弱</h1>

      <div className="mb-6 flex flex-wrap gap-4 justify-center w-full max-w-6xl">
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
      </div>

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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-full px-2">
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

      <GameInstructions />

      <ImageModal
        isOpen={modalImage !== null}
        image={modalImage}
        isMatched={
          modalImage ? game.matchedPairs.includes(modalImage.author) : false
        }
        onClose={closeModal}
      />
    </div>
  );
};

export default ArtMemoryGame;

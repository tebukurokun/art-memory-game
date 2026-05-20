import { calculateConstrainedSize } from "../hooks/useImageSize";
import type { Artwork } from "../types";

const MAX_WIDTH = 220;
const MAX_HEIGHT = 180;

interface CardProps {
  card: Artwork;
  isFlipped: boolean;
  isMatched: boolean;
  isJustMatched: boolean;
  isJustMismatched: boolean;
  onActivate: () => void;
}

export const Card: React.FC<CardProps> = ({
  card,
  isFlipped,
  isMatched,
  isJustMatched,
  isJustMismatched,
  onActivate,
}) => {
  // 縦横比を維持したまま最大サイズに収める
  const { width: cardWidth, height: cardHeight } = calculateConstrainedSize(
    card.originalWidth,
    card.originalHeight,
    MAX_WIDTH,
    MAX_HEIGHT,
  );

  // 親セルが狭いときは 100% まで縮み、aspect-ratio で縦横比を保つ
  const cardStyle = {
    width: `${cardWidth}px`,
    maxWidth: "100%",
    aspectRatio: `${cardWidth} / ${cardHeight}`,
  };

  return (
    <div className="cursor-pointer mb-8 flex flex-col items-center mx-auto w-full min-w-0">
      <button
        type="button"
        onClick={onActivate}
        className={`perspective-1000 p-0 m-0 border-0 bg-transparent appearance-none max-w-full transition-transform duration-200 ${
          !isFlipped ? "hover:-translate-y-1" : ""
        }`}
      >
        <div
          style={cardStyle}
          className={`relative ${isJustMatched ? "animate-match-pulse" : ""} ${
            isJustMismatched ? "animate-mismatch-shake" : ""
          }`}
        >
          <div
            className={`absolute inset-0 preserve-3d transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isFlipped ? "rotateY-180" : ""
            }`}
          >
            {/* 裏側（？マーク） */}
            <div className="absolute inset-0 backface-hidden flex items-center justify-center bg-blue-500 text-white font-bold rounded-lg shadow-md">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-500">
                ?
              </div>
            </div>

            {/* 表側（絵画）— 180°事前回転で裏面に貼り付け */}
            <div className="absolute inset-0 backface-hidden rotateY-180 flex items-center justify-center border-2 rounded-lg overflow-hidden bg-white shadow-md">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover cursor-zoom-in"
                title={`${card.title} by ${card.author}`}
              />
            </div>
          </div>
        </div>
      </button>

      {isMatched && (
        <div className="text-center mt-4 w-full max-w-full px-2">
          <p className="text-sm font-medium text-gray-900 break-words hyphens-auto overflow-hidden">
            {card.title}
          </p>
          <p className="text-xs text-gray-600 mt-1">by {card.author}</p>
        </div>
      )}
    </div>
  );
};

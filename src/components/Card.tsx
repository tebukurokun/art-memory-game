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
    <div className="mx-auto flex w-full min-w-0 cursor-pointer flex-col items-center">
      <button
        type="button"
        onClick={onActivate}
        className={`perspective-1000 m-0 max-w-full appearance-none border-0 bg-transparent p-0 transition-transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-700 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f4f1ea] ${
          !isFlipped ? "hover:-translate-y-1" : "hover:scale-[1.01]"
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
            <div className="absolute inset-0 backface-hidden flex items-center justify-center overflow-hidden rounded border border-stone-700 bg-[#1f1a17] p-3 text-stone-100 shadow-[0_16px_34px_rgba(68,64,60,0.22)]">
              <div className="absolute inset-[9px] border border-stone-100/40" />
              <div className="absolute inset-x-5 top-5 h-px bg-stone-100/35" />
              <div className="absolute inset-x-5 bottom-5 h-px bg-stone-100/35" />
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-100/60 bg-[#2b241f] text-2xl font-semibold">
                ?
              </div>
            </div>

            {/* 表側（絵画）— 180°事前回転で裏面に貼り付け */}
            <div className="absolute inset-0 backface-hidden rotateY-180 flex items-center justify-center overflow-hidden rounded border border-stone-300 bg-white p-2 shadow-[0_16px_34px_rgba(68,64,60,0.18)]">
              <img
                src={card.image}
                alt={card.title}
                className="h-full w-full cursor-zoom-in object-cover"
                title={`${card.title} by ${card.author}`}
              />
            </div>
          </div>
        </div>
      </button>

      {isMatched && (
        <div className="mt-3 w-full max-w-full px-2 text-center">
          <p className="overflow-hidden break-words text-sm font-semibold leading-5 text-stone-900 hyphens-auto">
            {card.title}
          </p>
          <p className="mt-1 text-xs text-stone-500">by {card.author}</p>
        </div>
      )}
    </div>
  );
};

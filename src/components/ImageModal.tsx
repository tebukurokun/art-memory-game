import type { Artwork } from "../types";

interface ImageModalProps {
  isOpen: boolean;
  image: Artwork | null;
  isMatched: boolean;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  image,
  isMatched,
  onClose,
}) => {
  if (!isOpen || !image) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleOverlayKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4"
      onClick={handleOverlayClick}
      onKeyDown={handleOverlayKeyDown}
    >
      <button
        type="button"
        aria-label="閉じる"
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-stone-950/70 text-xl leading-none text-white transition-colors hover:bg-stone-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        onClick={onClose}
      >
        ×
      </button>
      <div className="relative max-h-[90vh] max-w-4xl overflow-auto rounded border border-stone-300 bg-[#f8f6f0] p-2 shadow-2xl">
        <div className="p-4">
          <img
            src={image.image}
            alt={image.title}
            className="mx-auto max-h-[70vh] max-w-full object-contain shadow-[0_12px_30px_rgba(28,25,23,0.20)]"
          />

          {/* タイトルと画家名は正解した場合のみ表示 */}
          {isMatched && (
            <div className="mt-4 border-t border-stone-300 pt-4 text-center">
              <h3 className="text-xl font-bold text-stone-950">
                {image.title}
              </h3>
              <p className="text-lg text-stone-600">{image.author}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

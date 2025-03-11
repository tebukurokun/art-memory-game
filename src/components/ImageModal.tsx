import { Artwork } from "../types";

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

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center"
        onClick={onClose}
      >
        ×
      </button>
      <div
        className="relative bg-white p-2 rounded-lg max-w-4xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <img
            src={image.image}
            alt={image.title}
            className="max-w-full max-h-[70vh] object-contain mx-auto"
          />

          {/* タイトルと画家名は正解した場合のみ表示 */}
          {isMatched && (
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold">{image.title}</h3>
              <p className="text-lg text-gray-600">{image.author}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

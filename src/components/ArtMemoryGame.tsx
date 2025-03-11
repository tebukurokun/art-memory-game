import React, { useEffect, useState } from "react";
import { allArtworkData } from "../data/artworkData";
import { calculateConstrainedSize } from "../hooks/useImageSize";
import { Artwork } from "../types";
import { ImageModal } from "./ImageModal";

const ArtMemoryGame: React.FC = () => {
  // ゲームの状態
  const [cards, setCards] = useState<Artwork[]>([]);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [turns, setTurns] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [lastMatch, setLastMatch] = useState<string | null>(null); // 最後にマッチした作家
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [difficulty, setDifficulty] = useState<number>(6); // デフォルトは6ペア（12枚のカード）

  // 拡大画像モーダルの状態
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<Artwork | null>(null);

  /**
   * ランダムに指定された数の画家を選び、各画家から2枚の作品を含むデータセットを作成
   */
  const selectRandomArtworks = (numPairs: number): Artwork[] => {
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
      (artist) => artistGroups[artist].length >= 2
    );

    // ランダムに画家を選ぶ
    const selectedArtists = [...eligibleArtists]
      .sort(() => Math.random() - 0.5)
      .slice(0, numPairs);

    // 各画家から2枚の作品を選ぶ
    const selected: Artwork[] = [];
    selectedArtists.forEach((artist) => {
      // 画家の作品をランダムに並べ替えて最初の2枚を選択
      const artistWorks = [...artistGroups[artist]]
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      selected.push(...artistWorks);
    });

    return selected;
  };

  // ゲームの初期化
  const initializeGame = (numPairs: number = difficulty): void => {
    // ランダムに画家と作品を選択
    const selected = selectRandomArtworks(numPairs);
    setSelectedArtworks(selected);

    // 選んだカードをシャッフル
    const shuffledCards = [...selected].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedIndexes([]);
    setMatchedPairs([]);
    setTurns(0);
    setGameOver(false);
    setLastMatch(null);
  };

  // 難易度変更ハンドラー
  const handleDifficultyChange = (newDifficulty: number): void => {
    setDifficulty(newDifficulty);
    initializeGame(newDifficulty);
  };

  // 画像クリックでモーダル表示
  const handleImageClick = (e: React.MouseEvent, card: Artwork): void => {
    // イベントの伝搬を停止して、カードクリックイベントが発火しないようにする
    e.stopPropagation();
    // モーダルに表示する画像を設定
    setSelectedImage(card);
    // モーダルを開く
    setModalOpen(true);
  };

  // モーダルを閉じる
  const closeModal = (): void => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  // カードをクリックした時の処理
  const handleCardClick = (index: number): void => {
    // すでにマッチしているカードや、裏返されているカードはクリックできない
    if (
      matchedPairs.includes(cards[index].author) ||
      flippedIndexes.includes(index) ||
      flippedIndexes.length >= 2
    ) {
      return;
    }

    // カードを裏返す
    const newFlippedIndexes = [...flippedIndexes, index];
    setFlippedIndexes(newFlippedIndexes);

    // 2枚のカードがめくられた場合
    if (newFlippedIndexes.length === 2) {
      setTurns(turns + 1);

      const firstIndex = newFlippedIndexes[0];
      const secondIndex = newFlippedIndexes[1];

      // 作者が同じかチェック
      if (cards[firstIndex].author === cards[secondIndex].author) {
        // マッチした場合
        setMatchedPairs([...matchedPairs, cards[firstIndex].author]);

        // マッチした作家を状態に保存
        const matchedAuthor = cards[firstIndex].author;
        setLastMatch(matchedAuthor);

        // マッチしたカードのインデックスをリセット
        setFlippedIndexes([]);

        // すべてのペアがマッチしたらゲーム終了
        if (matchedPairs.length + 1 === selectedArtworks.length / 2) {
          setGameOver(true);
        }
      } else {
        // マッチしなかった場合は少し待ってからカードを戻す
        setTimeout(() => {
          setFlippedIndexes([]);
        }, 1500); // 少し長めに表示
      }
    }
  };

  // カードが表か裏かを判定
  const isFlipped = (index: number): boolean => {
    return (
      flippedIndexes.includes(index) ||
      matchedPairs.includes(cards[index].author)
    );
  };

  // 初回レンダリング時にのみゲームを初期化
  useEffect(() => {
    initializeGame(difficulty);
  }, []);

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalOpen) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalOpen]);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen w-full">
      <h1 className="text-3xl font-bold mb-4">絵画神経衰弱</h1>

      <div className="mb-6 flex flex-wrap gap-4 justify-center w-full max-w-6xl">
        <div className="bg-white px-4 py-2 rounded-lg shadow">
          <p className="text-lg font-medium">
            ターン数: <span className="text-blue-600 font-bold">{turns}</span>
          </p>
        </div>

        <div className="bg-white px-4 py-2 rounded-lg shadow">
          <p className="text-lg font-medium">
            マッチ:{" "}
            <span className="text-green-600 font-bold">
              {matchedPairs.length}/{selectedArtworks.length / 2}
            </span>
          </p>
        </div>

        {/* 難易度選択 */}
        <div className="bg-white px-4 py-2 rounded-lg shadow flex items-center">
          <span className="mr-2">難易度:</span>
          <select
            value={difficulty}
            onChange={(e) => handleDifficultyChange(Number(e.target.value))}
            className="border rounded py-1 px-2"
          >
            <option value="3">初級 (3ペア)</option>
            <option value="6">中級 (6ペア)</option>
            <option value="8">上級 (8ペア)</option>
            <option value="10">エキスパート (10ペア)</option>
          </select>
        </div>

        <button
          onClick={() => initializeGame(difficulty)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
        >
          リセット
        </button>
      </div>

      {/* 最後にマッチした作家の情報表示 */}
      {lastMatch && (
        <div className="mb-6 py-2 px-4 bg-green-100 text-green-800 rounded-lg shadow-md max-w-lg w-full text-center">
          <p className="text-base">
            <span className="font-bold">{lastMatch}</span>{" "}
            の作品を見つけました！
          </p>
        </div>
      )}

      {gameOver && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg shadow-lg text-center max-w-lg w-full">
          <h2 className="text-xl font-bold mb-2">おめでとうございます！</h2>
          <p className="text-lg">{turns}ターンでクリアしました！</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-full px-2">
        {cards.map((card, index) => {
          // 最大サイズの制限
          const MAX_WIDTH = 220;
          const MAX_HEIGHT = 180;

          // 縦横比を維持しながら最大サイズに収まるようにサイズを計算
          const { width: cardWidth, height: cardHeight } =
            calculateConstrainedSize(
              card.originalWidth,
              card.originalHeight,
              MAX_WIDTH,
              MAX_HEIGHT
            );

          // スタイルオブジェクト
          const cardStyle = {
            width: `${cardWidth}px`,
            height: `${cardHeight}px`,
          };

          return (
            <div
              key={card.id}
              className="cursor-pointer perspective-1000 mb-8 flex flex-col items-center mx-auto"
              onClick={() => handleCardClick(index)}
            >
              <div
                style={cardStyle}
                className="relative transition-all duration-500"
              >
                {/* カードの表側（絵画のみ表示） */}
                <div
                  className={`absolute w-full h-full flex items-center justify-center border-2 rounded-lg overflow-hidden bg-white transform ${
                    isFlipped(index)
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0 rotateY-180"
                  }`}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover cursor-zoom-in"
                    title={`${card.title} by ${card.author}`}
                    onClick={(e) =>
                      isFlipped(index) && handleImageClick(e, card)
                    }
                  />
                </div>

                {/* カードの裏側 */}
                <div
                  className={`absolute w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold rounded-lg transform ${
                    isFlipped(index)
                      ? "opacity-0 z-0 rotateY-180"
                      : "opacity-100 z-10"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-500">
                    ?
                  </div>
                </div>
              </div>

              {/* 作品名と画家名を表示（マッチした場合のみ） */}
              {matchedPairs.includes(cards[index].author) && (
                <div className="text-center mt-4 w-full max-w-full px-2">
                  <p className="text-sm font-medium text-gray-900 break-words hyphens-auto overflow-hidden">
                    {card.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">by {card.author}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-yellow-100 rounded-lg shadow max-w-6xl w-full">
        <h2 className="text-xl font-bold mb-2">遊び方</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>カードをクリックして、同じ作者の絵画のペアを見つけてください</li>
          <li>
            各カードは絵画の縦横比を維持し、最大サイズ内に収まるよう調整されています
          </li>
          <li>正解すると、作品のタイトルと画家名が表示されます</li>
          <li>表示された絵画をクリックすると拡大表示できます</li>
          <li>マッチしたペアは表示されたままになります</li>
          <li>すべてのペアを見つけたらゲーム終了です</li>
          <li>なるべく少ないターン数でクリアを目指しましょう！</li>
        </ul>
      </div>

      {/* 拡大画像モーダル */}
      <ImageModal
        isOpen={modalOpen}
        image={selectedImage}
        isMatched={
          selectedImage ? matchedPairs.includes(selectedImage.author) : false
        }
        onClose={closeModal}
      />
    </div>
  );
};

export default ArtMemoryGame;

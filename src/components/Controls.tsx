interface ControlsProps {
  difficulty: number;
  onDifficultyChange: (difficulty: number) => void;
  onNewGame: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  difficulty,
  onDifficultyChange,
  onNewGame,
}) => {
  return (
    <div className="flex flex-row flex-wrap items-center gap-3 lg:justify-end">
      <label className="flex items-center gap-2 rounded border border-stone-300 bg-stone-50 px-2.5 py-2 sm:gap-3 sm:px-3">
        {/* スマホでは選択肢自体が難易度を示すため、ラベル文字は隠して幅を稼ぐ */}
        <span className="hidden text-sm font-semibold text-stone-600 sm:inline">
          難易度
        </span>
        <select
          value={difficulty}
          onChange={(e) => onDifficultyChange(Number(e.target.value))}
          aria-label="難易度"
          className="rounded border border-stone-300 bg-white px-2 py-1.5 text-sm font-medium text-stone-900 shadow-inner outline-none transition-colors hover:border-stone-500 focus:border-stone-700 sm:px-3"
        >
          <option value="3">初級 (3ペア)</option>
          <option value="6">中級 (6ペア)</option>
          <option value="8">上級 (8ペア)</option>
          <option value="10">エキスパート (10ペア)</option>
        </select>
      </label>

      <button
        type="button"
        onClick={onNewGame}
        className="flex-1 whitespace-nowrap rounded bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(28,25,23,0.18)] transition-colors hover:bg-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:flex-none sm:px-5"
      >
        新しいゲーム
      </button>
    </div>
  );
};

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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
      <label className="flex items-center gap-3 rounded border border-stone-300 bg-stone-50 px-3 py-2">
        <span className="text-sm font-semibold text-stone-600">難易度</span>
        <select
          value={difficulty}
          onChange={(e) => onDifficultyChange(Number(e.target.value))}
          className="rounded border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-900 shadow-inner outline-none transition-colors hover:border-stone-500 focus:border-stone-700"
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
        className="rounded bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(28,25,23,0.18)] transition-colors hover:bg-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        新しいゲーム
      </button>
    </div>
  );
};

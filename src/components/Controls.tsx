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
    <>
      <div className="bg-white px-4 py-2 rounded-lg shadow flex items-center">
        <span className="mr-2">難易度:</span>
        <select
          value={difficulty}
          onChange={(e) => onDifficultyChange(Number(e.target.value))}
          className="border rounded py-1 px-2"
        >
          <option value="3">初級 (3ペア)</option>
          <option value="6">中級 (6ペア)</option>
          <option value="8">上級 (8ペア)</option>
          <option value="10">エキスパート (10ペア)</option>
        </select>
      </div>

      <button
        type="button"
        onClick={onNewGame}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
      >
        新しいゲーム
      </button>
    </>
  );
};

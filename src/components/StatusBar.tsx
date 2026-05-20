import type { BestRecord } from "../hooks/useBestScores";
import { formatTime } from "../utils/format";

interface StatusBarProps {
  turns: number;
  elapsedMs: number;
  matchedCount: number;
  totalPairs: number;
  bestRecord: BestRecord | undefined;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  turns,
  elapsedMs,
  matchedCount,
  totalPairs,
  bestRecord,
}) => {
  return (
    <>
      <div className="bg-white px-4 py-2 rounded-lg shadow">
        <p className="text-lg font-medium">
          ターン数: <span className="text-blue-600 font-bold">{turns}</span>
        </p>
      </div>

      <div className="bg-white px-4 py-2 rounded-lg shadow">
        <p className="text-lg font-medium">
          タイム:{" "}
          <span className="text-purple-600 font-bold tabular-nums">
            {formatTime(elapsedMs)}
          </span>
        </p>
      </div>

      <div className="bg-white px-4 py-2 rounded-lg shadow">
        <p className="text-lg font-medium">
          マッチ:{" "}
          <span className="text-green-600 font-bold">
            {matchedCount}/{totalPairs}
          </span>
        </p>
      </div>

      {bestRecord && (
        <div className="bg-white px-4 py-2 rounded-lg shadow">
          <p className="text-lg font-medium">
            最高:{" "}
            <span className="text-amber-600 font-bold tabular-nums">
              {bestRecord.turns}ターン / {formatTime(bestRecord.ms)}
            </span>
          </p>
        </div>
      )}
    </>
  );
};

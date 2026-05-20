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
    <div className="grid flex-1 grid-cols-2 gap-2 md:grid-cols-4">
      <div className="rounded border border-stone-300 bg-stone-50 px-3 py-2">
        <p className="text-xs font-semibold text-stone-500">ターン数</p>
        <p className="mt-1 text-xl font-bold tabular-nums text-stone-950">
          {turns}
        </p>
      </div>

      <div className="rounded border border-stone-300 bg-stone-50 px-3 py-2">
        <p className="text-xs font-semibold text-stone-500">タイム</p>
        <p className="mt-1 text-xl font-bold tabular-nums text-stone-950">
          {formatTime(elapsedMs)}
        </p>
      </div>

      <div className="rounded border border-stone-300 bg-stone-50 px-3 py-2">
        <p className="text-xs font-semibold text-stone-500">マッチ</p>
        <p className="mt-1 text-xl font-bold tabular-nums text-stone-950">
          {matchedCount}/{totalPairs}
        </p>
      </div>

      <div className="rounded border border-stone-300 bg-stone-50 px-3 py-2">
        <p className="text-xs font-semibold text-stone-500">最高記録</p>
        {bestRecord ? (
          <p className="mt-1 text-base font-bold tabular-nums text-stone-950 sm:text-lg">
            {bestRecord.turns}ターン / {formatTime(bestRecord.ms)}
          </p>
        ) : (
          <p className="mt-1 text-base font-semibold text-stone-400 sm:text-lg">
            未記録
          </p>
        )}
      </div>
    </div>
  );
};

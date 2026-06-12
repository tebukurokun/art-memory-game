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
    <div className="grid flex-1 grid-cols-4 gap-1.5 sm:gap-2">
      <div className="rounded border border-stone-300 bg-stone-50 px-2 py-1.5 sm:px-3 sm:py-2">
        <p className="text-xs font-semibold text-stone-500">ターン数</p>
        <p className="mt-0.5 text-base font-bold tabular-nums text-stone-950 sm:mt-1 sm:text-xl">
          {turns}
        </p>
      </div>

      <div className="rounded border border-stone-300 bg-stone-50 px-2 py-1.5 sm:px-3 sm:py-2">
        <p className="text-xs font-semibold text-stone-500">タイム</p>
        <p className="mt-0.5 text-base font-bold tabular-nums text-stone-950 sm:mt-1 sm:text-xl">
          {formatTime(elapsedMs)}
        </p>
      </div>

      <div className="rounded border border-stone-300 bg-stone-50 px-2 py-1.5 sm:px-3 sm:py-2">
        <p className="text-xs font-semibold text-stone-500">マッチ</p>
        <p className="mt-0.5 text-base font-bold tabular-nums text-stone-950 sm:mt-1 sm:text-xl">
          {matchedCount}/{totalPairs}
        </p>
      </div>

      <div className="rounded border border-stone-300 bg-stone-50 px-2 py-1.5 sm:px-3 sm:py-2">
        <p className="text-xs font-semibold text-stone-500">最高記録</p>
        {bestRecord ? (
          <p className="mt-0.5 text-xs font-bold leading-tight tabular-nums text-stone-950 sm:mt-1 sm:text-lg sm:leading-normal">
            {bestRecord.turns}ターン / {formatTime(bestRecord.ms)}
          </p>
        ) : (
          <p className="mt-0.5 text-xs font-semibold text-stone-400 sm:mt-1 sm:text-lg">
            未記録
          </p>
        )}
      </div>
    </div>
  );
};

import type { NewRecord } from "../hooks/useMemoryGame";
import { formatTime } from "../utils/format";

interface WinBannerProps {
  turns: number;
  elapsedMs: number;
  newRecord: NewRecord;
}

const recordLabel = (newRecord: NewRecord): string => {
  if (newRecord.turns && newRecord.time) return "（最少ターン・最短タイム）";
  if (newRecord.turns) return "（最少ターン）";
  return "（最短タイム）";
};

export const WinBanner: React.FC<WinBannerProps> = ({
  turns,
  elapsedMs,
  newRecord,
}) => {
  const hasNewRecord = newRecord.turns || newRecord.time;

  return (
    <div className="mb-6 w-full max-w-lg rounded border border-emerald-700/30 bg-emerald-50 px-5 py-4 text-center text-emerald-950 shadow-[0_16px_34px_rgba(6,78,59,0.12)]">
      <h2 className="mb-2 text-xl font-bold">おめでとうございます！</h2>
      <p className="text-lg font-medium">
        {turns}ターン /{" "}
        <span className="tabular-nums">{formatTime(elapsedMs)}</span> でクリア！
      </p>
      {hasNewRecord && (
        <p className="mt-2 text-sm font-bold text-amber-700">
          新記録！{recordLabel(newRecord)}
        </p>
      )}
    </div>
  );
};

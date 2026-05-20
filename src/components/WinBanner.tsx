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
    <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg shadow-lg text-center max-w-lg w-full">
      <h2 className="text-xl font-bold mb-2">おめでとうございます！</h2>
      <p className="text-lg">
        {turns}ターン /{" "}
        <span className="tabular-nums">{formatTime(elapsedMs)}</span> でクリア！
      </p>
      {hasNewRecord && (
        <p className="text-sm mt-2 font-bold text-amber-700">
          新記録！{recordLabel(newRecord)}
        </p>
      )}
    </div>
  );
};

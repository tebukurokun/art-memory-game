import { useCallback, useEffect, useState } from "react";

export interface GameTimer {
  elapsedMs: number;
  start: () => void;
  stop: () => number;
  reset: () => void;
}

/**
 * ゲーム用タイマー。start() は idempotent（再呼び出しで再開しない）。
 * stop() は最終経過 ms を返し、state にも反映する。
 */
export const useGameTimer = (): GameTimer => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!isRunning || startTime === null) return;
    const id = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 500);
    return () => clearInterval(id);
  }, [isRunning, startTime]);

  const start = useCallback(() => {
    setStartTime((prev) => (prev === null ? Date.now() : prev));
    setIsRunning(true);
  }, []);

  const stop = useCallback((): number => {
    const final = startTime !== null ? Date.now() - startTime : 0;
    setElapsedMs(final);
    setIsRunning(false);
    return final;
  }, [startTime]);

  const reset = useCallback(() => {
    setStartTime(null);
    setElapsedMs(0);
    setIsRunning(false);
  }, []);

  return { elapsedMs, start, stop, reset };
};

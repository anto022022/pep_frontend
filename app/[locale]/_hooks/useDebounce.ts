// hooks/useDebounce.ts
import { useCallback, useRef } from "react";

export const useDebounce = <T extends (...args: any[]) => void>(
  func: T,
  delay = 500
) => {
  const timerRef = useRef<number | null>(null);

  const debounced = useCallback<(...args: Parameters<T>) => void>(
    (...args: Parameters<T>) => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        func(...args);
      }, delay) as unknown as number; // setTimeout returns number in browsers
    },
    // IMPORTANT: if func is re-created each render, the debounce resets.
    // If you don't want that, pass a stable function (useCallback) for `func`.
    [func, delay]
  );

  return debounced;
};

import { useEffect, useState } from "react";

/**
 * Custom hook for debouncing a value.
 * @template T - The type of the value to be debounced.
 * @param {T} value - The value to be debounced.
 * @param {number} [delay] - The delay in milliseconds for debouncing. Defaults to 500 milliseconds.
 * @returns {[T, boolean]} The debounced value and a boolean indicating if the debounce timer is active.
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-debounce)
 * @example
 * const [debouncedSearchTerm, isDebouncing] = useDebounce(searchTerm, 300);
 */
export function useDebounce<T>(value: T, delay?: number): [T, boolean] {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);

  useEffect(() => {
    setIsDebouncing(true);
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay ?? 500);

    return () => {
      clearTimeout(timer);
      setIsDebouncing(false);
    };
  }, [value, delay]);

  return [debouncedValue, isDebouncing];
}

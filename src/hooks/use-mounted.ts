/**
 * useMounted Hook
 * Provides a ref that tracks whether the component is still mounted.
 * Useful for preventing state updates after unmount in async operations.
 */

import { useEffect, useRef } from "react";

/**
 * Returns a ref that is true when the component is mounted, false after unmount.
 * Use this to guard async callbacks from updating unmounted components.
 *
 * @example
 * const isMounted = useMounted();
 *
 * useEffect(() => {
 *   fetchData().then(data => {
 *     if (isMounted.current) {
 *       setData(data);
 *     }
 *   });
 * }, []);
 */
export function useMounted() {
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
}

/**
 * Returns a callback that only executes if the component is still mounted.
 * Wraps the provided callback to check mount status before execution.
 *
 * @example
 * const safeCallback = useSafeCallback((data) => {
 *   setState(data);
 * });
 *
 * fetchData().then(safeCallback);
 */
export function useSafeCallback<T extends (...args: unknown[]) => void>(
  callback: T
): T {
  const isMounted = useMounted();

  return ((...args: Parameters<T>) => {
    if (isMounted.current) {
      callback(...args);
    }
  }) as T;
}

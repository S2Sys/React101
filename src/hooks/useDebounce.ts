/**
 * useDebounce Custom Hook
 *
 * Delays updates to a value until the user has stopped changing it.
 * Useful for search inputs, filtering, and reducing unnecessary API calls.
 *
 * CONCEPTS: Custom hooks, useEffect, useRef, performance optimization, debouncing
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { DebounceOptions } from '../types';

/**
 * useDebounce Hook
 *
 * Returns a debounced version of a value
 * The returned value will only update after the specified delay
 *
 * @template T - Type of the value being debounced
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds before updating
 * @returns Debounced value
 *
 * CONCEPT: useEffect for delays, useRef for cleanup, performance optimization
 *
 * USAGE:
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   // This only runs 500ms after user stops typing
 *   searchNotes(debouncedSearchTerm);
 * }, [debouncedSearchTerm]);
 *
 * <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
 */
export const useDebounce = <T,>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  /**
   * Effect to debounce the value
   * CONCEPT: useEffect with cleanup function, setTimeout, dependency array
   */
  useEffect(() => {
    // Set up a timer to update the debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel the timer if value changes before delay expires
    // This is the key to debouncing - we keep resetting the timer
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * useDebounceFn Hook
 *
 * Returns a debounced version of a function
 * Useful for debouncing API calls or other expensive operations
 *
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 *
 * CONCEPT: Function debouncing, useCallback, useRef for mutable state
 *
 * USAGE:
 * const debouncedSearch = useDebounceFn(async (term) => {
 *   const results = await api.search(term);
 *   setResults(results);
 * }, 500);
 *
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 */
export const useDebounceFn = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): T => {
  // Store the timeout ID so we can cancel it
  // useRef doesn't cause re-renders, unlike useState
  // CONCEPT: useRef for mutable values that don't trigger re-render
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use useCallback to create a stable function reference
  // CONCEPT: useCallback for memoization
  const debouncedFn = useCallback(
    (...args: any[]) => {
      // Cancel previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFn as T;
};

/**
 * useThrottle Hook
 *
 * Like debounce but guarantees the function runs at least once
 * during a continuous event (e.g., scroll events)
 *
 * @template T - Type of the value being throttled
 * @param value - The value to throttle
 * @param delay - Delay in milliseconds between updates
 * @returns Throttled value
 *
 * CONCEPT: Throttling, useRef for tracking time, performance optimization
 *
 * USAGE:
 * const throttledScrollY = useThrottle(window.scrollY, 100);
 */
export const useThrottle = <T,>(value: T, delay: number = 500): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRanRef = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastRun = now - lastRanRef.current;

    if (timeSinceLastRun >= delay) {
      // Enough time has passed, update immediately
      setThrottledValue(value);
      lastRanRef.current = now;
    } else {
      // Schedule for later
      const handler = setTimeout(() => {
        setThrottledValue(value);
        lastRanRef.current = Date.now();
      }, delay - timeSinceLastRun);

      return () => clearTimeout(handler);
    }
  }, [value, delay]);

  return throttledValue;
};

/**
 * useThrottleFn Hook
 *
 * Returns a throttled version of a function
 *
 * @param callback - Function to throttle
 * @param delay - Minimum delay between executions
 * @returns Throttled function
 *
 * CONCEPT: Function throttling, timing control
 *
 * USAGE:
 * const throttledResize = useThrottleFn(() => {
 *   console.log('Window resized');
 * }, 200);
 *
 * useEffect(() => {
 *   window.addEventListener('resize', throttledResize);
 *   return () => window.removeEventListener('resize', throttledResize);
 * }, [throttledResize]);
 */
export const useThrottleFn = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): T => {
  const lastRanRef = useRef(Date.now());

  const throttledFn = useCallback(
    (...args: any[]) => {
      const now = Date.now();

      if (now - lastRanRef.current >= delay) {
        callback(...args);
        lastRanRef.current = now;
      }
    },
    [callback, delay]
  );

  return throttledFn as T;
};

/**
 * useAsync Hook
 *
 * Manages async operations with debouncing
 * Combines async execution with debouncing
 *
 * @param asyncFn - Async function to execute
 * @param immediate - Execute immediately or wait for input
 * @param delay - Debounce delay
 * @returns Status and handlers
 *
 * CONCEPT: Async management, debouncing, state management
 *
 * USAGE:
 * const { status, data, error, execute } = useAsync(
 *   async (term) => api.search(term),
 *   false,
 *   500
 * );
 *
 * <input onChange={(e) => execute(e.target.value)} />
 */
export const useAsync = <T, E = string>(
  asyncFn: () => Promise<T>,
  immediate: boolean = true,
  delay: number = 0
) => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setError(null);

    if (delay > 0) {
      timeoutRef.current = setTimeout(async () => {
        try {
          const response = await asyncFn();
          setData(response);
          setStatus('success');
        } catch (err) {
          setError(err as E);
          setStatus('error');
        }
      }, delay);
    } else {
      try {
        const response = await asyncFn();
        setData(response);
        setStatus('success');
      } catch (err) {
        setError(err as E);
        setStatus('error');
      }
    }
  }, [asyncFn, delay]);

  useEffect(() => {
    if (immediate) {
      execute();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [execute, immediate]);

  return { status, data, error, execute };
};

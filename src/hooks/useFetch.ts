/**
 * useFetch Custom Hook
 *
 * A generic hook for fetching data from an API.
 * Demonstrates useState, useEffect, and useCallback hooks working together.
 *
 * CONCEPTS: Custom hooks, useEffect, useState, generic types, error handling
 */

import { useState, useEffect, useCallback } from 'react';
import { UseFetchState } from '../types';

/**
 * useFetch Hook
 *
 * Generic data fetching hook that handles loading, error, and refetch states
 *
 * @template T - The type of data being fetched
 * @param fetchFn - Async function that fetches the data
 * @param immediate - Whether to fetch immediately on mount (default: true)
 * @returns Object with data, loading state, error, and refetch function
 *
 * CONCEPT: Generic hooks, useEffect, useState, async handling
 *
 * USAGE:
 * const { data, isLoading, error, refetch } = useFetch(
 *   async () => {
 *     const response = await fetch('/api/notes');
 *     return response.json();
 *   }
 * );
 */
export const useFetch = <T,>(
  fetchFn: () => Promise<T>,
  immediate: boolean = true
): UseFetchState<T> & { refetch: () => Promise<void> } => {
  // State management with TypeScript generics
  // CONCEPT: useState with typed state, initial values
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<string | null>(null);

  // Memoized refetch function
  // CONCEPT: useCallback to prevent unnecessary re-renders, async function
  const refetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Call the provided fetch function
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  // Effect to fetch data on mount
  // CONCEPT: useEffect with dependency array, side effects
  useEffect(() => {
    if (!immediate) return;

    refetch();
  }, [refetch, immediate]);

  return { data, isLoading, error, refetch };
};

/**
 * useFetchOnDemand Hook
 *
 * Like useFetch but doesn't fetch immediately - you call it manually
 *
 * @template T - The type of data being fetched
 * @param fetchFn - Async function that fetches the data
 * @returns Object with data, loading state, error, and fetch function
 *
 * CONCEPT: Custom hook, manual control
 *
 * USAGE:
 * const { data, isLoading, fetch } = useFetchOnDemand(apiCall);
 * <button onClick={() => fetch()}>Load Data</button>
 */
export const useFetchOnDemand = <T,>(
  fetchFn: () => Promise<T>
): Omit<UseFetchState<T>, 'refetch'> & { fetch: () => Promise<void> } => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchFn();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  return { data, isLoading, error, fetch };
};

/**
 * usePolling Hook
 *
 * Fetches data at regular intervals
 * Useful for real-time data like notifications or live updates
 *
 * @template T - The type of data being fetched
 * @param fetchFn - Async function that fetches the data
 * @param interval - Polling interval in milliseconds
 * @param enabled - Whether polling is enabled (default: true)
 * @returns Object with data, loading state, error, and stop function
 *
 * CONCEPT: useEffect for polling, setInterval, cleanup
 *
 * USAGE:
 * const { data, stop } = usePolling(apiCall, 5000);
 * // Data will be fetched every 5 seconds
 */
export const usePolling = <T,>(
  fetchFn: () => Promise<T>,
  interval: number = 5000,
  enabled: boolean = true
): UseFetchState<T> & { stop: () => void } => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Store interval ID so we can stop it
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Refetch function
  const refetch = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await fetchFn();
      setData(result);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  // Function to stop polling
  const stop = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [intervalId]);

  // Effect to set up polling
  useEffect(() => {
    if (!enabled) return;

    // Fetch immediately
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchFn();
        setData(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up interval for subsequent fetches
    const id = setInterval(fetchData, interval);
    setIntervalId(id);

    // Cleanup: clear interval when component unmounts or effect re-runs
    // CONCEPT: useEffect cleanup function
    return () => {
      clearInterval(id);
    };
  }, [fetchFn, interval, enabled]);

  return { data, isLoading, error, refetch, stop };
};

/**
 * useLazyFetch Hook
 *
 * Returns a function to fetch data when needed, similar to Apollo useLazyQuery
 *
 * @template T - The type of data being fetched
 * @param fetchFn - Async function that fetches the data
 * @returns Tuple of [execute function, state object]
 *
 * CONCEPT: Custom hook with tuple return, lazy loading
 *
 * USAGE:
 * const [fetch, { data, isLoading, error }] = useLazyFetch(apiCall);
 * <button onClick={() => fetch()}>Load</button>
 */
export const useLazyFetch = <T,>(
  fetchFn: () => Promise<T>
): [() => Promise<void>, UseFetchState<T>] => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchFn();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  return [execute, { data, isLoading, error, refetch: execute }];
};

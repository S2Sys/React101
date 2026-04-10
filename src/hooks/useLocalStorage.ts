/**
 * useLocalStorage Custom Hook
 *
 * Syncs state with browser localStorage for data persistence.
 * Demonstrates useState, useEffect, and JSON serialization.
 *
 * CONCEPTS: Custom hooks, localStorage, JSON serialization, side effects
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * useLocalStorage Hook
 *
 * Manages state that persists to localStorage
 *
 * @template T - The type of value to store
 * @param key - localStorage key
 * @param initialValue - Initial value if nothing in localStorage
 * @returns Tuple of [value, setValue, remove]
 *
 * CONCEPT: Generic hooks, localStorage, JSON serialization, useEffect
 *
 * USAGE:
 * const [user, setUser, removeUser] = useLocalStorage('user', null);
 * // Value is automatically persisted to localStorage
 * setUser({ name: 'John' }); // Saved to localStorage
 * removeUser(); // Cleared from localStorage
 */
export const useLocalStorage = <T,>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void] => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  // CONCEPT: useState with initializer function for expensive computations
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);

      if (item) {
        // Parse stored json or if none return initialValue
        return JSON.parse(item);
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  /**
   * Return a wrapped version of useState's setter function that
   * persists the new value to localStorage
   *
   * CONCEPT: useCallback for stable function reference, localStorage.setItem
   */
  const setValue = useCallback(
    (value: T) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));

        // Dispatch storage event so other tabs/windows can react
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            newValue: JSON.stringify(valueToStore),
            url: window.location.href,
          })
        );
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  /**
   * Remove value from localStorage
   * CONCEPT: Cleanup, localStorage.removeItem
   */
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
      window.dispatchEvent(
        new StorageEvent('storage', {
          key,
          newValue: null,
          url: window.location.href,
        })
      );
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  /**
   * Listen for storage changes in other tabs/windows
   * CONCEPT: useEffect for side effects, cross-tab communication
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing storage event:`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
};

/**
 * useLocalStorageObject Hook
 *
 * Like useLocalStorage but only for objects, with property-level updates
 *
 * @template T - Object type to store
 * @param key - localStorage key
 * @param initialValue - Initial object
 * @returns Object with value, methods to update/remove
 *
 * CONCEPT: Custom hook for objects, partial updates
 *
 * USAGE:
 * const user = useLocalStorageObject('user', { name: '', age: 0 });
 * <button onClick={() => user.set({ name: 'John' })}>Update Name</button>
 */
export const useLocalStorageObject = <T extends Record<string, any>>(
  key: string,
  initialValue: T
) => {
  const [stored, setStored, removeStored] = useLocalStorage<T>(key, initialValue);

  const updateProperty = useCallback(
    (property: keyof T, value: any) => {
      setStored({
        ...stored,
        [property]: value,
      });
    },
    [stored, setStored]
  );

  const updateMultiple = useCallback(
    (updates: Partial<T>) => {
      setStored({
        ...stored,
        ...updates,
      });
    },
    [stored, setStored]
  );

  const reset = useCallback(() => {
    setStored(initialValue);
  }, [setStored, initialValue]);

  return {
    value: stored,
    set: setStored,
    update: updateProperty,
    updateMultiple,
    remove: removeStored,
    reset,
  };
};

/**
 * useSessionStorage Hook
 *
 * Like useLocalStorage but uses sessionStorage (cleared when tab closes)
 *
 * @template T - The type of value to store
 * @param key - sessionStorage key
 * @param initialValue - Initial value
 * @returns Tuple of [value, setValue, remove]
 *
 * CONCEPT: Similar pattern to useLocalStorage but with sessionStorage
 *
 * USAGE:
 * const [tempData, setTempData] = useSessionStorage('temp', null);
 */
export const useSessionStorage = <T,>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

/**
 * useClipboard Hook
 *
 * Manages clipboard copy/paste operations
 *
 * @returns Object with copy function and state
 *
 * CONCEPT: Clipboard API, async operations
 */
export const useClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // Reset after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setIsCopied(false);
    }
  }, []);

  return { copy, isCopied };
};

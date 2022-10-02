import { useCallback } from 'react';
import create from 'zustand';

const useStore = create(() => ({} as { [key: string]: unknown }));

export function useLocalStorage<T>(
  key: string,
  initialValue?: T
): [T | undefined, (value: T | ((prevValue: T | undefined) => T)) => void] {
  const result = useStore((state) => state[key]) as T | undefined | null;
  let storedValue = result;

  // If global state doesn't have the localStorage value, query it.
  if (result === undefined) {
    const localValue = getLocalStorage<T>(key);
    storedValue =
      localValue === null ? (initialValue === undefined ? null : initialValue) : localValue;
    if (storedValue !== undefined) {
      useStore.setState({ [key]: storedValue });
    }
  }

  const setResultWrapper = useCallback(
    (newValue: T | ((prevValue: T | undefined) => T)) => {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        newValue instanceof Function
          ? newValue(useStore.getState()[key] as T | undefined)
          : newValue;
      // Save state
      setLocalStorage(key, valueToStore);
    },
    [key]
  );

  return [storedValue ?? initialValue, setResultWrapper];
}

/**
 * Retrieves a value from local storage. Doesn't trigger any React state changes.
 * @param key the key to get
 */
export function getLocalStorage<T>(key: string): T | null {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Failed to get from local storage.', key, error);
    return null;
  }
}

/**
 * Sets a value in local storage.
 * @param key the key to set
 * @param value the value to set at location "key"
 */
export function setLocalStorage<T>(key: string, value: T) {
  try {
    useStore.setState({ [key]: value });
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to set local storage.', key, value, error);
  }
}

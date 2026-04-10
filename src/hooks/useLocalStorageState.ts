import { useEffect, useState } from 'react';

type Validator<T> = (value: unknown) => T;

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export function useLocalStorageState<T>(key: string, fallback: T, validator?: Validator<T>) {
  const [state, setState] = useState<T>(() => {
    if (!isBrowser()) return fallback;

    try {
      const stored = window.localStorage.getItem(key);
      if (!stored) return fallback;
      const parsed = JSON.parse(stored);
      return validator ? validator(parsed) : (parsed as T);
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    if (!isBrowser()) return;

    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore storage write errors in private mode or strict browser settings.
    }
  }, [key, state]);

  return [state, setState] as const;
}

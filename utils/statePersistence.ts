
import React, { useState, useEffect } from 'react';
import { encrypt, decrypt } from './crypto';

// This is the Izanami Protocol. It ensures the Hive's memory is eternal.
export function usePersistentState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return defaultValue;

      const decrypted = decrypt(item);
      if (decrypted === null) {
        console.warn(`Data corruption detected for key "${key}". Resetting to default.`);
        return defaultValue;
      }
      
      // Handle complex merge for objects to ensure new default properties are added
      if (typeof defaultValue === 'object' && defaultValue !== null && !Array.isArray(defaultValue)) {
        return { ...defaultValue, ...decrypted };
      }

      return decrypted;

    } catch (error) {
      console.error(`Error reading ${key} from localStorage, resetting to default.`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      const encryptedState = encrypt(state);
      window.localStorage.setItem(key, encryptedState);
    } catch (error) {
      console.error(`Error saving ${key} to localStorage`, error);
    }
  }, [key, state]);

  return [state, setState];
}

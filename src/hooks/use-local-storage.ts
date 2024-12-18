"use client";

import { useEffect, useState } from "react";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>();

  useEffect(() => {
    const init = () => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.error("Error reading localStorage key:", key, error);
        return initialValue;
      }
    };

    init();
  }, [initialValue, key]);

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error setting localStorage key:", key, error);
    }
  };

  return [storedValue, setValue] as const;
};

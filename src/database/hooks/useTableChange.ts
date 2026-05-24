import { useEffect, useRef } from 'react';
import { addDatabaseChangeListener } from 'expo-sqlite';

export function useTableChanges(
  selectedTableName: string,
  callback?: () => void,
  dep: any[] = [],
  coldDownTime = 1000,
) {
  const coldDown = useRef(false);

  useEffect(() => {
    const subscription = addDatabaseChangeListener((event) => {
      const { tableName } = event;
      if (tableName === selectedTableName) {
        if (coldDown.current) {
          return;
        }

        callback?.();
        coldDown.current = true;

        setTimeout(() => {
          coldDown.current = false;
        }, coldDownTime);
      }
    });

    return () => subscription.remove();
  }, [dep]);
}

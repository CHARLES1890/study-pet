import { useEffect, useState, useCallback } from 'react';
import type { AppData } from '../types';
import { loadData, saveData } from '../utils/storage';

export function useStorage() {
  const [data, setData] = useState<AppData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadData().then((d) => {
      if (mounted) {
        setData(d);
        setLoaded(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (data) {
      saveData(data);
    }
  }, [data]);

  const updateData = useCallback((updater: (prev: AppData) => AppData) => {
    setData((prev) => (prev ? updater(prev) : prev));
  }, []);

  return { data, setData: updateData, loaded };
}

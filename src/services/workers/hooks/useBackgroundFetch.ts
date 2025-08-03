import { useCallback, useEffect } from "react";
import BackgroundCheckSaveBooks from "../BackgroundCheckSaveBooks";
import BackgroundFetch from "react-native-background-fetch";

export function useBackgroundFetch() {
  const registBackgroundTask = useCallback(async () => {
    try {
      console.info(`[BackgroundTask] Registering...`);
      const status = await BackgroundCheckSaveBooks.configure();
      console.info(`[BackgroundTask] Register: ${status}`);
  
      if (status === BackgroundFetch.STATUS_AVAILABLE) {
        await BackgroundCheckSaveBooks.register();
        console.info(`[BackgroundTask] Start process`);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    registBackgroundTask();
  }, []);
}

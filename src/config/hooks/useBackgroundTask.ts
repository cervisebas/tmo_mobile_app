import BackgroundCheckSaveBooks from "~/workers/BackgroundCheckSaveBooks";
import { useConfig } from "./useConfig";

export function useBackgroundTask() {
  return useConfig<boolean>({
    initValue: false,
    async get() {
      return (await BackgroundCheckSaveBooks.getStatus()).isRegister;
    },
    async set(value) {
      if (value) {
        await BackgroundCheckSaveBooks.register();
      } else {
        await BackgroundCheckSaveBooks.unregister();
      }
    },
    async isDisabled() {
      return (await BackgroundCheckSaveBooks.getStatus()).isAvailable;
    },
  });
}

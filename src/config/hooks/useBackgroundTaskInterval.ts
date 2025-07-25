import { ConfigStorage } from "..";
import { ConfigKey } from "../enums/ConfigKey";
import { DefaultValueConfig } from "../enums/DefaultValueConfig";
import { useConfig } from "./useConfig";

export function useBackgroundTaskInterval() {
  return useConfig<string>({
    initValue: String(DefaultValueConfig.BACKGROUND_TASK_INTERVAL),
    async get() {
      const val = ConfigStorage.getNumber(ConfigKey.BACKGROUND_TASK_INTERVAL) ?? DefaultValueConfig.BACKGROUND_TASK_INTERVAL;

      return String(val);
    },
    async set(value) {
      ConfigStorage.set(ConfigKey.BACKGROUND_TASK_INTERVAL, Number(value));
    },
  });
}
import { useConfig } from "./useConfig";
import { DefaultValueConfig } from "../enums/DefaultValueConfig";
import { ConfigStorage } from "..";
import { ConfigKey } from "../enums/ConfigKey";

export function useBackgroundTask() {
  return useConfig<boolean>({
    initValue: Boolean(DefaultValueConfig.BACKGROUND_TASK),
    async get() {
      const val = ConfigStorage.getBoolean(ConfigKey.BACKGROUND_TASK) ?? DefaultValueConfig.BACKGROUND_TASK;

      return Boolean(val);
    },
    async set(value) {
      ConfigStorage.set(ConfigKey.BACKGROUND_TASK, value);
    },
  });
}

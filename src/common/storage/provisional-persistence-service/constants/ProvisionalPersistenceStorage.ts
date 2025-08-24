import { MMKV } from "react-native-mmkv";
import { StorageKey } from "~/common/enums/StorageKey";

export const ProvisionalPersistenceStorage = new MMKV({
  id: StorageKey.PROVISIONAL_PERSISTENCE_STORAGE,
});

import { MMKV } from 'react-native-mmkv';
import { ConfigKey } from './enums/ConfigKey';

export const ConfigStorage = new MMKV({
  id: ConfigKey.DEFAULT,
});

import { MMKV, Mode } from 'react-native-mmkv';
import { ConfigKey } from '~/config/enums/ConfigKey';
import { DefaultValueConfig } from '~/config/enums/DefaultValueConfig';

export async function checkExecuteTask() {
  // Check enabled
  const ConfigStorage = new MMKV({
    id: ConfigKey.DEFAULT,
    mode: Mode.MULTI_PROCESS,
  });
  
  if (!(ConfigStorage.getBoolean(ConfigKey.BACKGROUND_TASK) ?? DefaultValueConfig.BACKGROUND_TASK)) {
    throw '[BackgroundTask] No habilitado por el usuario: abortando.';
  }

  // Check Notifications
  console.info(
    '[BackgroundTask] Notification status:',
    ConfigStorage.getBoolean(ConfigKey.NOTIFICATION_STATUS),
  );
  
  if (!ConfigStorage.getBoolean(ConfigKey.NOTIFICATION_STATUS)) {
    throw '[BackgroundTask] Notificaciones no disponibles: abortando.';
  }
}

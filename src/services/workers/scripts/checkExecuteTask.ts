import { ConfigStorage } from '~/config';
import { ConfigKey } from '~/config/enums/ConfigKey';
import { DefaultValueConfig } from '~/config/enums/DefaultValueConfig';
import { Notifications } from '~/services/notifications';

export async function checkExecuteTask() {
  // Check enabled
  if (!(ConfigStorage.getBoolean(ConfigKey.BACKGROUND_TASK) ?? DefaultValueConfig.BACKGROUND_TASK)) {
    throw '[BackgroundTask] No habilitado por el usuario: abortando.';
  }

  // Check Notifications
  if (!(await Notifications.isAvailable())) {
    throw '[BackgroundTask] Notificaciones no disponibles: abortando.';
  }

}

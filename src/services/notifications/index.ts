import Notifee, { AuthorizationStatus } from '@notifee/react-native';
import { BackgroundNotifee } from './events/BackgroundNotifee';
import { ForegroundNotifee } from './events/ForegoundNotifee';
import { ConfigStorage } from '~/config';
import { ConfigKey } from '~/config/enums/ConfigKey';

async function checkPermissions() {
  const settings = await Notifee.requestPermission();

  if (settings.authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
    ConfigStorage.set(ConfigKey.NOTIFICATION_STATUS, false);
    return false;
  }
  
  ConfigStorage.set(ConfigKey.NOTIFICATION_STATUS, true);
  return true;
}

function registEvents() {
  Notifee.onBackgroundEvent(async event => BackgroundNotifee.next(event));
  Notifee.onForegroundEvent(event => ForegroundNotifee.next(event));
}

export const Notifications = {
  checkPermissions,
  registEvents,
  async isAvailable() {
    const settings = await Notifee.requestPermission();
    return settings.authorizationStatus === AuthorizationStatus.AUTHORIZED;
  },
};

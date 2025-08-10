import Notifee, { AuthorizationStatus } from '@notifee/react-native';
import { BackgroundNotifee } from './events/BackgroundNotifee';
import { ForegroundNotifee } from './events/ForegoundNotifee';

async function checkPermissions() {
  const settings = await Notifee.requestPermission();

  if (settings.authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
    return false;
  }

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

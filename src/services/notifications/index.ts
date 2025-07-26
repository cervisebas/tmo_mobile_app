import * as ExpoNotifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotificationChannel } from './enums/NotificationChannel';

ExpoNotifications.setNotificationHandler({
  handleNotification: async () => ({    
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Methods
async function initDefaultChannel() {
  if (Platform.OS !== 'android') {
    return;
  }

  await ExpoNotifications.setNotificationChannelAsync(NotificationChannel.DEFAULT, {
    name: NotificationChannel.DEFAULT,
    importance: ExpoNotifications.AndroidImportance.HIGH,
    bypassDnd: true,
  });
}

async function checkPermissions() {
  const { status } = await ExpoNotifications.getPermissionsAsync();

  if (status !== ExpoNotifications.PermissionStatus.GRANTED) {
    const { status: newStatus } = await ExpoNotifications.requestPermissionsAsync();

    if (newStatus !== ExpoNotifications.PermissionStatus.GRANTED) {
      return false;
    }

    initDefaultChannel();
    return true;
  }

  return true;
}

export const Notifications = {
  checkPermissions,
  async isAvailable() {
    const { status } = await ExpoNotifications.getPermissionsAsync();

    return status === ExpoNotifications.PermissionStatus.GRANTED;
  },
};

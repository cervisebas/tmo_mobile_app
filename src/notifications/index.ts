import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotificationChannel } from './enums/NotificationChannel';

Notifications.setNotificationHandler({
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

  await Notifications.setNotificationChannelAsync(NotificationChannel.DEFAULT, {
    name: NotificationChannel.DEFAULT,
    importance: Notifications.AndroidImportance.HIGH,
    bypassDnd: true,
  });
}

async function checkPermissions() {
  const { status } = await Notifications.getPermissionsAsync();

  if (status !== Notifications.PermissionStatus.GRANTED) {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();

    if (newStatus !== Notifications.PermissionStatus.GRANTED) {
      return false;
    }

    initDefaultChannel();
    return true;
  }

  return true;
}

export default {
  NotificationChannel,
  checkPermissions,
};

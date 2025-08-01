import * as ExpoNotifications from 'expo-notifications';

interface IProps {
  title: string;
  message?: string;
  sticky?: boolean;
  sound?: string | boolean;
  interruptionLevel?: ExpoNotifications.NotificationContentInput['interruptionLevel'];
}

export async function showBasicNotification(props: IProps) {
  try {
    const identifier = await ExpoNotifications.scheduleNotificationAsync({
      content: {
        title: props.title,
        body: props.message,
        sticky: props.sticky,
        sound: props.sound,
        interruptionLevel: props.interruptionLevel,
      },
      trigger: null,
    });

    return {
      dismiss() {
        return ExpoNotifications.dismissNotificationAsync(
          identifier,
        );
      },
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

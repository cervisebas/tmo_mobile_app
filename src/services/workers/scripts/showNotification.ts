import Notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import { NotificationChannel } from '~/services/notifications/enums/NotificationChannel';
import { clearObject } from '~/utils/clearObject';
import { randomString } from '~/utils/randomString';

interface IProps {
  id?: string;
  title: string;
  message?: string;
  sticky?: boolean;
  autoCancel?: boolean;
  importance?: AndroidImportance;
  visibility?: AndroidVisibility;
  channelId?: string;
  onlyAlertOnce?: boolean;
  progress?: {
    max: number;
    current: number;
    indeterminate?: boolean;
  };
  action?: {
    id: string;
    data: Record<string, string | number | undefined>;
  };
}

const defaultProps = {
  color: '#2957ba',
  smallIcon: 'ic_notification',
};

export async function showNotification(props: IProps) {
  try {
    const id = props.id || randomString(24);
    const channelId = props.channelId ?? (
      await Notifee.createChannel({
        id: NotificationChannel.DEFAULT,
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      })
    );

    await Notifee.displayNotification({
      id: id,
      title: props.title,
      body: props.message ?? '',
      data: {
        data: (props.action?.data ?? {}) as object,
      },
      android: clearObject({
        ongoing: props.sticky,
        autoCancel: props.autoCancel,
        channelId: channelId,
        importance: props.importance,
        visibility: props.visibility,
        onlyAlertOnce: props.onlyAlertOnce,
        pressAction: props.action
          ? {
            id: props.action?.id,
            launchActivity: 'default',
          }
          : undefined
        ,
        progress: props.progress,
        ...defaultProps,
      }),
    });

    return {
      dismiss() {
        return Notifee.cancelDisplayedNotification(id);
      },
      update(new_props: Partial<IProps>) {
        const _props = { ...props, ...new_props };
        
        return Notifee.displayNotification({
          id: id,
          title: _props.title,
          body: _props.message ?? '',
          android: clearObject({
            ongoing: _props.sticky,
            autoCancel: _props.autoCancel,
            channelId: channelId,
            importance: _props.importance,
            visibility: _props.visibility,
            onlyAlertOnce: _props.onlyAlertOnce,
            pressAction: _props.action
              ? {
                id: _props.action?.id,
                launchActivity: 'default',
              }
              : undefined
            ,
            progress: _props.progress,
            ...defaultProps,
          }),
        });
      },
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

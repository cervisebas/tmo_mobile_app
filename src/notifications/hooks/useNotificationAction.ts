import { useEffect } from "react";
import { NotificationAction } from "../enums/NotificationAction";
import * as Notifications from "expo-notifications";

export function useNotificationAction<T extends object>(type: NotificationAction, callback: (data: T) => void) {
  useEffect(() => {
    Notifications.getLastNotificationResponseAsync().then(value => {
      const data = value?.notification.request.content.data as T;

      if ('action' in data && data.action === type) {
        callback(data);
      }
    });

    const subResp = Notifications.addNotificationResponseReceivedListener(({notification}) => {
      const data = notification.request.content.data as T;

      if ('action' in data && data.action === type) {
        callback(data);
      }
    });

    return () => {
      subResp.remove();
    };
  }, [callback, type]);
}

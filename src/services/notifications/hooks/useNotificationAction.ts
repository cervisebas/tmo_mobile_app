import { useEffect, useRef } from "react";
import { NotificationAction } from "../enums/NotificationAction";
import Notifee, { Event, EventType, InitialNotification } from "@notifee/react-native";
import { ForegroundNotifee } from "../events/ForegoundNotifee";
import { BackgroundNotifee } from "../events/BackgroundNotifee";

export function useNotificationAction<T extends object>(notification_type: NotificationAction, callback: (data: T) => void) {
  const init = useRef(false);

  function notificationAction(event: Event | InitialNotification) {
    const type = 'type' in event ? event.type : undefined;
    const detail = 'detail' in event ? event.detail : event;

    if (type && type !== EventType.PRESS) {
      return;
    }

    if (
      detail.pressAction &&
      detail.notification &&
      'id' in detail.pressAction &&
      'data' in detail.notification &&
      'data' in detail.notification.data!
    ) {
      const id = detail.pressAction.id as NotificationAction;
      const data = detail.notification.data.data as T;

      if (id === notification_type) {
        callback(data);
      }
    }
  }
  
  useEffect(() => {
    Notifee.getInitialNotification().then(val => {
      if (!init.current) {
        init.current = true;
        if (val) {
          notificationAction(val);
        }
      }
    });
    
    const eventForeground = ForegroundNotifee.subscribe(notificationAction);
    const eventBackground = BackgroundNotifee.subscribe(notificationAction);

    return () => {
      eventBackground.unsubscribe();
      eventForeground.unsubscribe();
    };
  }, [callback, notification_type]);
}

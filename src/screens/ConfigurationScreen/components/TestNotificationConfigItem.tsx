import React, { useCallback, useEffect, useState } from "react";
import ItemWithIcon from "~/common/components/ItemWithIcon";
import { getAllSavedBooks } from "~/database/services/getAllSavedBooks";
import { getRandomIntInclusive } from "~/database/utils/getRandomIntInclusive";
import { Notifications } from "~/notifications";
import * as ExpoNotifications from 'expo-notifications';
import { NotificationAction } from "~/notifications/enums/NotificationAction";

export const TestNotificationConfigItem = React.memo(function () {
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    Notifications.isAvailable()
      .then(val => setDisabled(!val));
  }, []);

  const testNotificactions = useCallback(async () => {
    try {
      const all = await getAllSavedBooks();

      if (!all.length) {
        return;
      }

      const book = all.at(getRandomIntInclusive(0, all.length - 1));

      if (!book) {
        return;
      }

      ExpoNotifications.scheduleNotificationAsync({
        content: {
          title: book.title,
          body: 'Se acaba de actualizar este libro',
          data: {
            action: NotificationAction.OPEN_DETAILS,
            id: book.id,
            path: book.path,
            url: book.url,
            title: book.title,
            picture: book.picture,
            stars: book.stars,
            type: book.type,
          },
        },
        trigger: null,
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <ItemWithIcon
      title={'Probar notificaciones'}
      description={
        'Envía una notificación de prueba para comprobar que estén funcionando correctamente.'
        + (disabled ? '\n\nNo disponible.' : '')
      }
      leftIcon={'bell-ring-outline'}
      disabled={disabled}
      onPress={testNotificactions}
    />
  );
});
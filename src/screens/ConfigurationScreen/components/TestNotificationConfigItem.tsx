import { AndroidImportance, AndroidVisibility } from "@notifee/react-native";
import React, { useCallback, useEffect, useState } from "react";
import ItemWithIcon from "~/common/components/ItemWithIcon";
import { DatabaseService } from "~/database/classes/DatabaseService";
import { getRandomIntInclusive } from "~/database/utils/getRandomIntInclusive";
import { Notifications } from "~/services/notifications";
import { NotificationAction } from "~/services/notifications/enums/NotificationAction";
import { showNotification } from "~/services/workers/scripts/showNotification";

export const TestNotificationConfigItem = React.memo(function () {
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    Notifications.isAvailable()
      .then(val => setDisabled(!val));
  }, []);

  const testNotificactions = useCallback(async () => {
    try {
      const dbService = new DatabaseService();
      const all = await dbService.getAllSavedBooks();

      if (!all.length) {
        return;
      }

      const book = all.at(getRandomIntInclusive(0, all.length - 1));

      if (!book) {
        return;
      }

      showNotification({
        title: book.title,
        message: 'Se acaba de actualizar este libro',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        action: {
          id: NotificationAction.OPEN_DETAILS,
          data: {
            id: book.id,
            path: book.path,
            url: book.url,
            title: book.title,
            picture: book.picture,
            stars: book.stars,
            type: book.type,
          },
        },
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
      descriptionNumberOfLines={6}
      leftIcon={'bell-ring-outline'}
      disabled={disabled}
      onPress={testNotificactions}
    />
  );
});
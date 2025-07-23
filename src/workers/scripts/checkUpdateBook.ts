import { BookInfoInterface } from '~/api/interfaces/BookInfoInterface';
import { getBookInfo } from '~/api/scripts/getBookInfo';
import { databaseSaveBook } from '~/database/scripts/databaseSaveBook';
import { getDatabaseBookInfo } from '~/database/services/getDatabaseBookInfo';
import { NotificationAction } from '~/notifications/enums/NotificationAction';
import * as Notifications from 'expo-notifications';

export async function checkUpdateBook(book: BookInfoInterface) {
  const database = await getDatabaseBookInfo(book.url);

  if (!database) {
    return;
  }

  const new_data = await getBookInfo(book.url);

  if (database.chapters?.length !== new_data.chapters?.length) {
    await Notifications.scheduleNotificationAsync({
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
  }

  await databaseSaveBook(new_data);
}

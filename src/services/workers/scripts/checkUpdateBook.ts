import { BookInfoInterface } from '~/api/interfaces/BookInfoInterface';
import { getBookInfo } from '~/api/scripts/getBookInfo';
import { databaseSaveBook } from '~/database/scripts/databaseSaveBook';
import { getDatabaseBookInfo } from '~/database/services/getDatabaseBookInfo';
import { NotificationAction } from '~/services/notifications/enums/NotificationAction';
import { showNotification } from './showNotification';

export async function checkUpdateBook(book: BookInfoInterface) {
  const database = await getDatabaseBookInfo(book.url);

  if (!database) {
    return;
  }

  const new_data = await getBookInfo(book.url);

  if (database.chapters?.length !== new_data.chapters?.length) {
    await showNotification({
      title: book.title,
      message: 'Se acaba de actualizar este libro',
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
  }

  await databaseSaveBook(new_data);
}

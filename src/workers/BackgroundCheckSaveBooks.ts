import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import { BackgroundTaskName } from './enums/BackgroundTaskName';
import { getUserStatusBooks } from '~/database/services/getUserStatusBooks';
import { UserBookStatus } from '~/api/enums/UserBookStatus';
import { checkUpdateBook } from './scripts/checkUpdateBook';

TaskManager.defineTask(BackgroundTaskName.CHECK_SAVE_BOOKS, async function () {
  try {
    const { status: NotificationPermission } = await Notifications.getPermissionsAsync();

    if (NotificationPermission !== Notifications.PermissionStatus.GRANTED) {
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    const follow_books = await getUserStatusBooks(UserBookStatus.FOLLOW);
    const wish_books = await getUserStatusBooks(UserBookStatus.WISH);
    const books = [...follow_books, ...wish_books];

    for (const book of books) {
      await checkUpdateBook(book);
    }

  } catch (error) {
    console.error(error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }

  return BackgroundTask.BackgroundTaskResult.Success;
});

export default {
  register() {
    return BackgroundTask.registerTaskAsync(
      BackgroundTaskName.CHECK_SAVE_BOOKS,
      {
        minimumInterval: 30,
      },
    );
  },
  unregister() {
    return BackgroundTask.unregisterTaskAsync(
      BackgroundTaskName.CHECK_SAVE_BOOKS,
    );
  },
};

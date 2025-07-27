import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import * as ExpoNotifications from 'expo-notifications';
import { BackgroundTaskName } from './enums/BackgroundTaskName';
import { getUserStatusBooks } from '~/database/services/getUserStatusBooks';
import { UserBookStatus } from '~/api/enums/UserBookStatus';
import { checkUpdateBook } from './scripts/checkUpdateBook';
import { checkExecuteTask } from './scripts/checkExecuteTask';
import { BookStatus } from '~/api/enums/BookStatus';
import { ConfigStorage } from '~/config';
import { ConfigKey } from '~/config/enums/ConfigKey';
import { DefaultValueConfig } from '~/config/enums/DefaultValueConfig';

TaskManager.defineTask(BackgroundTaskName.CHECK_SAVE_BOOKS, async function () {
  try {
    // Check Execute Background Task
    await checkExecuteTask();

    // Init Background Process
    const follow_books = await getUserStatusBooks(UserBookStatus.FOLLOW);
    const wish_books = await getUserStatusBooks(UserBookStatus.WISH);
    const merge_books = [...follow_books, ...wish_books];

    // Filter books
    const books = merge_books.filter(value => {
      return (
        value.status === BookStatus.ACTIVO ||
        value.status === BookStatus.PUBLICANDOSE ||
        value.status === BookStatus.EN_ESPERA ||
        value.status === BookStatus.PAUSADO
      );
    });

    for (const book of books) {
      await checkUpdateBook(book);
    }

  } catch (error) {
    console.error(error);

    try {
      await ExpoNotifications.scheduleNotificationAsync({
        content: {
          title: 'Tarea en segundo plano',
          body: 'La tarea en segundo plano fallo.',
        },
        trigger: null,
      });
    } catch (error) {
      console.error(error);
    }

    return BackgroundTask.BackgroundTaskResult.Failed;
  }

  return BackgroundTask.BackgroundTaskResult.Success;
});

export default {
  async register() {
    const {isAvailable, isRegister} = await this.getStatus();

    if (!isAvailable) {
      throw 'Tareas en segundo plano no disponibles.';
    }

    if (isRegister) {
      throw 'Tarea en segundo plano ya registrada.';
    }
    
    const minimumInterval = ConfigStorage.getNumber(ConfigKey.BACKGROUND_TASK_INTERVAL) ?? DefaultValueConfig.BACKGROUND_TASK_INTERVAL;
    
    await BackgroundTask.registerTaskAsync(
      BackgroundTaskName.CHECK_SAVE_BOOKS,
      {
        minimumInterval: minimumInterval,
      },
    );
  },
  unregister() {
    return BackgroundTask.unregisterTaskAsync(
      BackgroundTaskName.CHECK_SAVE_BOOKS,
    );
  },
  async getStatus() {
    return {
      isAvailable: await BackgroundTask.getStatusAsync() === BackgroundTask.BackgroundTaskStatus.Available,
      isRegister: await TaskManager.isTaskRegisteredAsync(BackgroundTaskName.CHECK_SAVE_BOOKS),
    };
  },
};

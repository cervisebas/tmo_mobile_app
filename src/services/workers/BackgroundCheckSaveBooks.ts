import { UserBookStatus } from '~/api/enums/UserBookStatus';
import { checkExecuteTask } from './scripts/checkExecuteTask';
import { BookStatus } from '~/api/enums/BookStatus';
import { ConfigStorage } from '~/config';
import { ConfigKey } from '~/config/enums/ConfigKey';
import { DefaultValueConfig } from '~/config/enums/DefaultValueConfig';
import { showNotification } from './scripts/showNotification';
import BackgroundFetch, { HeadlessEvent } from 'react-native-background-fetch';
import { waitTo } from '~/common/utils/WaitTo';
import Notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import { NotificationChannel } from '../notifications/enums/NotificationChannel';
import { getBookInfo } from '~/api/scripts/getBookInfo';
import { NotificationAction } from '../notifications/enums/NotificationAction';
import { ProvisionalPersistenceService } from '~/common/storage/provisional-persistence-service';
import { MMKV, Mode } from 'react-native-mmkv';
import { StorageKey } from '~/common/enums/StorageKey';


async function backgrounTaskFunction(taskId?: string | HeadlessEvent) {
  if (typeof taskId === 'object') {
    taskId = taskId.taskId;
  }

  console.info('[BackgroundTask] Executing task...');

  const channelId = await Notifee.createChannel({
    id: NotificationChannel.BACKGROUND_TASK_CHECK_BOOKS,
    name: 'Check Save Books',
    importance: AndroidImportance.MIN,
    visibility: AndroidVisibility.SECRET,
    vibration: false,
  });

  const taskNotification = await showNotification({
    title: 'Verificando actualizaciones',
    channelId: channelId,
    sticky: true,
    progress: {
      max: 0,
      current: 0,
      indeterminate: true,
    },
  });

  console.info('[BackgroundTask] Showed notification');

  try {
    const storage = new MMKV({
      id: StorageKey.PROVISIONAL_PERSISTENCE_STORAGE,
      mode: Mode.MULTI_PROCESS,
    });
    const provisionalPersistenceService = new ProvisionalPersistenceService(storage);

    // Check Execute Background Task
    console.info('[BackgroundTask] Check requrequirements...');
    await checkExecuteTask();
    console.info('[BackgroundTask] Check success');

    // Init Background Process
    const user_books = provisionalPersistenceService.getAllWithUserStatus([
      UserBookStatus.WISH,
      UserBookStatus.FOLLOW,
    ]);
    
    console.info('[BackgroundTask] Get %d books', user_books.length);

    // Filter books
    const books = user_books.filter(value => {
      return (
        value.status === BookStatus.ACTIVO ||
        value.status === BookStatus.PUBLICANDOSE ||
        value.status === BookStatus.EN_ESPERA ||
        value.status === BookStatus.PAUSADO
      );
    });
    console.info('[BackgroundTask] Filters %d books', books.length);

    if (books.length === 0) {
      await waitTo(1000);
      throw 'No found books.';
    }

    for (const book of books) {
      const position = books.indexOf(book) + 1;
      console.info(`[BackgroundTask] Progress -> ${position} de ${books.length}`);
      
      taskNotification?.update({
        message: `Escaneando ${position} de ${books.length}`,
        progress: {
          max: books.length,
          current: position,
          indeterminate: false,
        },
      });

      // Check Update Book
      const new_data = await getBookInfo(book.url);
    
      if (new_data.chapters && book.chapters.length !== new_data.chapters.length) {
        const local_chapters = book.chapters.map(v => v.data_chapter);
        const new_chapters = new_data.chapters.filter(v => !local_chapters.includes(v.data_chapter));

        for (const chapter of new_chapters) {
          await showNotification({
            title: book.title,
            message: chapter.title,
            action: {
              id: NotificationAction.OPEN_DETAILS,
              data: {
                id: book.id,
                path: new_data.path,
                url: book.url,
                title: book.title,
                picture: new_data.picture,
                stars: new_data.stars,
                type: new_data.type,
              },
            },
          });
        }
      }
    
      provisionalPersistenceService.set(new_data, book.user_book_status);
    }

  } catch (error) {
    console.error('[BackgroundTask]', error);

    /* await showNotification({
      title: 'Tarea en segundo plano',
      message: 'La tarea en segundo plano fallo.',
    }); */
  } finally {
    await taskNotification?.dismiss();
    console.info('[BackgroundTask] Finish');

    if (taskId !== undefined) {
      BackgroundFetch.finish(taskId);
    }
  }
}

function backgrounTaskTimeout(taskId: string) {
  console.error('[BackgroundTask] Timeout');
  BackgroundFetch.finish(taskId);
}

export default {
  configure() {
    const minimumInterval = ConfigStorage.getNumber(ConfigKey.BACKGROUND_TASK_INTERVAL) ?? DefaultValueConfig.BACKGROUND_TASK_INTERVAL;
    
    BackgroundFetch.registerHeadlessTask(backgrounTaskFunction);
    return BackgroundFetch.configure(
      {
        minimumFetchInterval: minimumInterval,
        stopOnTerminate: false,
        startOnBoot: true,
        enableHeadless: true,
        forceAlarmManager: true,
        requiresBatteryNotLow: true,
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
        requiresStorageNotLow: true,
      },
      backgrounTaskFunction,
      backgrounTaskTimeout,
    );
  },
  async register() {
    return BackgroundFetch.start();
  },
  unregister() {
    return BackgroundFetch.stop();
  },
  async getStatus() {
    const status = await BackgroundFetch.status();
    return status === BackgroundFetch.STATUS_AVAILABLE;
  },
  test() {
    backgrounTaskFunction();
  },
};

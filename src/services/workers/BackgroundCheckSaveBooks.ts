import { getUserStatusBooks } from '~/database/services/getUserStatusBooks';
import { UserBookStatus } from '~/api/enums/UserBookStatus';
import { checkUpdateBook } from './scripts/checkUpdateBook';
import { checkExecuteTask } from './scripts/checkExecuteTask';
import { BookStatus } from '~/api/enums/BookStatus';
import { ConfigStorage } from '~/config';
import { ConfigKey } from '~/config/enums/ConfigKey';
import { DefaultValueConfig } from '~/config/enums/DefaultValueConfig';
import { showBasicNotification } from './scripts/showBasicNotification';
import BackgroundFetch, { HeadlessEvent } from 'react-native-background-fetch';
import { waitTo } from '~/common/utils/WaitTo';


async function backgrounTaskFunction(taskId?: string | HeadlessEvent) {
  if (typeof taskId === 'object') {
    taskId = taskId.taskId;
  }

  console.info('[BackgroundTask] Executed task');

  const taskNotification = await showBasicNotification({
    title: 'Verificando actualizaciones...',
    interruptionLevel: 'passive',
    sound: false,
    sticky: true,
  });

  try {
    // Check Execute Background Task
    await checkExecuteTask();
    console.info('[BackgroundTask] Check success');

    // Init Background Process
    const follow_books = await getUserStatusBooks(UserBookStatus.FOLLOW);
    const wish_books = await getUserStatusBooks(UserBookStatus.WISH);
    const merge_books = [...follow_books, ...wish_books];
    console.info('[BackgroundTask] Get', merge_books);

    // Filter books
    const books = merge_books.filter(value => {
      return (
        value.status === BookStatus.ACTIVO ||
        value.status === BookStatus.PUBLICANDOSE ||
        value.status === BookStatus.EN_ESPERA ||
        value.status === BookStatus.PAUSADO
      );
    });
    console.info('[BackgroundTask] Filters', books);

    if (books.length === 0) {
      await waitTo(1000);
      throw 'No found books.';
    }

    for (const book of books) {
      console.info(`[BackgroundTask] Progress -> ${books.indexOf(book) + 1} de ${books.length}`);
      await checkUpdateBook(book);
    }

  } catch (error) {
    console.error('[BackgroundTask]', error);

    await showBasicNotification({
      title: 'Tarea en segundo plano',
      message: 'La tarea en segundo plano fallo.',
    });
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
        forceAlarmManager: false,
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

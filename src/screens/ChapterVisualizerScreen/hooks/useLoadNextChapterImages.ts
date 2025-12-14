import { useCallback, useEffect, useRef } from 'react';
import { ChapterInterface } from '~/api/interfaces/ChapterInterface';
import { getImagesOfChapter } from '~/api/scripts/getImagesOfChapter';
import { getBestOptionFromChapter } from '~/common/utils/GetBestOptionFromChapter';
import { runObserversInBatches } from '~/common/utils/runObserversInBatches';
import { downloadChapterImages } from '../scripts/downloadChapterImages';
import { showNotification } from '~/services/workers/scripts/showNotification';
import Notifee, {
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import { NotificationChannel } from '~/services/notifications/enums/NotificationChannel';

export function useLoadNextChapterImages(
  initLoad: boolean,
  chapter: ChapterInterface,
  book_url: string,
) {
  const inited = useRef(false);
  const canceled = useRef(false);

  const loadNextChapter = useCallback(async () => {
    const bestOption = getBestOptionFromChapter(chapter.options);
    const chapter_id = bestOption.path.slice(
      bestOption.path.lastIndexOf('/') + 1,
    );

    const { images, originUrl } = await getImagesOfChapter(
      bestOption.path,
      book_url,
    );

    const channelId = await Notifee.createChannel({
      id: NotificationChannel.BACKGROUND_PRELOAD_CHAPTER,
      name: 'Preload next chapter',
      importance: AndroidImportance.MIN,
      visibility: AndroidVisibility.SECRET,
      vibration: false,
    });

    const taskNotification = await showNotification({
      title: 'Precargando siguiente capítulo',
      message: `Cargando imagen ${0} de ${images.length}...`,
      channelId: channelId,
      sticky: true,
      progress: {
        max: images.length,
        current: 0,
        indeterminate: true,
      },
    });

    runObserversInBatches({
      observables: images.map((image) =>
        downloadChapterImages(image, originUrl, chapter_id),
      ),
      concurrency: 2,
      retryOnCatch: true,
      catchErrorOnResult: true,
      checkContinue: () => {
        return !canceled.current;
      },
      onResult: async (_, index) => {
        if (canceled.current) {
          return;
        }

        await taskNotification?.update({
          message: `Cargando imagen ${index} de ${images.length}...`,
          progress: {
            max: images.length,
            current: index,
            indeterminate: false,
          },
        });
      },
      onFinish() {
        taskNotification?.dismiss();
      },
    });
  }, [chapter]);

  useEffect(() => {
    if (initLoad && !inited.current) {
      inited.current = true;
      loadNextChapter();
    }
  }, [chapter, initLoad]);

  useEffect(() => {
    return () => {
      canceled.current = true;
    };
  }, []);
}

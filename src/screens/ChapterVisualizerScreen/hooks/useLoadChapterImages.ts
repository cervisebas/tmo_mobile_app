import { useCallback, useEffect, useRef, useState } from 'react';
import { ImageItemInterface } from '../interfaces/ImageItemInterface';
import {
  downloadChapterImages,
  prepareDownloadChapter,
} from '../scripts/downloadChapterImages';
import { Platform } from 'react-native';
import { runObserversInBatches } from '~/common/utils/runObserversInBatches';

export function useLoadChapterImages(
  images: string[],
  originImagesUrl: string,
  folderPath: string,
  onLoadImage: (index: number, data: ImageItemInterface) => Promise<void>,
  onProgress?: (current: number, max: number) => void,
) {
  const [data, setData] = useState<ImageItemInterface[]>([]);
  const [loaded, setLoaded] = useState(false);
  const progress = useRef<number>(0);
  const canceled = useRef(false);

  const startLoadImages = useCallback(async () => {
    await prepareDownloadChapter(folderPath);

    onProgress?.(progress.current, images.length);

    return runObserversInBatches({
      observables: images.map((image) =>
        downloadChapterImages(image, originImagesUrl, folderPath),
      ),
      concurrency: 2,
      retryOnCatch: true,
      catchErrorOnResult: true,
      checkContinue: () => {
        return !canceled.current;
      },
      onResult: async (data, index) => {
        if (canceled.current) {
          return;
        }

        await onLoadImage(index, {
          name_file: data.fileName,
          loading: false,
          source: Platform.select({
            ios: data.path,
            default: data.fileName,
          }),
        });

        progress.current++;
        onProgress?.(progress.current, images.length);

        setLoaded(images.length === progress.current);
      },
    });
  }, [images, onLoadImage, onProgress, originImagesUrl, folderPath]);

  useEffect(() => {
    setData(
      images.map((v) => ({
        name_file: v.slice(v.lastIndexOf('/') + 1),
        loading: true,
      })),
    );
  }, []);

  return {
    loaded,
    images: data,
    startLoadImages,
    cancelLoad: () => (canceled.current = true),
  };
}

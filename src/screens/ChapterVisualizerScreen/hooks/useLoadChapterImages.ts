import { useCallback, useEffect, useRef, useState } from "react";
import { ImageItemInterface } from "../interfaces/ImageItemInterface";
import { downloadChapterImages, prepareDownloadChapter } from "../scripts/downloadChapterImages";
import { Platform } from "react-native";
import { runPromisesInBatches } from "~/common/utils/RunPromisesInBatches";

export function useLoadChapterImages(
  images: string[],
  originImagesUrl: string,
  path: string,
  onLoadImage: (index: number, data: ImageItemInterface) => Promise<void>,
  onProgress?: (current: number, max: number) => void,
) {
  const [data, setData] = useState<ImageItemInterface[]>([]);
  const [loaded, setLoaded] = useState(false);
  const progress = useRef<number>(0);
  const canceled = useRef(false);

  const startLoadImages = useCallback(async () => {
    await prepareDownloadChapter(path);

    return runPromisesInBatches({
      promises: images.map((image) => downloadChapterImages(image, originImagesUrl, path)),
      concurrency: 3,
      retryOnCatch: true,
      checkContinue() {
        return !canceled.current;
      },
      async onResult(data, index) {
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
        onProgress?.(
          progress.current,
          images.length,
        );

        setLoaded(images.length === progress.current);
      },
    });
  }, [images, onLoadImage, onProgress, originImagesUrl, path]);

  useEffect(() => {
    setData(images.map(v => ({
      name_file: v.slice(v.lastIndexOf('/') + 1),
      loading: true,
    })));
  }, []);

  return {
    loaded,
    images: data,
    startLoadImages,
    cancelLoad: () => canceled.current = true,
  };
}

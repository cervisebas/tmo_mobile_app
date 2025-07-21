import { useCallback, useEffect, useRef, useState } from "react";
import { ImageItemInterface } from "../interfaces/ImageItemInterface";
import { downloadChapterImages } from "../scripts/downloadChapterImages";

export function useLoadChapterImages(
  images: string[],
  originImagesUrl: string,
  path: string,
  onLoadImage: (index: number, data: ImageItemInterface) => void,
  onProgress?: (current: number, max: number) => void,
) {
  const [data, setData] = useState<ImageItemInterface[]>([]);
  const progress = useRef<number>(0);
  const canceled = useRef(false);

  const startLoadImages = useCallback(async () => {
    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      if (canceled.current) {
        break;
      }
      
      try {
        const data = await downloadChapterImages(image, originImagesUrl, path);
  
        progress.current++;
        onProgress?.(
          progress.current,
          images.length,
        );
        onLoadImage(i, {
          name_file: data.fileName,
          loading: false,
          source: data.fileName,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [images, onLoadImage, onProgress, originImagesUrl, path]);

  useEffect(() => {
    setData(images.map(v => ({
      name_file: v.slice(v.lastIndexOf('/') + 1),
      loading: true,
    })));
  }, []);

  return {
    images: data,
    startLoadImages,
    cancelLoad: () => canceled.current = true,
  };
}

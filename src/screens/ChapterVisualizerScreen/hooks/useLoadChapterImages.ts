import { useCallback, useEffect, useRef, useState } from "react";
import { ImageItemInterface } from "../interfaces/ImageItemInterface";
import { downloadChapterImages } from "../scripts/downloadChapterImages";

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
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      let loading = true;
      
      if (canceled.current) {
        break;
      }

      while (loading) {
        if (canceled.current) {
          break;
        }
        
        try {
          const data = await downloadChapterImages(image, originImagesUrl, path);
  
          if (canceled.current) {
            break;
          }
          
          await onLoadImage(i, {
            name_file: data.fileName,
            loading: false,
            source: data.fileName,
          });
          
          progress.current++;
          onProgress?.(
            progress.current,
            images.length,
          );
  
          loading = false;
          setLoaded(images.length === progress.current);
        } catch (error) {
          console.error(error);
        }
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
    loaded,
    images: data,
    startLoadImages,
    cancelLoad: () => canceled.current = true,
  };
}

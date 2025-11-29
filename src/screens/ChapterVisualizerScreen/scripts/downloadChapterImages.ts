import expoInsecureFetch from 'modules/expo-insecure-fetch';
import { ApiMessageError } from '~/api/enums/ApiMessageError';
import { AxiosUserAgent } from '~/common/utils/Axios';
import * as FileSystem from 'expo-file-system';
import { checkOrMakeFolder } from './checkOrMakeFolder';
import { waitTo } from '~/common/utils/WaitTo';
import { Platform } from 'react-native';
import mime from 'mime';
import { Observable } from 'rxjs';

export const DOWNLOAD_IMAGES_FOLDER_PATH = `${FileSystem.documentDirectory}images`;

interface DownloadChapterImagesReturn {
  fileName: string;
  path: string;
}

async function getImageIos(fileName: string, path: string): Promise<DownloadChapterImagesReturn> {
  const base64 = await FileSystem.readAsStringAsync(path, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const mimeType = mime.getType(path) || 'application/octet-stream';

  return {
    fileName: fileName,
    path: `data:${mimeType};base64,${base64}`,
  };
}

export async function prepareDownloadChapter(folder: string) {
  const CHAPTER_FOLDER = `${DOWNLOAD_IMAGES_FOLDER_PATH}/${folder}`;
  
  await checkOrMakeFolder(DOWNLOAD_IMAGES_FOLDER_PATH);
  await checkOrMakeFolder(CHAPTER_FOLDER);
}

export function downloadChapterImages(url: string, originUrl: string, folder: string) {
  return new Observable<DownloadChapterImagesReturn>((subs) => {
    (async () => {
      try {
        console.log('downloadChapterImages:', url, originUrl, folder);
  
        const CHAPTER_FOLDER = `${DOWNLOAD_IMAGES_FOLDER_PATH}/${folder}`;
        const FILE_NAME = url.slice(url.lastIndexOf('/') + 1);
        const IMAGE_PATH = `${CHAPTER_FOLDER}/${FILE_NAME}`;
    
        const {exists: IS_EXIST} = await FileSystem.getInfoAsync(IMAGE_PATH);
    
        if (IS_EXIST) {
          await waitTo(100);
    
          if (Platform.OS === 'ios') {
            subs.next(await getImageIos(FILE_NAME, IMAGE_PATH));
            subs.complete();
            return;
          }
    
          subs.next({
            fileName: FILE_NAME,
            path: IMAGE_PATH,
          });
          subs.complete();
          return;
        }
    
        await checkOrMakeFolder(DOWNLOAD_IMAGES_FOLDER_PATH);
        await checkOrMakeFolder(CHAPTER_FOLDER);
    
        const data = await expoInsecureFetch.fetch(
          url,
          'GET',
          {
            'User-Agent': AxiosUserAgent,
            'Referer': originUrl,
          },
        );
    
        await FileSystem.writeAsStringAsync(
          IMAGE_PATH,
          data.body,
          {encoding: 'base64'},
        );
    
        if (Platform.OS === 'ios') {
          subs.next(await getImageIos(FILE_NAME, IMAGE_PATH));
          subs.complete();
          return;
        }
    
        subs.next({
          fileName: FILE_NAME,
          path: IMAGE_PATH,
        });
        subs.complete();
      } catch (error) {
        console.error(error);
        subs.error(typeof error === 'string' ? error : ApiMessageError.REQUEST);
      }
    })();
  });
}

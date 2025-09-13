import expoInsecureFetch from 'modules/expo-insecure-fetch';
import { ApiMessageError } from '~/api/enums/ApiMessageError';
import { AxiosUserAgent } from '~/common/utils/Axios';
import * as FileSystem from 'expo-file-system';
import { checkOrMakeFolder } from './checkOrMakeFolder';
import { waitTo } from '~/common/utils/WaitTo';
import { Platform } from 'react-native';
import mime from 'mime';

export const DOWNLOAD_IMAGES_FOLDER_PATH = `${FileSystem.Paths.document}images`;

async function getImageIos(fileName: string, path: string) {
  const base64 = await FileSystem.readAsStringAsync(path, {
    encoding: 'base64',
  });

  const mimeType = mime.getType(path) || 'application/octet-stream';

  return {
    fileName: fileName,
    path: `data:${mimeType};base64,${base64}`,
  };
}

export async function downloadChapterImages(url: string, originUrl: string, folder: string) {
  try {
    const CHAPTER_FOLDER = `${DOWNLOAD_IMAGES_FOLDER_PATH}/${folder}`;
    const FILE_NAME = url.slice(url.lastIndexOf('/') + 1);
    const IMAGE_PATH = `${CHAPTER_FOLDER}/${FILE_NAME}`;

    const {exists: IS_EXIST} = await FileSystem.getInfoAsync(IMAGE_PATH);

    if (IS_EXIST) {
      await waitTo(100);

      if (Platform.OS === 'ios') {
        return getImageIos(FILE_NAME, IMAGE_PATH);
      }

      return {
        fileName: FILE_NAME,
        path: IMAGE_PATH,
      };
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
      return getImageIos(FILE_NAME, IMAGE_PATH);
    }

    return {
      fileName: FILE_NAME,
      path: IMAGE_PATH,
    };
  } catch (error) {
    console.error(error);
    throw typeof error === 'string' ? error : ApiMessageError.REQUEST;
  }

}

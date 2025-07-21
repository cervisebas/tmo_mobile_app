import * as FileSystem from 'expo-file-system';

export async function checkOrMakeFolder(path: string) {
  const info = await FileSystem.getInfoAsync(path);
  
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(path);
  } 
}

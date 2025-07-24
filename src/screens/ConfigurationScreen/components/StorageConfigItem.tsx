import React, { useCallback, useEffect, useState } from "react";
import { Platform, StyleSheet, ToastAndroid } from "react-native";
import { Text } from "react-native-paper";
import ItemWithIcon from "~/common/components/ItemWithIcon";
import * as FileSystem from 'expo-file-system';
import { DOWNLOAD_IMAGES_FOLDER_PATH } from "~/screens/ChapterVisualizerScreen/scripts/downloadChapterImages";

export const StorageConfigItem = React.memo(function () {
  const [storage, setStorage] = useState('0 MB');

  const calculeStorageSize = useCallback(async () => {
    try {
      const info = await FileSystem.getInfoAsync(DOWNLOAD_IMAGES_FOLDER_PATH);
      
      if ('size' in info) {
        const mb = info.size / (1024 ** 2);
        
        setStorage(`${mb.toFixed(2)} MB`);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const clickCalculeStorageSize = useCallback(() => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(
        'Actualizando...',
        ToastAndroid.SHORT,
      );
    }

    calculeStorageSize();
  }, []);

  useEffect(() => {
    calculeStorageSize();
  }, []);

  return (
    <ItemWithIcon
      leftIcon={'memory'}
      title={'Espacio de descargas'}
      description={`Espacio ocupado por los mangas descargados en el almacenamiento del dispositivo.`}
      descriptionNumberOfLines={6}
      right={rp => (
        <Text
          variant={'labelLarge'}
          style={[rp.style, styles.right_text]}
        >
          {storage}
        </Text>
      )}
      onPress={clickCalculeStorageSize}
    />
  );
});

const styles = StyleSheet.create({
  right_text: {
    textAlignVertical: 'center',
    height: '100%',
  },
});

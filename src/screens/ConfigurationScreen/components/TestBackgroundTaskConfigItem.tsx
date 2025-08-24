import React, { useCallback } from "react";
import ItemWithIcon from "~/common/components/ItemWithIcon";
import BackgroundCheckSaveBooks from "~/services/workers/BackgroundCheckSaveBooks";
import { ToastAndroid } from "react-native";

export const TestBackgroundTaskConfigItem = React.memo(function () {
  const testNow = useCallback(async () => {
    /* const {isAvailable, isRegister} = await BackgroundCheckSaveBooks.getStatus();

    if (!isAvailable || !isRegister) {
      ToastAndroid.show(
        'Tarea en segundo plano no registrada',
        ToastAndroid.SHORT,
      );
      return;
    } */
    
    setTimeout(() => {
      try {
        ToastAndroid.show(
          'Ejecutando....',
          ToastAndroid.SHORT,
        );

        BackgroundCheckSaveBooks.test();
      } catch (error) {
        console.error(error);
      }
    }, 3000);
  }, []);

  return (
    <ItemWithIcon
      title={'Probar tarea en segundo plano'}
      description={'Ejecuta la tarea en segundo plano para probar su funcionamiento.'}
      descriptionNumberOfLines={6}
      leftIcon={'bug-outline'}
      onPress={testNow}
    />
  );
});
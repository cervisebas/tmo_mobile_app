import React, { useCallback } from "react";
import { ToastAndroid } from "react-native";
import ItemWithIcon from "~/common/components/ItemWithIcon";
import { ProvisionalPersistenceStorage } from "~/common/storage/provisional-persistence-service/constants/ProvisionalPersistenceStorage";

export const TestDropProvicionalStorage = React.memo(function () {
  const removeAllBooks = useCallback(() => {
    ProvisionalPersistenceStorage.clearAll();

    ToastAndroid.show('Eliminado!', ToastAndroid.SHORT);
  }, []);

  return (
    <ItemWithIcon
      title={'Vaciar almacenamiento provicional'}
      description={'Elimina todos los datos de los libros almacenados provicionalmente para la verificación de actualizaciones.'}
      descriptionNumberOfLines={6}
      leftIcon={'book-remove-multiple-outline'}
      onPress={removeAllBooks}
    />
  );
});

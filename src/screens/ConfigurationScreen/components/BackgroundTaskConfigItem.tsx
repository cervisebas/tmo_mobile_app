import React from "react";
import { ItemWithCheckbox } from "~/common/components/ItemWithCheckbox";
import { useBackgroundTask } from "~/config/hooks/useBackgroundTask";

export const BackgroundTaskConfigItem = React.memo(function () {
  const {value, change} = useBackgroundTask();
  
  return (
    <ItemWithCheckbox
      title={'Notificar sobre actualizaciones'}
      description={'Recibí avisos cuando haya nuevos capítulos de los mangas que marcaste como favorito o que estés siguiendo.'}
      descriptionNumberOfLines={6}
      checked={value}
      onChecked={change}
      useSwitch={true}
      leftIcon={'message-badge-outline'}
    />
  );
});

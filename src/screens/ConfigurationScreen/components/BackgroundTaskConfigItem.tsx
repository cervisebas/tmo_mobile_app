import React, { useContext } from "react";
import { Divider } from "react-native-paper";
import { ItemWithCheckbox } from "~/common/components/ItemWithCheckbox";
import ItemWithOptions from "~/common/components/ItemWithOptions";
import { useBackgroundTask } from "~/config/hooks/useBackgroundTask";
import { BackgroundTaskListInterval } from "../constants/BackgroundTaskListInterval";
import { useBackgroundTaskInterval } from "~/config/hooks/useBackgroundTaskInterval";
import { ThemeContext } from "~/common/providers/ThemeProvider";

export const BackgroundTaskConfigItem = React.memo(function () {
  const {theme} = useContext(ThemeContext);

  const {value, change} = useBackgroundTask();
  const {value: valueInterval, change: changeInterval} = useBackgroundTaskInterval();
  
  return (
    <React.Fragment>
      <ItemWithCheckbox
        title={'Notificar sobre actualizaciones'}
        titleNumberOfLines={2}
        description={'Recibí avisos cuando haya nuevos capítulos de los mangas que marcaste como favorito o que estés siguiendo.'}
        descriptionNumberOfLines={6}
        checked={value}
        onChecked={change}
        useSwitch={true}
        leftIcon={'message-badge-outline'}
      />

      <Divider />

      <ItemWithOptions
        icon={'timer-sand'}
        title={'Tiempo de actualización'}
        titleNumberOfLines={2}
        //description={'Define cada cuánto tiempo se revisarán nuevas actualizaciones en los mangas que seguís o marcaste como favoritos.'}
        descriptionNumberOfLines={6}
        options={BackgroundTaskListInterval}
        value={valueInterval}
        onChange={changeInterval}
        disabled={value}
        style={{
          backgroundColor: value
            ? theme.colors.onSurfaceDisabled
            : undefined
          ,
        }}
      />
    </React.Fragment>
  );
});

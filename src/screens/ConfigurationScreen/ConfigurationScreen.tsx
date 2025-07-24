import { Appbar, Divider, List } from "react-native-paper";
import { AppbarHeader } from "~/common/components/AppbarHeader";
import PrincipalView from "~/common/components/PrincipalView";
import StackScreenProps from "~/common/interfaces/StackScreenProps";
import SafeArea from "~/common/components/SafeArea";
import { DatabaseConfigItem } from "./components/DatabaseConfigItem";
import { BackgroundTaskConfigItem } from "./components/BackgroundTaskConfigItem";
import { TestNotificationConfigItem } from "./components/TestNotificationConfigItem";
import { StorageConfigItem } from "./components/StorageConfigItem";

export function ConfigurationScreen(props: StackScreenProps) {
  return (
    <PrincipalView hideKeyboard>
      <AppbarHeader mode={'small'}>
        <Appbar.Action
          icon={'menu'}
          onPress={props.navigation.openDrawer}
        />
        <Appbar.Content
          title={'Configuraciones'}
        />
      </AppbarHeader>

      <SafeArea.ScrollView expandDisableTop className={'flex-1'}>
        <List.Section>
          <List.Subheader>
            Almacenamiento
          </List.Subheader>

          <DatabaseConfigItem />

          <Divider />

          <StorageConfigItem />
        </List.Section>
        
        <List.Section>
          <List.Subheader>
            Servicios
          </List.Subheader>

          <BackgroundTaskConfigItem />

          <Divider />

          <TestNotificationConfigItem />
        </List.Section>
      </SafeArea.ScrollView>
    </PrincipalView>
  );
}

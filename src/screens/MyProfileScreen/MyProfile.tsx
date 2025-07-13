import { Appbar } from "react-native-paper";
import { AppbarHeader } from "~/common/components/AppbarHeader";
import PrincipalView from "~/common/components/PrincipalView";
import { DrawerScreenProps } from "~/common/interfaces/DrawerScreenProps";

export function MyProfileScreen(props: DrawerScreenProps) {
  return (
    <PrincipalView hideKeyboard>
      <AppbarHeader mode={'small'}>
        <Appbar.Action
          icon={'menu'}
          onPress={props.navigation.openDrawer}
        />
        <Appbar.Content
          title={'Mi Perfil'}
        />
      </AppbarHeader>
    </PrincipalView>
  );
}
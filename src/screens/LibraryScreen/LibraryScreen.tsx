import { View } from "react-native";
import { Appbar } from "react-native-paper";
import { toast } from "sonner-native";
import { AppbarHeader } from "~/common/components/AppbarHeader";
import PrincipalView from "~/common/components/PrincipalView";
import { DrawerScreenProps } from "~/common/interfaces/DrawerScreenProps";

export function LibraryScreen(props: DrawerScreenProps) {
  return (
    <PrincipalView>
      <AppbarHeader mode={'small'}>
        <Appbar.Action
          icon={'menu'}
          onPress={props.navigation.openDrawer}
        />
        <Appbar.Content
          title={'Biblioteca'}
        />
        <Appbar.Action
          icon={'plus'}
          onPress={() => {
            toast('Hola');
          }}
        />
      </AppbarHeader>

      <View className={'flex-1'}>
        
      </View>
    </PrincipalView>
  );
}
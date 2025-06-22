import PrincipalView from "~/common/components/PrincipalView";
import { TopTabNavigator } from "./navigation/TopTabNavigator";
import { Appbar } from "react-native-paper";
import { AppbarHeader } from "~/common/components/AppbarHeader";
import { DrawerScreenProps } from "~/common/interfaces/DrawerScreenProps";
import { useEffect } from "react";
import { getAllPopulars } from "~/api/scripts/getAllPopulars";
import { useApiPopulars } from "~/api/hooks/useApiPopulars";

export function PopularPage(props: DrawerScreenProps) {
  useApiPopulars();

  return (
    <PrincipalView>
      <AppbarHeader mode={'small'}>
        <Appbar.Action
          icon={'menu'}
          onPress={props.navigation.openDrawer}
        />
        <Appbar.Content
          title={'Populares'}
        />
      </AppbarHeader>
      <TopTabNavigator />
    </PrincipalView>
  );
}

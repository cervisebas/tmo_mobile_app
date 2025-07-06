import { Keyboard, View } from "react-native";
import { Appbar, Tooltip } from "react-native-paper";
import { AppbarHeader } from "~/common/components/AppbarHeader";
import PrincipalView from "~/common/components/PrincipalView";
import { DrawerScreenProps } from "~/common/interfaces/DrawerScreenProps";
import { LibrarySearchBar } from "./components/LibrarySearchBar";
import React, { useRef } from "react";
import { SearchFilterSheet, SearchFilterSheetRef } from "./sheets/SearchFilterSheet";

export function LibraryScreen(props: DrawerScreenProps) {
  const refSearchFilterSheet = useRef<SearchFilterSheetRef>(null);

  return (
    <React.Fragment>
      <PrincipalView hideKeyboard>
        <AppbarHeader mode={'small'}>
          <Appbar.Action
            icon={'menu'}
            onPress={props.navigation.openDrawer}
          />
          <Appbar.Content
            title={'Biblioteca'}
          />

          <Tooltip title={'Filtros'}>
            <Appbar.Action
              icon={'filter-variant'}
              onPress={() => {
                Keyboard.dismiss();
                refSearchFilterSheet.current?.show();
              }}
            />
          </Tooltip>
        </AppbarHeader>

        <LibrarySearchBar />

        <View className={'flex-1'}>
          
        </View>
      </PrincipalView>

      <SearchFilterSheet ref={refSearchFilterSheet} />
    </React.Fragment>
  );
}
import { Appbar, Tooltip } from "react-native-paper";
import { AppbarHeader } from "~/common/components/AppbarHeader";
import PrincipalView from "~/common/components/PrincipalView";
import { DrawerScreenProps } from "~/common/interfaces/DrawerScreenProps";
import { BookStatusPanel } from "../BookInfoScreen/components/BookStatusPanel";
import { useProfileBooks } from "./hooks/useProfileBooks";
import { useCallback, useState } from "react";
import { UserBookStatus } from "~/api/enums/UserBookStatus";
import SafeArea from "~/common/components/SafeArea";
import ListOfBooks from "~/common/components/ListOfBooks";
import { View } from "react-native";
import { refNavigation } from "~/common/utils/Ref";
import { StackScreens } from "~/enums/StackScreens";

export function MyProfileScreen(props: DrawerScreenProps) {
  const [select, setSelect] = useState(UserBookStatus.WATCH);
  const {stateList, books} = useProfileBooks(select);

  const goToHistory = useCallback(() => {
    refNavigation.current?.navigate(
      StackScreens.USER_HISTORY,
    );
  }, []);

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

        <Tooltip title={'Historial'}>
          <Appbar.Action
            icon={'history'}
            onPress={goToHistory}
          />
        </Tooltip>
      </AppbarHeader>

      <SafeArea.View
        className={'flex-1'}
        expandDisableTop
        expandDisableBottom
      >
        <View className={'w-full mx-[12]'}>
          <BookStatusPanel
            {...stateList}
            onToggleStatus={setSelect}
          />
        </View>

        <View className={'flex-1'}>
          <ListOfBooks
            data={books}
            showEmpty={true}
            emptyIcon={'playlist-remove'}
            emptyMessage={'No hay elementos'}
            keyExtractor={'my-profile-item-{id}'}
          />
        </View>

      </SafeArea.View>
    </PrincipalView>
  );
}
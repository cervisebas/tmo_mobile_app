import { Appbar } from "react-native-paper";
import { AppbarHeader } from "~/common/components/AppbarHeader";
import PrincipalView from "~/common/components/PrincipalView";
import { DrawerScreenProps } from "~/common/interfaces/DrawerScreenProps";
import { BookStatusPanel } from "../BookInfoScreen/components/BookStatusPanel";
import { useProfileBooks } from "./hooks/useProfileBooks";
import { useState } from "react";
import { UserBookStatus } from "~/api/enums/UserBookStatus";
import SafeArea from "~/common/components/SafeArea";
import ListOfBooks from "~/common/components/ListOfBooks";
import { View } from "react-native";

export function MyProfileScreen(props: DrawerScreenProps) {
  const [select, setSelect] = useState(UserBookStatus.WATCH);
  const {stateList, books} = useProfileBooks(select);

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
            keyExtractor={'my-profile-item-{id}'}
          />
        </View>

      </SafeArea.View>
    </PrincipalView>
  );
}
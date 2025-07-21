import { useMemo } from "react";
import { Appbar, List } from "react-native-paper";
import { AppbarHeader } from "~/common/components/AppbarHeader";
import ItemWithIcon from "~/common/components/ItemWithIcon";
import PrincipalView from "~/common/components/PrincipalView";
import StackScreenProps from "~/common/interfaces/StackScreenProps";
import { useSavedBooks } from "./hooks/useSavedBooks";
import SafeArea from "~/common/components/SafeArea";

export function ConfigurationScreen(props: StackScreenProps) {
  const {booksWithoutInfo, booksWithInfo} = useSavedBooks();

  const databaseDescription = useMemo(
    () => {
      let description = '';
      description += `Libros con información: ${booksWithInfo}\n`;
      description += `Libros sin información: ${booksWithoutInfo}`;

      return description;
    },
    [booksWithoutInfo, booksWithInfo],
  );
  
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

          <ItemWithIcon
            title={'Base de datos'}
            leftIcon={'database'}
            description={databaseDescription}
          />
        </List.Section>
      </SafeArea.ScrollView>
    </PrincipalView>
  );
}

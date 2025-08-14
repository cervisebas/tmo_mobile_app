import { useCallback, useContext } from "react";
import { ListRenderItemInfo, View } from "react-native";
import { Appbar, Tooltip } from "react-native-paper";
import { AppbarHeader } from "~/common/components/AppbarHeader";
import FlatListDynamicItems from "~/common/components/FlatListDynamicItems";
import PrincipalView from "~/common/components/PrincipalView";
import StackScreenProps from "~/common/interfaces/StackScreenProps";
import { UserChapterHistoryInterface } from "~/database/interfaces/UserChapterHistoryInterface";
import { useUserHistory } from "~/services/user-history/hooks/useUserHistory";
import { UserHistoryItem } from "./components/UserHistoryItem";
import { refDialog } from "~/common/utils/Ref";
import { UserHistory } from "~/services/user-history";
import { getBookInfo } from "~/api/scripts/getBookInfo";
import { onPressChapterItem } from "../BookInfoScreen/scripts/onPressChapterItem";
import { ThemeContext } from "~/common/providers/ThemeProvider";
import { DatabaseSave } from "~/database/classes/DatabaseSave";
import { DatabaseService } from "~/database/classes/DatabaseService";

export function UserHistoryScreen(props: StackScreenProps) {
  const {data, refresh, loading, reload} = useUserHistory();
  const {theme} = useContext(ThemeContext);

  const removeAllItems = useCallback(() => {
    refDialog.current?.showAlert({
      message: '¿Realmente desea eliminar todos los elementos del historial?',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Aceptar',
          async onPress() {
            try {
              refDialog.current?.showLoading('Removiendo elementos...');
              await UserHistory.removeAllUserHistory();
              reload();
        
              refDialog.current?.showLoading(false);
            } catch (error) {
              console.error(error);
              refDialog.current?.showLoading(false);
            }
          },
        },
      ],
    })
  }, []);

  const removeItem = useCallback(async (id: number) => {
    try {
      refDialog.current?.showLoading('Removiendo elemento...');
      await UserHistory.removeUserHistory(id);

      refDialog.current?.showLoading(false);
    } catch (error) {
      console.error(error);
      refDialog.current?.showLoading(false);
    }
  }, []);

  const actionItem = useCallback(async (data: UserChapterHistoryInterface) => {
    try {
      refDialog.current?.showLoading('Obteniendo información...');
      try {
        const dbSave = new DatabaseSave();
        const info = await getBookInfo(data.book.url);

        await dbSave.saveBook(info);
      } catch (error) {
        console.error(error);
      }
      
      const dbService = new DatabaseService();
      const dbInfo = await dbService.getDatabaseBookInfo(null, data.book.id);
      onPressChapterItem({
        chapter: data.chapter,
        primaryColor: theme.colors.primary,
        book_url: dbInfo!.url,
        id_bookinfo: data.book.id!,
        book_title: data.book.title,
        chapters: dbInfo?.chapters!,
      });
      
      refDialog.current?.showLoading(false);
    } catch (error) {
      console.error(error);
      refDialog.current?.showLoading(false);
    }
  }, []);

  const renderItem = useCallback(({item}: ListRenderItemInfo<UserChapterHistoryInterface>) => (
    <UserHistoryItem
      date={item.date}
      title={item.book.title}
      chapter={item.chapter.title}
      onDelete={() => removeItem(item.id)}
      onPress={() => actionItem(item)}
    />
  ), []);

  return (
    <PrincipalView>
      <AppbarHeader mode={'small'}>
        <Appbar.BackAction
          onPress={props.navigation.goBack}
        />
        <Appbar.Content
          title={'Historial'}
        />

        <Tooltip title={'Limpiar historial'}>
          <Appbar.Action
            icon={'delete-sweep-outline'}
            disabled={!data?.length || data.length < 2}
            onPress={removeAllItems}
          />
        </Tooltip>
      </AppbarHeader>

      <View className={'flex-1 overflow-hidden'}>
        <FlatListDynamicItems
          data={data}
          renderItem={renderItem}
          refreshing={refresh}
          loading={loading}
          heightItems={72}
          useDivider={true}
          onRefresh={reload}
          expandDisableTop={true}
          expandArea={{
            top: 8,
          }}
          emptyMessage={'No hay elementos en el historial'}
        />
      </View>

    </PrincipalView>
  );
}

import { StyleSheet, View } from "react-native";
import { Appbar, Button } from "react-native-paper";
import { AppbarHeader } from "~/common/components/AppbarHeader";
import ListOfBooks from "~/common/components/ListOfBooks";
import { LoadingErrorContent } from "~/common/components/LoadingErrorContent";
import PrincipalView from "~/common/components/PrincipalView";
import SafeArea from "~/common/components/SafeArea";
import { LibrarySearchBar, LibrarySearchBarRef } from "../LibraryScreen/components/LibrarySearchBar";
import StackScreenProps from "~/common/interfaces/StackScreenProps";
import { useCallback, useRef } from "react";
import { LibraryQueriesInterface } from "~/api/interfaces/LibraryQueriesInterface";
import { LibraryQueries, LibraryStatus, LibraryTranslationStatus } from "~/api/enums/LibraryQueries";
import { LibraryGenders } from "~/api/enums/LibraryGenders";
import { useApiLibrarySearch } from "~/api/hooks/useApiLibrarySearch";

export function GenderListScreen(props: StackScreenProps) {
  const params = props.route.params as {
    gender_title: string;
    gender_value: string;
  };

  const refLibrarySearchBar = useRef<LibrarySearchBarRef>(null);

  const getFilters = useCallback((page: number) => {
    const filters: Partial<LibraryQueriesInterface> = {
      [LibraryQueries.GENDERS]: [params.gender_value] as unknown as LibraryGenders[],
      [LibraryQueries.TITLE]: refLibrarySearchBar.current?.getValue()!,
      [LibraryQueries.PAGINATOR]: '1',
      [LibraryQueries.PAGE]: String(page),
      [LibraryQueries.STATUS]: LibraryStatus.ALL,
      [LibraryQueries.TRANSLATION_STATUS]: LibraryTranslationStatus.ALL,
    };

    return filters;
  }, []);

  const {loading, refresh, url, data, error, nextPage, goNextPage, fullReload} = useApiLibrarySearch(getFilters);

  return (
    <PrincipalView hideKeyboard>
      <AppbarHeader mode={'small'}>
        <Appbar.BackAction
          onPress={props.navigation.goBack}
        />
        <Appbar.Content
          title={params.gender_title}
        />
      </AppbarHeader>

      <LibrarySearchBar
        ref={refLibrarySearchBar}
        onSearch={fullReload}
      />

      <LoadingErrorContent loading={loading} error={error}>
        <ListOfBooks
          data={data!}
          referer={url}
          keyExtractor={'library-search-item-{id}'}
          ListFooterComponent={
            nextPage !== undefined
              ? (
                <View className={'w-full py-[6] flex-row justify-center'}>
                  <Button
                    mode={'contained'}
                    loading={refresh}
                    disabled={refresh}
                    style={styles.loadMore}
                    onPress={goNextPage}
                  >
                    CARGAR MÁS
                  </Button>
                </View>
              )
              : null
          }
        />
      </LoadingErrorContent>

      <SafeArea.FAB
        icon={'loading'}
        loading={true}
        visible={!loading && refresh}
        style={styles.fab_loading}
        expandArea={{
          right: 18,
          bottom: 18,
        }}
      />
    </PrincipalView>
  );
}

const styles = StyleSheet.create({
  loadMore: {
    flexBasis: 'auto',
  },
  fab_loading: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});

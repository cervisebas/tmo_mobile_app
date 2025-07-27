import { Keyboard, StyleSheet, View } from "react-native";
import { Appbar, Button } from "react-native-paper";
import { AppbarHeader } from "~/common/components/AppbarHeader";
import PrincipalView from "~/common/components/PrincipalView";
import { DrawerScreenProps } from "~/common/interfaces/DrawerScreenProps";
import { LibrarySearchBar, LibrarySearchBarRef } from "./components/LibrarySearchBar";
import React, { useCallback, useRef } from "react";
import { SearchFilterSheet, SearchFilterSheetRef } from "./sheets/SearchFilterSheet";
import { LibraryQueriesInterface } from "~/api/interfaces/LibraryQueriesInterface";
import { LibraryQueries, LibraryStatus, LibraryTranslationStatus } from "~/api/enums/LibraryQueries";
import { useApiLibrarySearch } from "~/api/hooks/useApiLibrarySearch";
import { LoadingErrorContent } from "~/common/components/LoadingErrorContent";
import ListOfBooks from "../../common/components/ListOfBooks";
import SafeArea from "~/common/components/SafeArea";
import { AppbarActionFilter, AppbarActionFilterRef } from "./components/AppbarActionFilter";

export function LibraryScreen(props: DrawerScreenProps) {
  const refSearchFilterSheet = useRef<SearchFilterSheetRef>(null);
  const refLibrarySearchBar = useRef<LibrarySearchBarRef>(null);
  const refAppbarActionFilter = useRef<AppbarActionFilterRef>(null);
  

  const getFilters = useCallback((page: number) => {
    const filters: LibraryQueriesInterface = {
      ...refSearchFilterSheet.current?.getFilters()!,
      [LibraryQueries.TITLE]: refLibrarySearchBar.current?.getValue()!,
      [LibraryQueries.PAGINATOR]: '1',
      [LibraryQueries.PAGE]: String(page),
      [LibraryQueries.STATUS]: LibraryStatus.ALL,
      [LibraryQueries.TRANSLATION_STATUS]: LibraryTranslationStatus.ALL,
    };

    refAppbarActionFilter.current?.setQuantityFilter(
      refSearchFilterSheet.current?.activeFilters() ?? 0,
    );

    return filters;
  }, []);

  const {loading, refresh, url, data, error, nextPage, goNextPage, fullReload} = useApiLibrarySearch(getFilters);

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

          <AppbarActionFilter
            ref={refAppbarActionFilter}
            onPress={() => {
              Keyboard.dismiss();
              refSearchFilterSheet.current?.show();
            }}
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

      <SearchFilterSheet
        ref={refSearchFilterSheet}
        onFilter={fullReload}
      />
    </React.Fragment>
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

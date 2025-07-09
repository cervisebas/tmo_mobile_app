import { Keyboard, View } from "react-native";
import { Appbar, Tooltip } from "react-native-paper";
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
import { ApiEndpoint } from "~/api/enums/ApiEndpoint";

export function LibraryScreen(props: DrawerScreenProps) {
  const refSearchFilterSheet = useRef<SearchFilterSheetRef>(null);
  const refLibrarySearchBar = useRef<LibrarySearchBarRef>(null);

  const getFilters = useCallback(() => {
    const filters: LibraryQueriesInterface = {
      ...refSearchFilterSheet.current?.getFilters()!,
      [LibraryQueries.TITLE]: refLibrarySearchBar.current?.getValue()!,
      [LibraryQueries.PAGINATOR]: '1',
      [LibraryQueries.PAGE]: '1',
      [LibraryQueries.STATUS]: LibraryStatus.ALL,
      [LibraryQueries.TRANSLATION_STATUS]: LibraryTranslationStatus.ALL,
    };

    return filters;
  }, []);

  const {loading, refresh, url, data, error, reload, fullReload} = useApiLibrarySearch(getFilters);

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

        <LibrarySearchBar
          ref={refLibrarySearchBar}
          onSearch={fullReload}
        />

        <LoadingErrorContent loading={loading} error={error}>
          <ListOfBooks
            data={data!}
            referer={url}
            keyExtractor={'library-search-item-{id}'}
          />
        </LoadingErrorContent>
      </PrincipalView>

      <SearchFilterSheet
        ref={refSearchFilterSheet}
        onFilter={fullReload}
      />
    </React.Fragment>
  );
}
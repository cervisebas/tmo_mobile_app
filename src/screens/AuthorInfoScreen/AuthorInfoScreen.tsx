import { ScrollViewWithHeaders } from '@codeherence/react-native-header';
import PrincipalView from '~/common/components/PrincipalView';
import StackScreenProps from '~/common/interfaces/StackScreenProps';
import { AuthorHeader } from './components/AuthorHeader';
import { BookStaffInterface } from '~/api/interfaces/BookStaffInterface';
import useSafeArea from '~/common/hooks/useSafeArea';
import useDimension from '~/common/hooks/useDimension';
import { LoadingErrorContent } from '~/common/components/LoadingErrorContent';
import ListOfBooks from '~/common/components/ListOfBooks';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useApiLibrarySearch } from '~/api/hooks/useApiLibrarySearch';
import { LibraryFilterby, LibraryQueries } from '~/api/enums/LibraryQueries';
import { LibraryQueriesInterface } from '~/api/interfaces/LibraryQueriesInterface';
import { useCallback } from 'react';
import SafeArea from '~/common/components/SafeArea';

export function AuthorInfoScreen(props: StackScreenProps) {
  const info = props.route.params as BookStaffInterface;
  const { left, right, bottom } = useSafeArea(12, 60);
  const [, WINDOW_HEIGHT] = useDimension('window');

  const getFilters = useCallback((page: number) => {
    const filters: LibraryQueriesInterface = {
      [LibraryQueries.TITLE]: info.search_name,
      [LibraryQueries.PAGINATOR]: '1',
      [LibraryQueries.PAGE]: String(page),
      [LibraryQueries.FILTER_BY]: LibraryFilterby.AUTHOR,
    };

    return filters;
  }, []);

  const { loading, refresh, url, data, error, nextPage, goNextPage } =
    useApiLibrarySearch(getFilters);

  return (
    <PrincipalView>
      <ScrollViewWithHeaders
        absoluteHeader
        disableAutoFixScroll
        HeaderComponent={(_props) => (
          <AuthorHeader
            {..._props}
            link={info.url}
            title={info.name}
            picture={info.picture}
            onBackPress={props.navigation.goBack}
          />
        )}
        LargeHeaderComponent={() => <View className={'h-[20] w-full'} />}
        contentContainerStyle={{
          flexGrow: loading ? 1 : undefined,
          paddingLeft: left,
          paddingRight: right,
          paddingBottom: bottom + WINDOW_HEIGHT / 2,
        }}
      >
        <LoadingErrorContent loading={loading} error={error}>
          <View className={'mt-[12] gap-[24]'}>
            <View className={'gap-[8]'}>
              <Text variant={'titleLarge'}>Nombre</Text>

              <Text variant={'titleMedium'}>{info.name}</Text>
            </View>

            <View className={'gap-[8]'}>
              <Text variant={'titleLarge'}>Trabajos de libros</Text>

              <ListOfBooks
                data={data!}
                referer={url}
                keyExtractor={'library-search-item-{id}'}
                noScroll={true}
                ListFooterComponent={
                  nextPage !== undefined ? (
                    <View className={'w-full flex-row justify-center py-[6]'}>
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
                  ) : null
                }
              />
            </View>
          </View>
        </LoadingErrorContent>
      </ScrollViewWithHeaders>

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

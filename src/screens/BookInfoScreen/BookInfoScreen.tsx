import { ScrollViewWithHeaders } from "@codeherence/react-native-header";
import StackScreenProps from "~/common/interfaces/StackScreenProps";
import { Header } from "./components/Header";
import { LargeHeader } from "./components/LargeHeader";
import PrincipalView from "~/common/components/PrincipalView";
import { Divider, FAB, Text } from "react-native-paper";
import { BookInfoInterface } from "~/api/interfaces/BookInfoInterface";
import { useApiBookInfo } from "~/api/hooks/useApiBookInfo";
import { LoadingErrorContent } from "~/common/components/LoadingErrorContent";
import { StyleSheet, View } from "react-native";
import SafeArea from "~/common/components/SafeArea";
import useSafeArea from "~/common/hooks/useSafeArea";
import { GenderList } from "./components/GenderList";

export function BookInfoScreen(props: StackScreenProps) {
  const info = props.route.params as BookInfoInterface;
  const {data, error, loading, refresh} = useApiBookInfo(info.url);
  const {left, right, bottom} = useSafeArea(12, 60);

  return (
    <PrincipalView>
      <ScrollViewWithHeaders
        absoluteHeader
        disableAutoFixScroll
        HeaderComponent={_props => (
          <Header
            {..._props}
            link={info.url}
            title={info.title}
            loading={loading}
            type={data?.type}
            stars={data?.stars}
            picture={data?.picture}
            wallpaper={data?.wallpaper}
            onBackPress={props.navigation.goBack}
          />
        )}
        LargeHeaderComponent={!loading
          ? _props => (
            <LargeHeader
              {..._props}
              status={data?.user_status!}
            />
          )
          : undefined
        }
        contentContainerStyle={{
          paddingLeft: left,
          paddingRight: right,
          paddingBottom: bottom,
        }}
      >
        <LoadingErrorContent
          loading={loading}
          error={error}
        >
          <View className={'mt-[12] gap-[24]'}>
            <View className={'gap-[8]'}>
              <Text variant={'titleLarge'}>Titulos</Text>

              <Text variant={'titleMedium'}>
                {data?.title}
              </Text>

              {data?.subtitle && (
                <Text variant={'labelMedium'}>
                  {data?.subtitle}
                </Text>
              )}
            </View>
            
            <Divider />

            <View className={'gap-[8]'}>
              <Text variant={'titleLarge'}>Descripción</Text>

              <Text variant={'bodyMedium'}>
                {data?.description!}
              </Text>
            </View>
            
            <Divider />

            <GenderList data={data?.genders!} />

            <Divider />

            {Array(200).fill(0).map((_, i) => (
              <Text key={i}>Element {i}</Text>
            ))}
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
  content: {
    position: 'relative',
  },
  fab_loading: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});

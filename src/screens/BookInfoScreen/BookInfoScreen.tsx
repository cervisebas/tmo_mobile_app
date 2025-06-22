import { ScrollViewWithHeaders } from "@codeherence/react-native-header";
import StackScreenProps from "~/common/interfaces/StackScreenProps";
import { Header } from "./components/Header";
import { LargeHeader } from "./components/LargeHeader";
import PrincipalView from "~/common/components/PrincipalView";
import { FAB, Text } from "react-native-paper";
import { BookInfoInterface } from "~/api/interfaces/BookInfoInterface";
import { useApiBookInfo } from "~/api/hooks/useApiBookInfo";
import { LoadingErrorContent } from "~/common/components/LoadingErrorContent";
import { StyleSheet } from "react-native";
import SafeArea from "~/common/components/SafeArea";

export function BookInfoScreen(props: StackScreenProps) {
  const info = props.route.params as BookInfoInterface;
  const {data, error, loading, refresh} = useApiBookInfo(info.url);

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
      >
        <LoadingErrorContent
          loading={loading}
          error={error}
        >
          {Array(200).fill(0).map((_, i) => (
            <Text key={i}>Element {i}</Text>
          ))}
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

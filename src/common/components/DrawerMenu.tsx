import { DrawerContentComponentProps } from "@react-navigation/drawer";
import useSafeArea from "../hooks/useSafeArea";
import { DrawerActions, CommonActions, NavigationRoute, ParamListBase } from "@react-navigation/native";
import { useCallback } from "react";
import { DrawerItem } from "./DrawerItem";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import TextLogo from "../../assets/TextLogo.webp";

export function DrawerMenu(props: DrawerContentComponentProps) {
  const {top, left, bottom, right} = useSafeArea();

  const navigateTo = useCallback((name: string, index: number) => {
    props.navigation.dispatch({
      ...(index === props.state.index
        ? DrawerActions.closeDrawer()
        : CommonActions.navigate(name)),
      target: props.state.key,
    });
  }, [props.navigation, props.state.index, props.state.key]);

  const renderItem = useCallback((item: NavigationRoute<ParamListBase, string>, index: number) => {
    const {title, drawerLabel, drawerIcon} = props.descriptors[item.key].options;
    const label =
      drawerLabel !== undefined
        ? (drawerLabel as string)
        : title !== undefined
        ? title
        : item.name;
    const active = index === props.state.index;

    return (
      <DrawerItem
        key={`drawer-item-${index}`}
        title={label}
        active={active}
        icon={drawerIcon as never}
        onPress={() => navigateTo(item.name, index)}
      />
    );
  }, [navigateTo, props.descriptors, props.state.index]);
  

  return (
    <View
      className={'flex-1 flex-col items-center'}
      style={{
        paddingTop: top,
        paddingLeft: left,
        paddingRight: right,
        paddingBottom: bottom,
      }}
    >
      <View className={'w-full aspect-[53/10] px-7 mt-4 justify-center'}>
        <Image
          source={TextLogo}
          className={'w-full'}
          resizeMode={'contain'}
          resizeMethod={'resize'}
        />
      </View>

      <ScrollView
        className={'flex-1 w-full mt-8'}
        contentContainerStyle={styles.scrollViewContent}
      >
        {props.state.routes.map(renderItem)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    gap: 8,
    paddingHorizontal: 0,
  },
});

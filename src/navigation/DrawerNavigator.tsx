import { createDrawerNavigator } from "@react-navigation/drawer";
import { Platform, StyleSheet } from "react-native";
import { DrawerMenu } from "~/common/components/DrawerMenu";
import { DrawerScreen } from "~/enums/DrawerScreen";
import { PopularPage } from "~/screens/PopularPage/PopularPage";

const Drawer = createDrawerNavigator();

export function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: styles.drawerStyle,
      }}
      drawerContent={drawerProps => (
        <DrawerMenu {...drawerProps} />
      )}
    >
      <Drawer.Screen
        name={DrawerScreen.HOME}
        options={{
          drawerLabel: 'Populares',
          drawerIcon: 'fire' as never,
        }}
        component={PopularPage}
      />
      
      <Drawer.Screen
        name={DrawerScreen.LIBRARY}
        options={{
          drawerLabel: 'Biblioteca',
          drawerIcon: 'bookmark-box-multiple-outline' as never,
        }}
        component={PopularPage}
      />
      
      <Drawer.Screen
        name={DrawerScreen.DOWNLOADS}
        options={{
          drawerLabel: 'Descargados',
          drawerIcon: 'download-box-outline' as never,
        }}
        component={PopularPage}
      />
      
      <Drawer.Screen
        name={DrawerScreen.MY_PROFILE}
        options={{
          drawerLabel: 'Mi perfil',
          drawerIcon: 'account-circle' as never,
        }}
        component={PopularPage}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerStyle: {
    overflow: 'hidden',
    ...Platform.select({
      android: {
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
      },
      ios: {},
    }),
  },
});

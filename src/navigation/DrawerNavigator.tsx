import { createDrawerNavigator } from "@react-navigation/drawer";
import { Platform, StyleSheet } from "react-native";
import { DrawerMenu } from "~/common/components/DrawerMenu";
import { DrawerScreen } from "~/enums/DrawerScreen";
import { ConfigurationScreen } from "~/screens/ConfigurationScreen/ConfigurationScreen";
import { LibraryScreen } from "~/screens/LibraryScreen/LibraryScreen";
import { MyProfileScreen } from "~/screens/MyProfileScreen/MyProfile";
import { PopularScreen } from "~/screens/PopularScreen/PopularScreen";

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
        component={PopularScreen}
      />
      
      <Drawer.Screen
        name={DrawerScreen.LIBRARY}
        options={{
          drawerLabel: 'Biblioteca',
          drawerIcon: 'bookmark-box-multiple-outline' as never,
        }}
        component={LibraryScreen}
      />
      
      <Drawer.Screen
        name={DrawerScreen.DOWNLOADS}
        options={{
          drawerLabel: 'Descargados',
          drawerIcon: 'download-box-outline' as never,
        }}
        component={PopularScreen}
      />
      
      <Drawer.Screen
        name={DrawerScreen.CONFIGURATIONS}
        options={{
          drawerLabel: 'Configuraciones',
          drawerIcon: 'cog' as never,
        }}
        component={ConfigurationScreen}
      />
      
      <Drawer.Screen
        name={DrawerScreen.MY_PROFILE}
        options={{
          drawerLabel: 'Mi perfil',
          drawerIcon: 'account-circle' as never,
        }}
        component={MyProfileScreen}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerStyle: {
    overflow: 'hidden',
    ...Platform.select({
      android: {
        width: '75%',
        maxWidth: 300,
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
      },
      ios: {},
    }),
  },
});

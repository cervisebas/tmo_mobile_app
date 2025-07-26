import { createDrawerNavigator } from "@react-navigation/drawer";
import { Platform, StyleSheet } from "react-native";
import { BookInfoInterface } from "~/api/interfaces/BookInfoInterface";
import { DrawerMenu } from "~/common/components/DrawerMenu";
import { refNavigation } from "~/common/utils/Ref";
import { DrawerScreen } from "~/enums/DrawerScreen";
import { StackScreens } from "~/enums/StackScreens";
import { NotificationAction } from "~/services/notifications/enums/NotificationAction";
import { useNotificationAction } from "~/services/notifications/hooks/useNotificationAction";
import { ConfigurationScreen } from "~/screens/ConfigurationScreen/ConfigurationScreen";
import { LibraryScreen } from "~/screens/LibraryScreen/LibraryScreen";
import { MyProfileScreen } from "~/screens/MyProfileScreen/MyProfile";
import { PopularScreen } from "~/screens/PopularScreen/PopularScreen";

const Drawer = createDrawerNavigator();

export function DrawerNavigator() {
  useNotificationAction<BookInfoInterface>(NotificationAction.OPEN_DETAILS, data => {
    refNavigation.current?.navigate(
      StackScreens.BOOK_INFO,
      data,
    );
  });

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

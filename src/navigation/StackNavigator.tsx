import { createStackNavigator } from "@react-navigation/stack";
import { StackScreens } from "~/enums/StackScreens";
import { DrawerNavigator } from "./DrawerNavigator";
import { BookInfoScreen } from "~/screens/BookInfoScreen/BookInfoScreen";
import { ChapterVisualizerScreen } from "~/screens/ChapterVisualizerScreen/ChapterVisualizerScreen";
import BootSplash from "react-native-bootsplash";
import { useEffect } from "react";
import { ChapterListScreen } from "~/screens/ChapterListScreen/ChapterListScreen";
import { Notifications } from "~/services/notifications";

const Stack = createStackNavigator();

export function StackNavigator() {
  useEffect(() => {
    setTimeout(() => {
      BootSplash.hide({
        fade: true,
      });

      Notifications.checkPermissions();
    }, 150);
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={StackScreens.STACK}
        component={DrawerNavigator}
      />

      <Stack.Screen
        name={StackScreens.BOOK_INFO}
        component={BookInfoScreen}
      />

      <Stack.Screen
        name={StackScreens.CHAPTER_VISUALIZER}
        component={ChapterVisualizerScreen}
      />

      <Stack.Screen
        name={StackScreens.CHAPTER_LIST}
        component={ChapterListScreen}
      />
    </Stack.Navigator>
  );
}

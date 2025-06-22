import { createStackNavigator } from "@react-navigation/stack";
import { StackScreens } from "~/enums/StackScreens";
import { DrawerNavigator } from "./DrawerNavigator";
import { BookInfoScreen } from "~/screens/BookInfoScreen/BookInfoScreen";

const Stack = createStackNavigator();

export function StackNavigator() {
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
    </Stack.Navigator>
  );
}

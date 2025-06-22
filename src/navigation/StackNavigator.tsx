import { createStackNavigator } from "@react-navigation/stack";
import { StackScreens } from "~/enums/StackScreens";
import { DrawerNavigator } from "./DrawerNavigator";

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
    </Stack.Navigator>
  );
}

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useContext } from "react";
import { ThemeContext } from "~/common/providers/ThemeProvider";
import { TopTabScreens } from "../enums/TopTabScreens";
import { TabBarLabel } from "../components/TabBarLabel";

const Tab = createMaterialTopTabNavigator();

export function TopTabNavigator() {
  const {theme} = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabel: TabBarLabel,
        tabBarStyle: {
          backgroundColor: theme.colors.elevation.level2,
        },
      }}>
      <Tab.Screen
        name={TopTabScreens.PILLS_POPULARS}
        // eslint-disable-next-line react/no-children-prop
        children={() => (<></>)}
      />
      <Tab.Screen
        name={TopTabScreens.PILLS_POPULARS_BOYS}
        // eslint-disable-next-line react/no-children-prop
        children={() => (<></>)}
      />
      <Tab.Screen
        name={TopTabScreens.PILLS_POPULARS_GIRLS}
        // eslint-disable-next-line react/no-children-prop
        children={() => (<></>)}
      />
    </Tab.Navigator>
  );
}

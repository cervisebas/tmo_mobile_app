import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useContext } from "react";
import { ThemeContext } from "~/common/providers/ThemeProvider";
import { TopTabScreens } from "../enums/TopTabScreens";
import { TabBarLabel } from "../components/TabBarLabel";
import { LoadingErrorContent } from "~/common/components/LoadingErrorContent";
import ListOfBooks from "../../../common/components/ListOfBooks";
import { useApiPopulars } from "~/api/hooks/useApiPopulars";

const Tab = createMaterialTopTabNavigator();

export function TopTabNavigator() {
  const {theme} = useContext(ThemeContext);
  const {loading, error, data} = useApiPopulars();

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
        children={() => (
          <LoadingErrorContent
            loading={loading}
            error={error}
          >
            <ListOfBooks
              data={data?.populars!}
              keyExtractor={'populars-item-{id}'}
            />
          </LoadingErrorContent>
        )}
      />
      
      <Tab.Screen
        name={TopTabScreens.PILLS_POPULARS_BOYS}
        // eslint-disable-next-line react/no-children-prop
        children={() => (
          <LoadingErrorContent
            loading={loading}
            error={error}
          >
            <ListOfBooks
              data={data?.populars_boys!}
              keyExtractor={'populars-boys-item-{id}'}
            />
          </LoadingErrorContent>
        )}
      />
      
      <Tab.Screen
        name={TopTabScreens.PILLS_POPULARS_GIRLS}
        // eslint-disable-next-line react/no-children-prop
        children={() => (
          <LoadingErrorContent
            loading={loading}
            error={error}
          >
            <ListOfBooks
              data={data?.populars_girls!}
              keyExtractor={'populars-girls-item-{id}'}
            />
          </LoadingErrorContent>
        )}
      />
    </Tab.Navigator>
  );
}

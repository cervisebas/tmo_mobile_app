import { ParamListBase, RouteProp } from '@react-navigation/native';

export interface DrawerScreenProps {
  route: RouteProp<ParamListBase, string>;
  navigation: {
    openDrawer(): void;
    closeDrawer(): void;
    toggleDrawer(): void;
    jumpTo(name: string, params: { [key: string]: any }): void;
  };
}

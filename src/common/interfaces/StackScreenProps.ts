import {
  NavigationHelpers,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {EventConsumer} from '@react-navigation/core/src/types';

interface StackScreenProps {
  navigation: NavigationHelpers<{}> &
    EventConsumer<{
      focus: {
        target: string;
        type: 'focus';
        data?: any;
        canPreventDefault?: boolean | undefined;
      };
      blur: {
        target: string;
        type: 'blur';
        data?: any;
        canPreventDefault?: boolean | undefined;
      };
      beforeRemove: {
        data?: any;
        preventDefault: () => void;
        canPreventDefault?: boolean | undefined;
      };
    }>;
  route: RouteProp<ParamListBase, string>;
}

export default StackScreenProps;

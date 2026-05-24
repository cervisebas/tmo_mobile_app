import { Image } from 'expo-image';
import {
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { TouchableRipple } from 'react-native-paper';

interface IProps {
  size: number;
  source: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  onPress?(): void;
}

export function AuthorImage(props: IProps) {
  return (
    <View className={'overflow-hidden'} style={[styles.content, props.style]}>
      <TouchableRipple onPress={props.onPress}>
        <Image
          source={props.source}
          style={[styles.image, { width: props.size, height: props.size }]}
        />
      </TouchableRipple>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    borderRadius: 16,
  },
  image: {
    aspectRatio: 1 / 1,
  },
});

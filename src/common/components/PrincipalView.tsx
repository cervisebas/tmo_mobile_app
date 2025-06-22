import React, {useContext, useMemo} from 'react';
import {
  Keyboard,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import { ThemeContext } from '../providers/ThemeProvider';

type IProps = {
  style?: StyleProp<ViewStyle>;
  onlyView?: boolean;
  hideKeyboard?: boolean;
  overflow?: boolean;
  onLayout?(event: LayoutChangeEvent): void;
  children?: React.ReactNode;
};
export default React.memo(function ({
  style,
  onlyView,
  hideKeyboard,
  overflow,
  onLayout,
  children,
}: IProps) {
  const {theme} = useContext(ThemeContext);

  const _view = useMemo(
    () =>
      onlyView ? (
        children
      ) : (
        <View style={[styles.full, style]}>
          {children}
        </View>
      ),
    [children, onlyView, style],
  );

  const _content = useMemo(
    () =>
      hideKeyboard ? (
        <TouchableWithoutFeedback
          style={[styles.full, style]}
          onPress={Keyboard.dismiss}
        >
          {_view}
        </TouchableWithoutFeedback>
      ) : (
        _view
      ),
    [_view, hideKeyboard, style],
  );

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.full,
        {
          overflow: overflow ? 'hidden' : undefined,
          backgroundColor: theme.colors.surface,
        },
      ]}>
      {_content}
    </View>
  );
});

const styles = StyleSheet.create({
  full: {
    flex: 1,
  },
});

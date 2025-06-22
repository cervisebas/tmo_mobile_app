import React, {useContext, useEffect, useMemo, useRef} from 'react';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import Modal from 'react-native-modal';
import useDimension from '../hooks/useDimension';
import { ThemeContext } from '../providers/ThemeProvider';

type ExtractProps<TComponentOrTProps> =
  TComponentOrTProps extends React.Component<infer TProps, any>
    ? TProps
    : TComponentOrTProps;

interface IProps {
  visible: boolean;
  onShow?: () => void;
  onClose?: () => void;
  onRequestClose?: () => void;
  animationIn?: ExtractProps<Modal>['animationIn'] | 'none';
  animationOut?: ExtractProps<Modal>['animationOut'] | 'none';
  animationInTiming?: number;
  animationOutTiming?: number;
  backdropColor?: string;
  backdropTransitionOutTiming?: number;
  backdropTransitionInTiming?: number;
  transparent?: boolean;
  useBackdrop?: boolean;
  style?: StyleProp<ViewStyle>;
  disableDrawer?: boolean;
  useNativeDriver?: boolean;
  useNativeDriverForBackdrop?: boolean;
  children: React.ReactNode;
}

const _animationRemove = {from: {opacity: 1}, to: {opacity: 1}};

export default React.memo(function CustomModal(props: IProps) {
  // Context's
  const {theme} = useContext(ThemeContext);
  const [width, height] = useDimension('screen');
  const init = useRef(false);

  useEffect(() => {
    if (props.visible && !init.current) {
      init.current = true;
    }
  }, [props.visible]);

  const removeAnimationIn = useMemo(
    () => props.animationIn === 'none',
    [props.animationIn],
  );
  const removeAnimationOut = useMemo(
    () => props.animationOut === 'none',
    [props.animationOut],
  );
  return (
    <Modal
      isVisible={props.visible}
      // Animation In
      animationIn={
        (removeAnimationIn
          ? _animationRemove
          : props.animationIn ?? 'slideInRight') as any
      }
      animationInTiming={removeAnimationIn ? 0 : props.animationInTiming ?? 250}
      // Animation Out
      animationOut={
        (removeAnimationOut
          ? _animationRemove
          : props.animationOut ?? 'slideOutLeft') as any
      }
      animationOutTiming={
        removeAnimationOut ? 0 : props.animationOutTiming ?? 250
      }
      // Others parameters
      backdropTransitionOutTiming={props.backdropTransitionOutTiming}
      backdropTransitionInTiming={props.backdropTransitionInTiming}
      backdropColor={props.backdropColor ?? theme.colors.backdrop}
      backdropOpacity={props.transparent ? 0 : undefined}
      onBackButtonPress={props.onRequestClose}
      onBackdropPress={props.onRequestClose}
      onModalWillShow={props.onShow}
      onModalHide={props.onClose}
      deviceWidth={width}
      deviceHeight={height}
      hasBackdrop={props.useBackdrop}
      coverScreen={false}
      supportedOrientations={['portrait', 'landscape']}
      useNativeDriver={props.useNativeDriver ?? true}
      useNativeDriverForBackdrop={props.useNativeDriverForBackdrop ?? true}
      hideModalContentWhileAnimating={true}
      style={[props.style, styles.modal]}>
      {props.children}
    </Modal>
  );
});

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
});

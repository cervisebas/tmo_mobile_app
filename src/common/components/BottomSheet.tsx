import React, {
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Text} from 'react-native-paper';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetProps, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomSheetVariables } from '@gorhom/bottom-sheet/lib/typescript/types';
import useSafeArea from '../hooks/useSafeArea';
import useDimension from '../hooks/useDimension';
import usePreventBackHandler from '../hooks/usePreventBackHandler';
import usePreventBackNavigation from '../hooks/usePreventBackNavigation';
import StackScreenProps from '../interfaces/StackScreenProps';
import { ThemeContext } from '../providers/ThemeProvider';

interface IProps {
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  alwaysOnTop?: boolean;
  followKeyboard?: boolean;
  height?: (number | `${number}%`) | (number | `${number}%`)[];
  useScrollView?: boolean;
  navigation?: StackScreenProps;
  footerComponent?: BottomSheetProps['footerComponent'];
  onClose?(): void;
}
export interface BottomSheetRef {
  visible: boolean;
  show(): void;
  hide(): void;
}

const TITLE_VARIANT = 'titleLarge';
const MAX_WIDTH = 600;

export default React.memo(
  forwardRef(function (props: IProps, ref: React.Ref<BottomSheetRef>) {
    const [visible, setVisible] = useState(false);
    const {theme} = useContext(ThemeContext);
    const {left, right, bottom, top} = useSafeArea();
    const [WINDOW_WIDTH, WINDOW_HEIGHT] = useDimension('window');
    const refBottomSheetModal = useRef<BottomSheetModal>(null);

    const EXTRA_MARGIN = useMemo(
      () => {
        const value = WINDOW_WIDTH - MAX_WIDTH;
        return value > 0 ? value : 0;
      },
      [WINDOW_WIDTH],
    );

    const contentStyle: ViewStyle = {
      paddingBottom: bottom,
    };

    const onDismiss = useCallback(() => {
      props.onClose?.();
      setVisible(false);
    }, [props]);

    const renderBackdrop = useCallback(
      (backdropProps: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...backdropProps}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={1}
          style={[
            backdropProps.style,
            {
              backgroundColor: theme.colors.backdrop,
            },
          ]}
        />
      ),
      [theme.colors.backdrop],
    );

    const renderHandle = useCallback(
      (_handleProps: BottomSheetVariables) => (
        <React.Fragment>
          <View
            style={[
              styles.line,
              {
                backgroundColor: theme.colors.onBackground,
              },
            ]}
          />
          {props.title && (
            <View style={styles.titleContent}>
              <Text variant={TITLE_VARIANT} style={styles.title}>
                {props.title}
              </Text>
            </View>
          )}
        </React.Fragment>
      ),
      [props.title, theme.colors.onBackground],
    );

    usePreventBackHandler(() => {
      refBottomSheetModal.current?.dismiss();
    }, visible);

    usePreventBackNavigation(
      props.navigation,
      visible,
      () => refBottomSheetModal.current?.dismiss(),
    );

    useImperativeHandle(ref, () => ({
      visible: visible,
      show: () => {
        refBottomSheetModal.current?.present();
        setVisible(true);
      },
      hide: () => {
        refBottomSheetModal.current?.dismiss();
        setVisible(false);
      },
    }));

    return (
      <BottomSheetModal
        ref={refBottomSheetModal}
        enablePanDownToClose={true}
        enableDynamicSizing={!props.height}
        maxDynamicContentSize={
          !props.height
            ? (WINDOW_HEIGHT - top)
            : undefined
        }
        snapPoints={
          props.height
            ? Array.isArray(props.height)
              ? props.height
              : [props.height]
            : undefined
        }
        style={[
          {
            width: WINDOW_WIDTH - (left + right),
            maxWidth: MAX_WIDTH,
            marginLeft: left + (EXTRA_MARGIN / 2),
            marginRight: right + (EXTRA_MARGIN / 2),
          },
        ]}
        backgroundStyle={[
          styles.background,
          {
            backgroundColor: theme.colors.elevation.level4,
          },
        ]}
        backdropComponent={renderBackdrop}
        handleComponent={renderHandle}
        footerComponent={props.footerComponent}
        onDismiss={onDismiss}
      >
        {!props.useScrollView
          ? (
            <BottomSheetView
              style={[contentStyle, props.contentContainerStyle]}
              // eslint-disable-next-line react/no-children-prop
              children={props.children}
            />
          )
          : (
            <BottomSheetScrollView
              contentContainerStyle={[contentStyle, props.contentContainerStyle]}
              // eslint-disable-next-line react/no-children-prop
              children={props.children}
            />
          )
        }
      </BottomSheetModal>
    );
  }),
);

const styles = StyleSheet.create({
  titleContent: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
    paddingHorizontal: '5%',
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
  },
  line: {
    width: 32,
    height: 4,
    alignSelf: 'center',
    marginVertical: 16,
    borderRadius: 2,
  },
  background: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
});

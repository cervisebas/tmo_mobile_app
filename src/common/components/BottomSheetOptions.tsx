import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import BottomSheet, { BottomSheetRef } from './BottomSheet';
import { Divider } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import ItemWithIcon from './ItemWithIcon';

export interface BottomSheetOptionsInterface {
  label: string;
  description?: string;
  leftIcon?: string;
  leftIconColor?: string;
  rightIcon?: string;
  rightIconColor?: string;
  disabled?: boolean;
  selected?: boolean;
  onPress: () => void;
}

export interface BottomSheetOptionsRef {
  open: (title: string, options: BottomSheetOptionsInterface[]) => void;
  close: () => void;
}

export default forwardRef(function (_: object, ref: React.Ref<BottomSheetOptionsRef>) {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<BottomSheetOptionsInterface[]>([]);
  const refBottomSheet = useRef<BottomSheetRef>(null);

  useImperativeHandle(ref, () => ({
    open: (title, options) => {
      setTitle(title);
      setOptions(options);
      refBottomSheet.current?.show();
    },
    close: () => {
      refBottomSheet.current?.hide();
    },
  }));

  return (
    <BottomSheet
      ref={refBottomSheet}
      title={title}
      alwaysOnTop={true}
      useScrollView={true}
    >
      <React.Fragment>
        {options.map((v, i) => (
          <React.Fragment key={`bottom-sheet-option-${i}`}>
            <ItemWithIcon
              title={v.label}
              disabled={v.selected || v.disabled}
              leftIcon={v.leftIcon}
              leftIconColor={v.leftIconColor}
              rightIcon={v.selected ? 'check' : v.rightIcon}
              rightIconColor={v.rightIconColor}
              description={v.description}
              onPress={() => {
                refBottomSheet.current?.hide();
                v.onPress();
              }}
            />

            {options[i + 1] && (
              <Divider style={styles.divider} />
            )}
          </React.Fragment>
        ))}
      </React.Fragment>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  divider: {
    marginHorizontal: 8,
  },
});

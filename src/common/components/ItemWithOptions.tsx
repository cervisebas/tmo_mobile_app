import React, { useRef } from 'react';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {List, Text} from 'react-native-paper';
import {Dropdown, DropdownRef} from 'react-native-paper-dropdown';
import useSafeArea from '../hooks/useSafeArea';

interface IProps {
  title: string;
  description?: string | React.ReactNode;
  icon?: string;
  iconColor?: string;
  fixHeight?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  descriptionNumberOfLines?: number;

  options: {
    label: string;
    value: string;
  }[];
  value: string;
  onChange(val: string): void;

  onPress?(): void;
}
export default React.memo(function (props: IProps) {
  const refDropdown = useRef<DropdownRef>(null);
  const {top} = useSafeArea();

  return (
    <Dropdown
      ref={refDropdown}
      options={props.options}
      value={props.value}
      onSelect={props.onChange as any}
      hideMenuHeader={true}
      mode={'outlined'}
      statusBarHeight={top}
      menuContentStyle={{
        width: '60%',
        left: '40%',
      }}
      CustomDropdownInput={dProps => (
        <List.Item
          title={props.title}
          description={props.description}
          descriptionStyle={props.descriptionStyle}
          descriptionNumberOfLines={props.descriptionNumberOfLines}
          left={
            props.icon
              ?
                p => (
                  <List.Icon
                    {...p}
                    icon={props.icon!}
                    color={props.iconColor ?? p.color}
                  />
                )
              : undefined
          }
          right={
            p => (
              <View className={'flex flex-row items-center gap-[4]'}>
                {dProps.selectedLabel && (
                  <Text variant={'bodySmall'}>
                    {dProps.selectedLabel}
                  </Text>
                )}
                <List.Icon
                  {...p}
                  icon={'menu-down'}
                />
              </View>
            )
          }
          disabled={props.disabled}
          style={[props.style, props.fixHeight ? {height: props.fixHeight} : {}]}
          onPress={() => {
            props.onPress?.();
            refDropdown.current?.focus();
          }}
        />
      )}
    />
  );
});

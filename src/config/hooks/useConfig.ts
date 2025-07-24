import { useEffect, useState } from "react";

interface IProps<T> {
  initValue: T;
  set(value: T): Promise<void>;
  get(): Promise<T>;
  isDisabled?(): Promise<boolean>;
}

export function useConfig<T>(props: IProps<T>) {
  const [value, setValue] = useState<T>(props.initValue);
  const [disabled, setDisabled] = useState<boolean | undefined>(undefined);

  async function loadValue() {
    setValue(await props.get());

    if (props.isDisabled) {
      setDisabled(await props.isDisabled());
    }
  }

  async function change(val: T) {
    await props.set(val);
    await loadValue();
  }

  useEffect(() => {
    loadValue();
  }, []);

  return {
    value: value,
    change: change,
    disabled: disabled,
  };
}

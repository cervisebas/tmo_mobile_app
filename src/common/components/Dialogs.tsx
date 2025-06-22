import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Button,
  Dialog,
  Paragraph,
  Portal,
  Text,
} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {DialogInterface} from '../interfaces/DialogInterface';

export const Dialogs = forwardRef(function (
  _: DialogInterface.IProps,
  ref: React.Ref<DialogInterface.IRef>,
) {
  const refLoading = useRef<DialogInterface.LoadingRef>(null);
  const refAlert = useRef<DialogInterface.AlertRef>(null);

  useImperativeHandle(ref, () => ({
    showLoading(message: string | false) {
      if (!message) {
        return refLoading.current?.close();
      }
      refLoading.current?.open(message);
    },
    showAlert(props: Parameters<DialogInterface.AlertRef['open']>[0]) {
      refAlert.current?.open(props);
    },
  }));
  return (
    <Portal>
      <Loading.Component ref={refLoading} />
      <Alert.Component ref={refAlert} />
    </Portal>
  );
});

namespace Loading {
  export const Component = forwardRef(function LoadingComponent(
    _: {},
    ref: React.Ref<DialogInterface.LoadingRef>,
  ) {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('Cargando...');
    const open = useCallback((mess: string) => {
      setVisible(true);
      setMessage(mess);
    }, []);
    const close = useCallback(() => setVisible(false), []);
    useImperativeHandle(ref, () => ({open, close}));
    return (
      <Dialog
        visible={visible}
        dismissable={false}
        dismissableBackButton={false}
        style={styles.dialog}>
        <Dialog.Content style={styles.content}>
          <ActivityIndicator size={'large'} />
          <Text style={styles.message}>{message}</Text>
        </Dialog.Content>
      </Dialog>
    );
  });

  const styles = StyleSheet.create({
    dialog: {
      alignSelf: 'center',
      paddingHorizontal: 14,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    message: {
      marginLeft: 24,
      fontSize: 17,
    },
  });
}

namespace Alert {
  const DefaultButton = [
    {
      text: 'Aceptar',
      onPress: () => {},
    },
  ];
  export const Component = forwardRef(function LoadingComponent(
    _: {},
    ref: React.Ref<DialogInterface.AlertRef>,
  ) {
    const [visible, setVisible] = useState(false);

    const [title, setTitle] = useState<string | undefined>('Titulo de prueba');
    const [message, setMessage] = useState<
      string | undefined | React.ReactNode
    >(
      'Laborum magna labore quis excepteur non duis sunt consequat qui sit ipsum enim esse mollit.',
    );
    const [buttons, setButtons] = useState<DialogInterface.AlertButtons[] | undefined>(
      DefaultButton,
    );
    const [dismissable, setDismissable] = useState(true);
    const onClose =
      useRef<Parameters<DialogInterface.AlertRef['open']>[0]['onClose']>(undefined);

    const open = useCallback(
      (props: Parameters<DialogInterface.AlertRef['open']>[0]) => {
        if (props.message === 0 || props.message === '0') {
          return;
        }

        setVisible(true);
        setTitle(props.title);
        setMessage(props.message);
        setButtons([
          ...(props.showOk
            ? [
                {
                  text: props.textOk ?? 'Aceptar',
                  onPress: () => {},
                },
              ]
            : []),
          ...(props.buttons ?? []),
        ]);
        setDismissable(props.dismissable ?? true);
        onClose.current = props.onClose;
      },
      [],
    );
    const close = useCallback(() => {
      setVisible(false);
      onClose.current?.();
    }, []);
    useImperativeHandle(ref, () => ({open, close}));

    const clickButton = useCallback(
      (fun?: () => void) => {
        close();
        fun?.();
      },
      [close],
    );

    return (
      <Dialog visible={visible} onDismiss={close} dismissable={dismissable}>
        {title && <Dialog.Title>{title}</Dialog.Title>}

        {message && (
          <Dialog.Content>
            {typeof message === 'string' ? (
              <Paragraph>
                {message}
              </Paragraph>
            ) : (
              message
            )}
          </Dialog.Content>
        )}

        {buttons && (
          <Dialog.Actions>
            {buttons.map(({text, onPress}, index) => (
              <Button
                key={`dialog-alert-component-button-${index}`}
                onPress={() => clickButton(onPress)}
              >
                {text}
              </Button>
            ))}
          </Dialog.Actions>
        )}
      </Dialog>
    );
  });
}

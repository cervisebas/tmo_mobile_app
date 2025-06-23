import React from 'react';

export namespace DialogInterface {
  export interface IProps {}

  export interface IRef {
    showLoading(message: string | false): void;
    showAlert: AlertRef['open'];
    showImage: ImageViewingRef['open'];
  }

  export interface LoadingRef {
    open(message: string): void;
    close(): void;
  }

  export interface AlertButtons {
    text: string;
    onPress?(): void;
  }

  export interface AlertRef {
    open(props: {
      title?: string;
      message?: string | React.ReactNode;
      buttons?: AlertButtons[];
      dismissable?: boolean;
      showOk?: boolean;
      textOk?: string;
      onClose?: () => void;
    }): void;
    close(): void;
  }

  export interface ImageViewingRef {
    open(images: string[]): void;
  }

}

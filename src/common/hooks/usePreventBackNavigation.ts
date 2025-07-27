import {useEffect} from 'react';
import StackScreenProps from '../interfaces/StackScreenProps';

export default function (
  props: StackScreenProps | undefined,
  prevent: boolean,
  callback?: (remove?: () => void) => void,
) {
  useEffect(() => {
    const saveEvent = props?.navigation.addListener(
      'beforeRemove',
      (event: any) => {
        if (prevent) {
          (event as any).preventDefault();
          callback?.(saveEvent);
        }
      },
    );

    return () => saveEvent?.();
  });
}

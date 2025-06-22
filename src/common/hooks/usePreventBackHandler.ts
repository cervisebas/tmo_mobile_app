import {useEffect, useRef} from 'react';
import {BackHandler} from 'react-native';

export default function (callback: () => void, dep = false) {
  const back = useRef(dep);

  useEffect(() => {
    const event = BackHandler.addEventListener('hardwareBackPress', () => {
      if (back.current) {
        callback();
        return true;
      }
      return false;
    });

    return event.remove;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    back.current = dep;
  }, [dep]);
}

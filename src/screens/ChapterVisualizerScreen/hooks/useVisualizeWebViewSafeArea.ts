import { useCallback, useEffect } from "react";
import useSafeArea from "~/common/hooks/useSafeArea";

interface VisualizeWebViewSafeArea {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export function useVisualizeWebViewSafeArea(update: (val: VisualizeWebViewSafeArea) => void) {
  const {left, right, top, bottom} = useSafeArea(8, 8);

  const sendUpdate = useCallback(() => {
    update({left, right, top, bottom});
  }, [bottom, left, right, top, update]);

  useEffect(() => {
    sendUpdate();
  }, []);
  
  useEffect(() => {
    sendUpdate();
  }, [bottom, left, right, top]);

  return {calculeSafeArea: sendUpdate};
}

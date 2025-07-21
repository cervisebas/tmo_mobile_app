import { useEffect, useRef } from "react";
import {readAsStringAsync} from "expo-file-system";
import { Asset } from "expo-asset";
import { usePreserveHtmlVisualizer } from "./usePreserveHtmlVisualizer";

export function useHtmlVisualizer() {
  const {html, setHtml} = usePreserveHtmlVisualizer();
  const isMounted = useRef(false);

  const loadHtml = async () => {
    if (html) {
      return;
    }
    
    const path = require('~/assets/VisualizerPage.html');
    const asset = Asset.fromModule(path);
    await asset.downloadAsync();
    const htmlContent = await readAsStringAsync(asset.localUri!);

    if (isMounted.current) {
      setHtml(htmlContent);
    }
  }

  useEffect(() => {
    isMounted.current = true;
    loadHtml();

    return () => {
      isMounted.current = false;
    };
  }, []);

  return {
    html: html ?? '',
    loading: !html,
  };
}

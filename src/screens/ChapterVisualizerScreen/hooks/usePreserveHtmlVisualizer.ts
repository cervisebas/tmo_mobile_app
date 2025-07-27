import {create} from 'zustand';

interface PreserveHtmlVisualizer {
  html: string | null;
  setHtml(val: string): void;
}

export const usePreserveHtmlVisualizer = create<PreserveHtmlVisualizer>((set) => ({
  html: null,
  setHtml: val => set({ html: val }),
}));

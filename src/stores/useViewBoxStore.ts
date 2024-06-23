import { create } from "zustand";

interface ViewBoxState {
  x: number;
  y: number;
  width: number;
  height: number;
  setX: (x: number) => void;
  setY: (y: number) => void;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  setCorner: (x: number, y: number) => void;
  setDimensions: (width: number, height: number) => void;
  setViewBox: (newViewBox: string | DOMRect) => void;
  viewBox: string;
  viewBoxRect: DOMRect;
}

export const useViewBoxStore = create<ViewBoxState>()((set, get) => ({
  x: 0,
  y: 0,
  width: 100,
  height: 100,

  setViewBox: (newViewBox) => {
    if (typeof newViewBox === "string") {
      const [x, y, width, height] = newViewBox.split(" ").map(Number);
      const viewBox = `${x} ${y} ${width} ${height}`;
      const viewBoxRect = new DOMRect(x, y, width, height);
      set({ x, y, width, height, viewBox, viewBoxRect });
    } else {
      const viewBox = `${newViewBox.x} ${newViewBox.y} ${newViewBox.width} ${newViewBox.height}`;
      set({
        x: newViewBox.x,
        y: newViewBox.y,
        width: newViewBox.width,
        height: newViewBox.height,
        viewBox,
        viewBoxRect: newViewBox,
      });
    }
  },

  setX: (x) => {
    const viewBox = `${x} ${get().y} ${get().width} ${get().height}`;
    const viewBoxRect = new DOMRect(x, get().y, get().width, get().height);
    set({ x, viewBox, viewBoxRect });
  },

  setY: (y) => {
    const viewBox = `${get().x} ${y} ${get().width} ${get().height}`;
    const viewBoxRect = new DOMRect(get().x, y, get().width, get().height);
    set({ y, viewBox, viewBoxRect });
  },

  setWidth: (width) => {
    const viewBox = `${get().x} ${get().y} ${width} ${get().height}`;
    const viewBoxRect = new DOMRect(get().x, get().y, width, get().height);
    set({ width, viewBox, viewBoxRect });
  },

  setHeight: (height) => {
    const viewBox = `${get().x} ${get().y} ${get().width} ${height}`;
    const viewBoxRect = new DOMRect(get().x, get().y, get().width, height);
    set({ height, viewBox, viewBoxRect });
  },

  setCorner: (x, y) => {
    const viewBox = `${x} ${y} ${get().width} ${get().height}`;
    const viewBoxRect = new DOMRect(x, y, get().width, get().height);
    set({ x, y, viewBox, viewBoxRect });
  },

  setDimensions: (width, height) => {
    const viewBox = `${get().x} ${get().y} ${width} ${height}`;
    const viewBoxRect = new DOMRect(get().x, get().y, width, height);
    set({ width, height, viewBox, viewBoxRect });
  },

  viewBox: "0 0 100 100",
  viewBoxRect: new DOMRect(0, 0, 100, 100),
}));

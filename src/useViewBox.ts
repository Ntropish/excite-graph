import { useCallback, useMemo, useState } from "react";

type ViewBoxState = {
  x: number;
  y: number;
  width: number;
  height: number;
};

// This function parses the viewBox string or DOMRect into a state object
function parseViewBox(viewBox: string | DOMRect): ViewBoxState {
  if (typeof viewBox === "string") {
    const [x, y, width, height] = viewBox.split(" ").map(Number);
    return { x, y, width, height };
  } else {
    return {
      x: viewBox.x,
      y: viewBox.y,
      width: viewBox.width,
      height: viewBox.height,
    };
  }
}

// Custom hook to manage the viewBox state
function useViewBox(initialViewBox: string | DOMRect) {
  const [viewBox, setViewBoxState] = useState<ViewBoxState>(() =>
    parseViewBox(initialViewBox)
  );

  const setX = useCallback(
    (x: number) => setViewBoxState((prev) => ({ ...prev, x })),
    []
  );
  const setY = useCallback(
    (y: number) => setViewBoxState((prev) => ({ ...prev, y })),
    []
  );
  const setWidth = useCallback(
    (width: number) => setViewBoxState((prev) => ({ ...prev, width })),
    []
  );
  const setHeight = useCallback(
    (height: number) => setViewBoxState((prev) => ({ ...prev, height })),
    []
  );
  const setCorner = useCallback(
    (x: number, y: number) => setViewBoxState((prev) => ({ ...prev, x, y })),
    []
  );
  const setDimensions = useCallback(
    (width: number, height: number) =>
      setViewBoxState((prev) => ({ ...prev, width, height })),
    []
  );

  const setViewBox = useCallback((newViewBox: string | DOMRect) => {
    setViewBoxState(parseViewBox(newViewBox));
  }, []);

  // Returns the viewBox as a string for easy use in an SVG component
  const viewBoxString = `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`;

  const viewBoxRect = useMemo(() => {
    const rect = new DOMRect(
      viewBox.x,
      viewBox.y,
      viewBox.width,
      viewBox.height
    );
    return rect;
  }, [viewBox]);

  return {
    viewBox: viewBoxString,
    viewBoxRect,
    setX,
    setY,
    setCorner,
    setWidth,
    setHeight,
    setDimensions,
    setViewBox,
  };
}

export default useViewBox;

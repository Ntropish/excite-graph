import React, {
  useState,
  useRef,
  WheelEvent,
  MouseEvent,
  useEffect,
  useMemo,
} from "react";
import useViewBox from "./useViewBox"; // Import the hook we created earlier

import { useGraphStore } from "./useGraphStore";

import useResizeObserver from "use-resize-observer";

import GridLines from "./GridLines";

type InteractiveSVGProps = {
  children: React.ReactNode;
};

const Graph: React.FC<InteractiveSVGProps> = ({ children }) => {
  const { viewBox, setViewBox, viewBoxRect, setHeight } =
    useViewBox(`0 0 100 100`);

  const { ref: resizeRef, width, height } = useResizeObserver<SVGSVGElement>();

  const aspectRatio = useMemo(() => {
    return (width || 1) / (height || 1);
  }, [width, height]);

  useEffect(() => {
    const viewBoxAspectRatio = viewBoxRect.width / viewBoxRect.height;

    if (aspectRatio !== viewBoxAspectRatio && width) {
      const newHeight = viewBoxRect.width / aspectRatio;

      setHeight(newHeight);
    }
  }, [aspectRatio, viewBoxRect, width, setHeight]);

  const [isPanning, setIsPanning] = useState(false);
  const startPointRef = useRef<DOMPoint | null>(null);
  const viewRectRef = useRef<DOMRect | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const onWheel = (event: WheelEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const { deltaX, deltaY, clientX, clientY } = event;
    const scale = Math.pow(1.0015, -deltaY);

    const rect = svgRef.current.getBoundingClientRect();
    const svgPointBefore = convertToPoint(
      clientX - rect.left,
      clientY - rect.top
    );

    setViewBox((prev) => {
      const newX = svgPointBefore.x - (svgPointBefore.x - prev.x) * scale;
      const newY = svgPointBefore.y - (svgPointBefore.y - prev.y) * scale;
      const newWidth = prev.width * scale;
      const newHeight = prev.height * scale;
      return `${newX} ${newY} ${newWidth} ${newHeight}`;
    });
  };

  const onMouseDown = (event: MouseEvent<SVGSVGElement>) => {
    startPointRef.current = convertToPoint(event.clientX, event.clientY);
    viewRectRef.current = viewBoxRect;
    setIsPanning(true);
  };

  const onMouseMove = (event: MouseEvent<SVGSVGElement>) => {
    if (isPanning && viewRectRef.current && svgRef.current) {
      const scaleX = viewRectRef.current.width / (width || 1);
      const scaleY = viewRectRef.current.height / (height || 1);

      const dx = event.movementX;
      const dy = event.movementY;

      viewRectRef.current.x -= dx * scaleX;
      viewRectRef.current.y -= dy * scaleY;

      setViewBox(viewRectRef.current);
    }
  };

  const onMouseUp = () => {
    setIsPanning(false);
    viewRectRef.current = null;
    startPointRef.current = null;
  };

  const convertToPoint = (x: number, y: number) => {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  };

  return (
    <svg
      ref={(node) => {
        svgRef.current = node!;
        resizeRef(node!);
      }}
      width={width}
      height={height}
      viewBox={viewBox}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseUp}
      onMouseUp={onMouseUp}
      style={{
        cursor: isPanning ? "grabbing" : "grab",
        width: "100%",
        height: "100%",
      }}
      preserveAspectRatio="none"
    >
      <GridLines
        width={width || 1}
        height={height || 1}
        viewBoxRect={viewBoxRect}
      />

      {children}
    </svg>
  );
};

export default Graph;

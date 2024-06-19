import React, {
  useState,
  useRef,
  WheelEvent,
  MouseEvent,
  useCallback,
} from "react";
import useViewBox from "../../useViewBox"; // Import the hook we created earlier
import { Menu, MenuItem } from "@mui/material";

import { useParams } from "react-router-dom";
import {
  Graph,
  GraphNode,
  useGraphListStore,
} from "../../stores/useGraphListStore";

import useResizeObserver from "use-resize-observer";

import GridLines from "./GridLines";

import scaleRect from "../../util/scaleRect";

type InteractiveSVGProps = {
  children: React.ReactNode;
};

const GraphEditor: React.FC<InteractiveSVGProps> = ({ children }) => {
  const { graphId } = useParams<{ graphId: string }>();

  const graphList = useGraphListStore((state) => state.graphs);

  const activeGraph = graphList.find((graph) => graph.id === graphId);

  const { viewBox, setViewBox, viewBoxRect, setHeight } =
    useViewBox(`0 0 100 100`);

  const [screenRect, setScreenRect] = useState<DOMRect | null>(null);

  const { ref: resizeRef } = useResizeObserver<SVGSVGElement>({
    onResize: ({ width, height }) => {
      if (!width || !height) return;

      const screenRect = new DOMRect(0, 0, width, height);

      setScreenRect(screenRect);

      const aspectRatio = (width || 1) / (height || 1);

      const newHeight = viewBoxRect.width / aspectRatio;

      if (viewBoxRect.height !== newHeight) {
        setHeight(newHeight);
      }
    },
  });

  const [isPanning, setIsPanning] = useState(false);
  const startPointRef = useRef<DOMPoint | null>(null);
  const viewRectRef = useRef<DOMRect | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const onWheel = (event: WheelEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const { deltaX, deltaY, clientX, clientY } = event;
    const scale = Math.pow(1.0015, deltaY);

    const rect = viewBoxRect;

    const newViewBox = scaleRect(rect, scale, convertToPoint(clientX, clientY));

    setViewBox(newViewBox);
  };

  const onMouseDown = (event: MouseEvent<SVGSVGElement>) => {
    startPointRef.current = convertToPoint(event.clientX, event.clientY);
    viewRectRef.current = viewBoxRect;
    setIsPanning(true);
  };

  const onMouseMove = (event: MouseEvent<SVGSVGElement>) => {
    if (isPanning && viewRectRef.current && svgRef.current) {
      const scaleX = viewRectRef.current.width / (screenRect?.width || 1);
      const scaleY = viewRectRef.current.height / (screenRect?.height || 1);

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

  const [contextMenu, setContextMenu] = useState<{
    mouseX: null | number;
    mouseY: null | number;
  }>({ mouseX: null, mouseY: null });

  const handleContextMenu = useCallback((event: MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2, // Subtracting 2 pixels to align the menu properly
      mouseY: event.clientY - 4, // Subtracting 4 pixels to align the menu properly
    });
  }, []);

  const handleClose = () => {
    setContextMenu({ mouseX: null, mouseY: null });
  };

  const addNode = () => {
    console.log("Add Node");

    if (!activeGraph) return;
    if (!graphId) return;

    const point = convertToPoint(contextMenu.mouseX!, contextMenu.mouseY!);

    console.log(point.x, point.y);

    const newNode: GraphNode = {
      x: point.x,
      y: point.y,
    };

    const newNodes: GraphNode[] = [...(activeGraph?.nodes || []), newNode];

    const newGraph: Graph = {
      ...activeGraph!,
      nodes: newNodes,
    };

    useGraphListStore.getState().updateGraph(graphId, newGraph);
    handleClose();
  };

  const focusContent = () => {
    console.log("Focus Content");
    handleClose();
  };

  const points = activeGraph?.nodes.map((node) => (
    <circle key={node.x + node.y} cx={node.x} cy={node.y} r={10} fill="red" />
  ));

  console.log(points);

  return (
    <>
      {" "}
      <svg
        ref={(node) => {
          svgRef.current = node!;
          resizeRef(node!);
        }}
        width={screenRect?.width || 1}
        height={screenRect?.height || 1}
        viewBox={viewBox}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseUp}
        onMouseUp={onMouseUp}
        onContextMenu={handleContextMenu}
        style={{
          cursor: isPanning ? "grabbing" : "grab",
          width: "100%",
          height: "100%",
        }}
        preserveAspectRatio="none"
      >
        <GridLines
          width={screenRect?.width || 1}
          height={screenRect?.height || 1}
          viewBoxRect={viewBoxRect}
        />

        {points}
        {children}
      </svg>
      <Menu
        open={contextMenu.mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu.mouseY !== null && contextMenu.mouseX !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={addNode}>Add Node</MenuItem>
        <MenuItem onClick={focusContent}>Focus Content</MenuItem>
      </Menu>
    </>
  );
};

export default GraphEditor;

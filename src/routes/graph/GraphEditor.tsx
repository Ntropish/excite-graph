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
  GraphEdges,
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

  const [connectingIndex, setConnectingIndex] = useState(-1);

  const convertToPoint = (x: number, y: number) => {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  };

  const onWheel = (event: WheelEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const { deltaX, deltaY, clientX, clientY } = event;
    const scale = Math.pow(1.0015, deltaY);

    const rect = viewBoxRect;

    const newViewBox = scaleRect(rect, scale, convertToPoint(clientX, clientY));

    setViewBox(newViewBox);
  };

  const onMouseDown = (event: MouseEvent<SVGSVGElement>) => {
    if (!graphId) return;
    // Cancel active states if the right mouse button is clicked
    if (event.button !== 0) {
      if (connectingIndex !== -1) {
        setConnectingIndex(-1);
      }
      return;
    }

    if (connectingIndex !== -1) {
      const target = event.target as Element;
      const targetNode = target.closest("[data-entity='point']");

      if (targetNode) {
        const connectIndex = parseInt(
          targetNode.getAttribute("data-id") || "-1"
        );

        const startIndex = Math.min(connectingIndex, connectIndex);
        const endIndex = Math.max(connectingIndex, connectIndex);
        const isFlipped = connectingIndex > connectIndex;

        const newEdges: GraphEdges = {
          ...activeGraph!.edges,
          [startIndex]: {
            ...activeGraph!.edges[startIndex],
            [endIndex]: {
              isFlipped,
            },
          },
        };

        const newGraph: Graph = {
          ...activeGraph!,
          edges: newEdges,
        };

        useGraphListStore.getState().updateGraph(graphId, newGraph);
      }
      setConnectingIndex(-1);
    }

    // Start panning
    startPointRef.current = convertToPoint(event.clientX, event.clientY);
    viewRectRef.current = viewBoxRect;
    setIsPanning(true);
  };

  const [mousePosition, setMousePosition] = useState<DOMPoint | null>(null);
  const onMouseMove = (event: MouseEvent<SVGSVGElement>) => {
    setMousePosition(convertToPoint(event.clientX, event.clientY));
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

  const [contextMenu, setContextMenu] = useState<{
    mouseX: null | number;
    mouseY: null | number;
  }>({ mouseX: null, mouseY: null });

  const [contextMenuTarget, setContextMenuTarget] = useState<Element | null>(
    null
  );

  const handleContextMenu = useCallback((event: MouseEvent<SVGSVGElement>) => {
    console.log(event.target);

    const target = event.target as Element;

    const closestPoint = target.closest("[data-entity='point']");

    if (closestPoint) {
      setContextMenuTarget(closestPoint);
    } else {
      setContextMenuTarget(null);
    }

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
    if (!activeGraph) return;
    if (!graphId) return;

    const point = convertToPoint(contextMenu.mouseX!, contextMenu.mouseY!);

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

  const deleteNode = () => {
    if (!activeGraph) return;
    if (!graphId) return;

    const deleteIndex = parseInt(
      contextMenuTarget?.getAttribute("data-id") || "-1"
    );

    const newNodes = activeGraph.nodes.filter(
      (_, index) => index !== deleteIndex
    );

    const newGraph: Graph = {
      ...activeGraph!,
      nodes: newNodes,
    };

    useGraphListStore.getState().updateGraph(graphId, newGraph);
    handleClose();
  };

  const connectNode = () => {
    const connectIndex = parseInt(
      contextMenuTarget?.getAttribute("data-id") || "-1"
    );
    setConnectingIndex(connectIndex);
    handleClose();
  };

  const focusContent = () => {
    handleClose();
  };

  const points = activeGraph?.nodes.map((node, index) => (
    <circle
      data-entity="point"
      data-id={index}
      key={index}
      cx={node.x}
      cy={node.y}
      r={10}
      fill="red"
    />
  ));

  const connectionStart =
    connectingIndex !== -1 ? activeGraph?.nodes[connectingIndex] : null;

  const connectionEnd = mousePosition;

  return (
    <>
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
        {connectionEnd && connectionStart && (
          <line
            x1={connectionStart.x}
            y1={connectionStart.y}
            x2={connectionEnd.x}
            y2={connectionEnd.y}
            stroke="green"
            strokeWidth={2}
          />
        )}
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
        {contextMenuTarget && (
          <MenuItem onClick={deleteNode}>Delete Node</MenuItem>
        )}
        {contextMenuTarget && (
          <MenuItem onClick={connectNode}>Connect Node</MenuItem>
        )}

        {!contextMenuTarget && <MenuItem onClick={addNode}>Add Node</MenuItem>}
        {!contextMenuTarget && (
          <MenuItem onClick={focusContent}>Focus Content</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default GraphEditor;

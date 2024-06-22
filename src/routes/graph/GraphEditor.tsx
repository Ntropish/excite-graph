import React, {
  useState,
  useRef,
  WheelEvent,
  MouseEvent,
  useCallback,
  useMemo,
} from "react";
import useViewBox from "../../useViewBox"; // Import the hook we created earlier
import { Menu, MenuItem } from "@mui/material";

import { useParams } from "react-router-dom";
import {
  Graph,
  GraphEdge,
  GraphNode,
  useGraphListStore,
} from "../../stores/useGraphListStore";

import usePop from "../../hooks/usePop";

import useResizeObserver from "use-resize-observer";

import GridLines from "./GridLines";

import scaleRect from "../../util/scaleRect";

import assert from "tiny-invariant";

type InteractiveSVGProps = {
  children?: React.ReactNode;
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

  const [connectingId, setConnectingId] = useState<string | null>(null);

  const [isDraggingNode, setIsDraggingNode] = useState<string | null>(null);

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
      if (connectingId) {
        setConnectingId(null);
      }
      return;
    }

    const target = event.target as Element;
    const targetNode = target.closest("[data-entity='node']");

    // Finish connecting nodes
    if (activeGraph && connectingId) {
      if (targetNode) {
        const connectIndex = targetNode.getAttribute("data-id");

        if (!connectIndex) return;

        const startIndex = Math.min(
          parseInt(connectingId),
          parseInt(connectIndex)
        );
        const endIndex = Math.max(
          parseInt(connectingId),
          parseInt(connectIndex)
        );
        const isFlipped = parseInt(connectingId) > parseInt(connectIndex);

        const newEdge: GraphEdge = {
          id: activeGraph.lastId + 1,
          from: startIndex.toString(),
          to: endIndex.toString(),
          isFlipped,
        };

        const newGraph: Graph = {
          ...activeGraph!,
          edges: {
            ...activeGraph.edges,
            [newEdge.id]: newEdge,
          },
          lastId: newEdge.id,
        };

        useGraphListStore.getState().updateGraph(graphId, newGraph);
      }
      setConnectingId(null);
    } else if (targetNode) {
      // Start dragging

      const id = targetNode.getAttribute("data-id");

      if (!id) return;

      setIsDraggingNode(id);
    } else {
      // Start panning
      startPointRef.current = convertToPoint(event.clientX, event.clientY);
      viewRectRef.current = viewBoxRect;
      setIsPanning(true);
    }
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
    } else if (
      isDraggingNode &&
      svgRef.current &&
      activeGraph?.nodes[isDraggingNode] &&
      graphId
    ) {
      const point = convertToPoint(event.clientX, event.clientY);

      const oldNodes: Record<string, GraphNode> = activeGraph?.nodes || {};
      const newNodes: Record<string, GraphNode> = {
        ...oldNodes,
        [isDraggingNode]: {
          ...activeGraph?.nodes[isDraggingNode],
          x: point.x,
          y: point.y,
        },
      };

      const newGraph: Graph = {
        ...activeGraph!,
        nodes: newNodes,
      };

      useGraphListStore.getState().updateGraph(graphId, newGraph);
    }
  };

  const onMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
    }

    if (isDraggingNode) {
      setIsDraggingNode(null);
    }
    viewRectRef.current = null;
    startPointRef.current = null;
  };

  const [contextMenu, setContextMenu] = useState<{
    mouseX: null | number;
    mouseY: null | number;
  }>({ mouseX: null, mouseY: null });

  const [contextMenuTarget, setContextMenuTarget] =
    useState<HTMLElement | null>(null);

  const contextMenuEntityType = contextMenuTarget?.dataset?.entity || null;

  const handleContextMenu = useCallback((event: MouseEvent<SVGSVGElement>) => {
    console.log(event.target);

    const target = event.target as Element;

    const closestPoint = target.closest("[data-entity]");

    if (closestPoint) {
      setContextMenuTarget(closestPoint as HTMLElement);
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

    const id = activeGraph.lastId + 1;

    const newNode: GraphNode = {
      id: id.toString(),
      x: point.x,
      y: point.y,
    };

    const newNodes = {
      ...activeGraph.nodes,
      [id]: newNode,
    };

    const newGraph: Graph = {
      ...activeGraph!,
      nodes: newNodes,
      lastId: id,
    };

    useGraphListStore.getState().updateGraph(graphId, newGraph);
    handleClose();
  };

  const deleteNode = () => {
    if (!activeGraph) return;
    if (!graphId) return;

    const deleteId = contextMenuTarget?.getAttribute("data-id") || "-1";

    const newNodes = {
      ...activeGraph.nodes,
    };

    delete newNodes[deleteId];

    const newEdges: Record<string, GraphEdge> = {
      ...activeGraph.edges,
    };

    for (const [edgeId, edge] of Object.entries(newEdges)) {
      if (
        typeof edgeId === "string" &&
        (edge.from === deleteId || edge.to === deleteId)
      ) {
        delete newEdges[edgeId];
      }
    }

    const newGraph: Graph = {
      ...activeGraph!,
      nodes: newNodes,
    };

    useGraphListStore.getState().updateGraph(graphId, newGraph);
    handleClose();
  };

  const connectNode = () => {
    const connectId = contextMenuTarget?.getAttribute("data-id") || "-1";
    setConnectingId(connectId);
    handleClose();
  };

  const popNode = () => {
    const nodeId = contextMenuTarget?.dataset.id;
    assert(nodeId, "data-id is not on the target");

    pop(nodeId);

    handleClose();
  };

  const deleteEdge = () => {
    if (!activeGraph) return;
    if (!graphId) return;

    const edgeId = contextMenuTarget?.dataset.id;

    assert(edgeId, "data-id is not on the target");

    const newEdges = {
      ...activeGraph.edges,
    };

    delete newEdges[edgeId];

    const newGraph: Graph = {
      ...activeGraph,
      edges: newEdges,
    };

    useGraphListStore.getState().updateGraph(graphId, newGraph);
    handleClose();
  };

  const flipEdge = () => {
    if (!activeGraph) return;
    if (!graphId) return;

    const edgeId = contextMenuTarget?.getAttribute("data-id") || "-1";

    const edge = activeGraph.edges[edgeId];

    if (!edge) return;

    const newEdge: GraphEdge = {
      ...edge,
      isFlipped: !edge.isFlipped,
    };

    const newGraph: Graph = {
      ...activeGraph,
      edges: {
        ...activeGraph.edges,
        [edgeId]: newEdge,
      },
    };

    useGraphListStore.getState().updateGraph(graphId, newGraph);
    handleClose();
  };

  const focusContent = () => {
    handleClose();
  };

  const { pop, popMap } = usePop();

  const handlePop = useCallback(() => {
    pop();

    handleClose();
  }, [pop]);

  const points = useMemo(() => {
    if (!activeGraph) return null;

    const pointList: JSX.Element[] = [];

    Object.entries(activeGraph.nodes).forEach(([nodeId, node]) => {
      pointList.push(
        <g
          className="graph-node"
          key={nodeId}
          data-entity="node"
          data-id={nodeId}
        >
          <circle
            cx={node.x}
            cy={node.y}
            r={10}
            fill={"hsl(0, 0%, 30%)"}
            style={{ cursor: "pointer" }}
            stroke={"hsl(0, 0%, 100%, 0.8)"}
            strokeWidth={popMap[nodeId] ? 2 : 0}
          />
          {/* <text
            x={node.x}
            y={node.y + 4}
            fontSize={11}
            fill="white"
            textAnchor="middle"
            pointerEvents="none" // Prevents the label from interfering with node interaction
          >
            {nodeId}
          </text> */}
        </g>
      );
    });

    return pointList;
  }, [activeGraph, popMap]);

  const edges = useMemo(() => {
    if (!activeGraph) return null;

    const edgeList: JSX.Element[] = [];

    Object.entries(activeGraph.edges).forEach(([edgeId, edge]) => {
      const startNode = activeGraph.nodes[edge.from];
      const endNode = activeGraph.nodes[edge.to];

      if (!startNode || !endNode) return;

      const midpointX = (startNode.x + endNode.x) / 2;
      const midpointY = (startNode.y + endNode.y) / 2;

      edgeList.push(
        <g
          key={edgeId}
          className="graph-edge"
          data-entity="edge"
          data-id={edgeId}
        >
          {/* Invisible line for better mouse interaction */}
          <line
            x1={startNode.x}
            y1={startNode.y}
            x2={endNode.x}
            y2={endNode.y}
            stroke="transparent"
            strokeWidth={10} // Wider stroke for easier clicking
            onClick={(e) => console.log(`Edge ${edgeId} clicked`, e)}
            onContextMenu={(e) => {
              e.preventDefault();
              console.log(`Right-click on edge ${edgeId}`);
            }}
          />
          {/* Visible line */}
          <line
            x1={startNode.x}
            y1={startNode.y}
            x2={endNode.x}
            y2={endNode.y}
            stroke="hsla(0, 0%, 100%, 0.2)"
            strokeWidth={2}
            markerStart={edge.isFlipped ? "url(#arrow-reverse)" : ""}
            markerEnd={!edge.isFlipped ? "url(#arrow)" : ""}
            className="visible-edge"
          />
          {/* Edge label */}
          {/* <g>
            <circle
              cx={midpointX}
              cy={midpointY}
              r={8}
              fill={"hsl(0, 0%, 100%, 0.5)"}
              style={{ cursor: "pointer" }}
              onClick={(e) => console.log(`Edge ${edgeId} clicked`, e)}
              onContextMenu={(e) => {
                e.preventDefault();
                console.log(`Right-click on edge ${edgeId}`);
              }}
            ></circle>
            <text
              fontSize={8}
              x={midpointX}
              y={midpointY + 3}
              fill="black"
              textAnchor="middle"
            >
              {edgeId}
            </text>
          </g> */}
        </g>
      );
    });

    return edgeList;
  }, [activeGraph]);

  const connectionStart = connectingId
    ? activeGraph?.nodes[connectingId]
    : null;

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
        <defs>
          <marker
            id="arrow"
            markerWidth="5"
            markerHeight="5"
            refX="9"
            refY="1.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,3 L4.5,1.5 z" fill="hsla(0, 0%, 50%, 1)" />
          </marker>
          <marker
            id="arrow-reverse"
            markerWidth="5"
            markerHeight="5"
            refX="9"
            refY="1.5"
            orient="auto-start-reverse"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,3 L4.5,1.5 z" fill="hsla(0, 0%, 50%, 1)" />
          </marker>
        </defs>

        <GridLines
          width={screenRect?.width || 1}
          height={screenRect?.height || 1}
          viewBoxRect={viewBoxRect}
        />

        {children}
        {edges}
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
        {points}
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
        {contextMenuEntityType === "node" && (
          <MenuItem onClick={deleteNode}>Delete Node</MenuItem>
        )}
        {contextMenuEntityType === "node" && (
          <MenuItem onClick={connectNode}>Connect Node</MenuItem>
        )}
        {contextMenuEntityType === "node" && (
          <MenuItem onClick={popNode}>Pop Node</MenuItem>
        )}

        {contextMenuEntityType === "edge" && (
          <MenuItem onClick={flipEdge}>Flip Edge</MenuItem>
        )}
        {contextMenuEntityType === "edge" && (
          <MenuItem onClick={deleteEdge}>Delete Edge</MenuItem>
        )}

        {!contextMenuTarget && <MenuItem onClick={addNode}>Add Node</MenuItem>}
        {!contextMenuTarget && <MenuItem onClick={handlePop}>Pop</MenuItem>}
        {!contextMenuTarget && (
          <MenuItem onClick={focusContent}>Focus Content</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default GraphEditor;

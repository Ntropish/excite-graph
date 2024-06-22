import { useCallback, useMemo } from "react";

import type { Graph, GraphNode } from "../stores/useGraphListStore";

import { useGraphListStore } from "../stores/useGraphListStore";

import { useParams } from "react-router-dom";

import assert from "tiny-invariant";

const usePop = () => {
  const { graphId } = useParams<{ graphId: string }>();

  const graphList = useGraphListStore((state) => state.graphs);

  const activeGraph = graphList.find((graph) => graph.id === graphId);

  const popMap = useMemo<Record<string, GraphNode>>(() => {
    if (!activeGraph) return {};
    const candidates = { ...activeGraph.nodes };

    for (const edge of Object.values(activeGraph.edges)) {
      if (edge.from in candidates && !edge.isFlipped) {
        delete candidates[edge.from];
      }
      if (edge.to in candidates && edge.isFlipped) {
        delete candidates[edge.to];
      }
    }

    return candidates;
  }, [activeGraph]);

  const pop = useCallback(
    (nodeId?: string) => {
      if (!activeGraph) return;
      if (!graphId) return;

      const newEdges = { ...activeGraph.edges };

      function popNode(nodeId: string) {
        assert(activeGraph, "activeGraph is undefined");
        for (const [edgeId, edge] of Object.entries(activeGraph.edges)) {
          if (edge.from === nodeId && edge.isFlipped) {
            newEdges[edgeId] = {
              ...edge,
              isFlipped: false,
            };
          } else if (edge.to === nodeId && !edge.isFlipped) {
            newEdges[edgeId] = {
              ...edge,
              isFlipped: true,
            };
          }
        }
      }

      if (nodeId) {
        popNode(nodeId);
      } else {
        for (const nodeId in popMap) {
          popNode(nodeId);
        }
      }

      const newGraph: Graph = {
        ...activeGraph,
        edges: newEdges,
      };

      useGraphListStore.getState().updateGraph(graphId, newGraph);
    },
    [activeGraph, popMap, graphId]
  );

  return { popMap, pop };
};

export default usePop;

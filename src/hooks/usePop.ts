import { useCallback, useMemo } from "react";

import type { Graph, GraphNode } from "../stores/useGraphListStore";

import { useGraphListStore } from "../stores/useGraphListStore";

const usePop = ({
  activeGraph,
  graphId,
}: {
  activeGraph: Graph | null;
  graphId: string | null;
}) => {
  const popMap = useMemo<Record<string, GraphNode>>(() => {
    if (!activeGraph) return {};
    const candidates = { ...activeGraph.nodes };

    for (const edge of Object.values(activeGraph.edges)) {
      if (edge.from in candidates && !edge.isFlipped) {
        console.log(
          "Deleting",
          edge.from,
          "from candidates because of edge",
          edge
        );
        delete candidates[edge.from];
      }
      if (edge.to in candidates && edge.isFlipped) {
        console.log(
          "Deleting",
          edge.to,
          "from candidates because of edge",
          edge
        );
        delete candidates[edge.to];
      }
    }

    return candidates;
  }, [activeGraph]);

  const pop = useCallback(() => {
    if (!activeGraph) return;
    if (!graphId) return;

    const newEdges = { ...activeGraph.edges };

    for (const nodeId in popMap) {
      for (const [edgeId, edge] of Object.entries(activeGraph.edges)) {
        console.log("Checking edge", edgeId, edge, "from node", nodeId);
        if (edge.from === nodeId && edge.isFlipped) {
          console.log("Flipping edge", edgeId, edge, "to", !edge.isFlipped);
          newEdges[edgeId] = {
            ...edge,
            isFlipped: false,
          };
        } else if (edge.to === nodeId && !edge.isFlipped) {
          console.log("Flipping edge", edgeId, edge, "to", !edge.isFlipped);
          newEdges[edgeId] = {
            ...edge,
            isFlipped: true,
          };
        }
      }
    }

    const newGraph: Graph = {
      ...activeGraph,
      edges: newEdges,
    };

    console.log(graphId, newGraph);

    useGraphListStore.getState().updateGraph(graphId, newGraph);
  }, [activeGraph, popMap, graphId]);

  return { popMap, pop };
};

export default usePop;

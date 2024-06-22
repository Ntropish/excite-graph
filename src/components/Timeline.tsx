import React, { useState, useEffect } from "react";
import {
  Stack,
  Button,
  Switch,
  FormControlLabel,
  Typography,
  Box,
} from "@mui/material";

import { styled } from "@mui/system";

import usePop from "../hooks/usePop";

import { GraphEdge } from "../stores/useGraphListStore";

import { useParams } from "react-router-dom";

import { useGraphListStore } from "../stores/useGraphListStore";

const StyledInput = styled("input")({
  padding: 10,
  border: "1px solid hsla(0, 0%, 100%, 0.4)",
  backgroundColor: "hsla(0, 0%, 15%, 0.9)",
  color: "#fff",
  borderRadius: 4,
  textAlign: "center",
  fontSize: 16,
  marginTop: 4,
  "&:focus": {
    borderColor: "hsla(0, 0%, 100%, 0.6)",
  },
});

const Timeline = () => {
  const { graphId } = useParams<{ graphId: string }>();

  const graphList = useGraphListStore((state) => state.graphs);

  const activeGraph = graphList.find((graph) => graph.id === graphId);

  const { pop } = usePop();
  const [autoStep, setAutoStep] = useState(false);
  const [stepInterval, setStepInterval] = useState(1000); // Default step interval is 1000ms (1 second)

  useEffect(() => {
    let interval: number | null = null;

    if (autoStep) {
      interval = setInterval(() => {
        pop();
      }, stepInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoStep, stepInterval, pop]);

  const handleAutoStepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoStep(event.target.checked);
  };

  const handleStepIntervalChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const interval = Math.max(Number(event.target.value), 100); // Ensure the interval is not less than 100ms
    setStepInterval(interval);
  };

  const handleCleanEdges = () => {
    if (!activeGraph) return;
    if (!graphId) return;

    const newEdges: Record<string, GraphEdge> = { ...activeGraph.edges };

    for (const [edgeId, edge] of Object.entries(activeGraph.edges)) {
      if (!activeGraph.nodes[edge.from] || !activeGraph.nodes[edge.to]) {
        delete newEdges[edgeId];
      }
    }

    useGraphListStore.getState().updateGraph(graphId, {
      ...activeGraph,
      edges: newEdges,
    });
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent={"center"}
      sx={{
        my: 2,
      }}
    >
      <Typography>Timeline</Typography>
    </Stack>
  );
};

export default Timeline;

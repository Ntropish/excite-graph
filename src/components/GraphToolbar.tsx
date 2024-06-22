import React, { useState, useEffect } from "react";
import {
  Stack,
  Button,
  Switch,
  FormControlLabel,
  Typography,
} from "@mui/material";

import { styled } from "@mui/system";
import usePop from "../hooks/usePop";

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

const GraphToolbar = () => {
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

  useEffect(() => {
    // Space to step
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        pop();
      }
    };

    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [pop]);

  const handleAutoStepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoStep(event.target.checked);
  };

  const handleStepIntervalChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const interval = Math.max(Number(event.target.value), 100); // Ensure the interval is not less than 100ms
    setStepInterval(interval);
  };

  // const handleCleanEdges = () => {
  //   if (!activeGraph) return;
  //   if (!graphId) return;

  //   const newEdges: Record<string, GraphEdge> = { ...activeGraph.edges };

  //   for (const [edgeId, edge] of Object.entries(activeGraph.edges)) {
  //     if (!activeGraph.nodes[edge.from] || !activeGraph.nodes[edge.to]) {
  //       delete newEdges[edgeId];
  //     }
  //   }

  //   useGraphListStore.getState().updateGraph(graphId, {
  //     ...activeGraph,
  //     edges: newEdges,
  //   });
  // };

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent={"center"}
      sx={{
        my: 2,
        "& button:focus": {
          outline: "1px solid hsla(0, 0%, 100%, 0.6)",
        },
      }}
      onKeyDown={(e) => {
        e.preventDefault();
        if (e.code === "Space") {
          pop();
        }
      }}
    >
      <Button onClick={() => pop()}>
        <Stack>
          Step
          <Typography
            sx={{
              display: "inline",
              color: "hsla(0, 0%, 100%, 0.5)",
              fontSize: 14,
              mt: 0.5,
            }}
          >
            {" "}
            (Spacebar)
          </Typography>
        </Stack>
      </Button>

      {/* <TextField
        label="Step Interval (ms)"
        type="number"
        variant="outlined"
        value={stepInterval}
        onChange={handleStepIntervalChange}
      /> */}

      {/* <NumberInput
        min={100}
        value={stepInterval}
        onChange={(_, value) => setStepInterval(value || 1000)}
      /> */}

      <Stack
        direction="column"
        sx={{
          border: "1px solid hsla(0, 0%, 100%, 0.2)",
          padding: "0.5rem 1rem 1rem",
          borderRadius: "0.25rem",
        }}
      >
        <FormControlLabel
          control={
            <Switch checked={autoStep} onChange={handleAutoStepChange} />
          }
          label="Auto-Step"
        />
        <Typography>
          Step Interval
          <Typography
            sx={{
              display: "inline",
              color: "hsla(0, 0%, 100%, 0.6)",
              fontSize: 14,
            }}
          >
            {" "}
            (ms)
          </Typography>
        </Typography>
        <StyledInput
          type="number"
          value={stepInterval}
          onChange={handleStepIntervalChange}
          step={100}
        />
      </Stack>

      {/* <Button onClick={handleCleanEdges}>Clean Edges</Button> */}
    </Stack>
  );
};

export default GraphToolbar;

import React, { useState, useEffect, useCallback } from "react";
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

import { useSearchParams, useParams } from "react-router-dom";

import { useGraphListStore } from "../stores/useGraphListStore";

import getBoundingRect from "../util/getBoundingRect";
import { useViewBoxStore } from "../stores/useViewBoxStore";
import scaleRect from "../util/scaleRect";

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
  const { graphId } = useParams<{ graphId: string }>();

  const graphList = useGraphListStore((state) => state.graphs);

  const activeGraph = graphList.find((graph) => graph.id === graphId);

  const [searchParams, setSearchParams] = useSearchParams();
  const { pop } = usePop();
  const [autoStep, setAutoStep] = useState(
    searchParams.get("autoStep") === "true"
  );
  const [stepInterval, setStepInterval] = useState(
    Number(searchParams.get("stepInterval")) || 1000
  );

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
    if (autoStep && !searchParams.get("autoStep") === true) {
      setSearchParams((old) => {
        const newParams = new URLSearchParams(old);
        newParams.set("autoStep", "true");
        return newParams;
      });
    } else if (!autoStep && searchParams.get("autoStep") === "true") {
      setSearchParams((old) => {
        const newParams = new URLSearchParams(old);
        newParams.delete("autoStep");
        return newParams;
      });
    }
  }, [autoStep, searchParams, setSearchParams]);

  const handleAutoStepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoStep(event.target.checked);

    // setSearchParams((old) => {
    //   const newParams = new URLSearchParams(old);

    //   if (event.target.checked) {
    //     newParams.set("autoStep", "true");
    //   } else {
    //     newParams.delete("autoStep");
    //   }

    //   return newParams;
    // });
  };

  const toggleAutoStep = useCallback(() => {
    setAutoStep(!autoStep);
  }, [autoStep]);

  const handleStepIntervalChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const interval = Math.max(Number(event.target.value), 100); // Ensure the interval is not less than 100ms
    setStepInterval(interval);
    setSearchParams((old) => {
      const newParams = new URLSearchParams(old);
      newParams.set("stepInterval", interval.toString());
      return newParams;
    });
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

  // const handleOpenTabs = () => {
  //   setSearchParams((old) => {
  //     const newParams = new URLSearchParams(old);
  //     newParams.set("tab", "nodes");
  //     return newParams;
  //   });
  // };

  const handleOpenTabs = useCallback(() => {
    setSearchParams((old) => {
      const newParams = new URLSearchParams(old);
      newParams.set("tab", "nodes");
      return newParams;
    });
  }, [setSearchParams]);

  // const handleCloseTabs = () => {
  //   setSearchParams(
  //     (old) => {
  //       const newParams = new URLSearchParams(old);
  //       newParams.delete("tab");
  //       return newParams;
  //     },
  //     { replace: true }
  //   );
  // };

  const handleCloseTabs = useCallback(() => {
    setSearchParams((old) => {
      const newParams = new URLSearchParams(old);
      newParams.delete("tab");
      return newParams;
    });
  }, [setSearchParams]);

  const handleToggleTabs = useCallback(() => {
    if (searchParams.get("tab")) {
      handleCloseTabs();
    } else {
      handleOpenTabs();
    }
  }, [handleCloseTabs, handleOpenTabs, searchParams]);

  const handleFocusGraph = useCallback(() => {
    if (!activeGraph) return;

    const nodeList = activeGraph?.nodes;

    const pointList = Object.values(nodeList).map((node) => {
      return new DOMPoint(node.x, node.y);
    });

    const boundingRect = getBoundingRect(pointList, 10);

    const scaledBoundingRect = scaleRect(boundingRect, 1.2);

    const originalAspectRatio =
      useViewBoxStore.getState().width / useViewBoxStore.getState().height;

    let newViewBoxRect: DOMRect;
    if (originalAspectRatio < 1) {
      const newHeight = scaledBoundingRect.width / originalAspectRatio;

      const extraHeight = newHeight - scaledBoundingRect.height;

      const extraWidth = scaledBoundingRect.width - boundingRect.width;

      newViewBoxRect = new DOMRect(
        scaledBoundingRect.x - extraWidth / 2,
        scaledBoundingRect.y - extraHeight / 2,
        scaledBoundingRect.width,
        newHeight
      );
    } else {
      const newWidth = scaledBoundingRect.height * originalAspectRatio;

      const extraWidth = newWidth - boundingRect.width;

      const extraHeight = scaledBoundingRect.height - boundingRect.height;

      newViewBoxRect = new DOMRect(
        scaledBoundingRect.x - extraWidth / 2,
        scaledBoundingRect.y - extraHeight / 2,
        newWidth,
        scaledBoundingRect.height
      );
    }

    useViewBoxStore.getState().setViewBox(newViewBoxRect);
  }, [activeGraph]);

  useEffect(() => {
    // Space to step
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "KeyS") {
        pop();
      }
      if (event.code === "KeyF") {
        handleFocusGraph();
      }
      if (event.code === "KeyL") {
        handleToggleTabs();
      }
      if (event.code === "KeyA") {
        toggleAutoStep();
      }

      // if (event.code === "KeyC") {
      //   handleCleanEdges();
      // }
    };

    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [handleFocusGraph, handleToggleTabs, pop, toggleAutoStep]);

  // const handleFrameContent = () => {

  //   if (!activeGraph) return

  //   const nodeList = activeGraph?.nodes

  //   const pointList = Object.values(nodeList).map((node) => {
  //     return new DOMPoint(node.x, node.y)
  //   }

  //   )

  //   const boundingRect = getBoundingRect(pointList)

  // }

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
    >
      <Box sx={{ flex: "1 1 0" }}></Box>
      <Button onClick={() => pop()}>
        <Stack>
          Step
          <Typography
            sx={{
              display: "inline",
              color: "hsla(0, 0%, 100%, 0.5)",
              fontSize: 18,
              letterSpacing: 1.5,
            }}
          >
            {" "}
            [S]
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
        <Stack direction="row" alignItems="center" justifyContent="center">
          <FormControlLabel
            control={
              <Switch checked={autoStep} onChange={handleAutoStepChange} />
            }
            label="Auto-Step"
          />
          <Typography
            sx={{
              display: "inline",
              color: "hsla(0, 0%, 100%, 0.5)",
              fontSize: 18,
              letterSpacing: 1.5,
            }}
          >
            [A]
          </Typography>
        </Stack>
        <Box>
          <Typography
            sx={{
              display: "inline",
              color: "hsla(0, 0%, 100%, 0.8)",
              fontSize: 14,
            }}
          >
            Interval
          </Typography>
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
        </Box>
        <StyledInput
          type="number"
          value={stepInterval}
          onChange={handleStepIntervalChange}
          step={50}
          min={100}
        />
      </Stack>

      <Box sx={{ flex: "1 1 0", display: "flex" }} justifyContent={"right"}>
        <Button
          onClick={handleFocusGraph}
          variant="text"
          sx={{ m: 2 }}
          disabled={!activeGraph}
        >
          <Stack>
            <Box>Focus Graph</Box>

            <Typography
              sx={{
                display: "inline",
                color: "hsla(0, 0%, 100%, 0.5)",
                fontSize: 18,
                letterSpacing: 1.5,
              }}
            >
              [F]
            </Typography>
          </Stack>
        </Button>
        {!searchParams.get("tab") && (
          <Button onClick={handleOpenTabs} variant="text" sx={{ m: 2 }}>
            <Stack>
              <Box>Lists</Box>

              <Typography
                sx={{
                  display: "inline",
                  color: "hsla(0, 0%, 100%, 0.5)",
                  fontSize: 18,
                  letterSpacing: 1.5,
                }}
              >
                [L]
              </Typography>
            </Stack>
          </Button>
        )}
        {searchParams.get("tab") && (
          <Button onClick={handleCloseTabs} variant="text" sx={{ m: 2 }}>
            <Stack>
              <Box>Close Lists</Box>

              <Typography
                sx={{
                  display: "inline",
                  color: "hsla(0, 0%, 100%, 0.5)",
                  fontSize: 18,
                  letterSpacing: 1.5,
                }}
              >
                [L]
              </Typography>
            </Stack>
          </Button>
        )}
      </Box>

      {/* <Button onClick={handleCleanEdges}>Clean Edges</Button> */}
    </Stack>
  );
};

export default GraphToolbar;

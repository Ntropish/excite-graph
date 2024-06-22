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

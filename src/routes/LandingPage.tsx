import { Box, Stack, Button } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useGraphListStore } from "../stores/useGraphListStore";

const LandingPage = () => {
  const addGraph = useGraphListStore((state) => state.addGraph);
  const navigate = useNavigate();

  const handleAddGraphButtonClick = () => {
    const graphId = "graph-" + Math.random().toString(36).substr(2, 9);
    addGraph({
      id: graphId,
      nodes: {},
      edges: {},
      viewBox: "0 0 300 300",
      lastId: 0,
      title: "",
    });

    navigate(`/graph/${graphId}`);
  };

  return (
    <Stack
      sx={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      spacing={2}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Button onClick={handleAddGraphButtonClick}>Create New Graph</Button>
      </Box>
    </Stack>
  );
};

export default LandingPage;

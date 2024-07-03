import React from "react";
import { Box, Drawer, IconButton } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

import GraphList from "./GraphList";
import { Route, Routes } from "react-router-dom";
import Graph from "./routes/graph";
import LandingPage from "./routes/LandingPage";

const App = () => {
  const [leftDrawerOpen, setLeftDrawerOpen] = React.useState(false);

  const toggleLeftDrawer = (open: boolean) => () => {
    setLeftDrawerOpen(open);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      <Box
        sx={{
          position: "fixed",
          top: "1rem",
          left: "1.5rem",
          zIndex: 1,
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleLeftDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <Drawer
        anchor="left"
        open={leftDrawerOpen}
        onClose={toggleLeftDrawer(false)}
      >
        <GraphList />
      </Drawer>

      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
        }}
      >
        <Routes>
          <Route path="/" element={<LandingPage></LandingPage>} />
          <Route path="/graph/:graphId" element={<Graph />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;

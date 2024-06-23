import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Toolbar,
  AppBar,
  Typography,
  TextField,
} from "@mui/material";

import { useTheme } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Resizable } from "re-resizable";

import GraphInspector from "./routes/graph/GraphInspector";
import GraphList from "./GraphList";
import DrawerHeader from "./components/DrawerHeader";
import { Route, Routes } from "react-router-dom";
import Graph from "./routes/graph";

import { useParams } from "react-router-dom";

import { useGraphListStore } from "./stores/useGraphListStore";

const drawerWidth = 240;

const App = () => {
  const [leftDrawerOpen, setLeftDrawerOpen] = React.useState(false);

  const { graphId } = useParams<{ graphId: string }>();

  const graphList = useGraphListStore((state) => state.graphs);

  const activeGraph = graphList.find((graph) => graph.id === graphId);

  const toggleLeftDrawer = (open) => () => {
    setLeftDrawerOpen(open);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      <Box
        sx={{
          position: "fixed",
          top: "1rem",
          left: "1.5rem",
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
          <Route path="/graph/:graphId" element={<Graph />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;

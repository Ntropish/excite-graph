import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Toolbar,
  AppBar,
  Typography,
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

const drawerWidth = 240;

const App = () => {
  const [leftDrawerOpen, setLeftDrawerOpen] = React.useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(false);

  const theme = useTheme();

  const toggleLeftDrawer = (open) => () => {
    setLeftDrawerOpen(open);
  };

  const toggleRightDrawer = (open) => () => {
    setRightDrawerOpen(open);
  };

  const handleRightDrawerClose = () => {
    setRightDrawerOpen(false);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleLeftDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 200,
              color: "hsla(0, 0%, 100%, 0.7)",
            }}
          >
            Excitable Graph
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={leftDrawerOpen}
        onClose={toggleLeftDrawer(false)}
      >
        <GraphList />
      </Drawer>
      <Drawer
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="right"
        open={rightDrawerOpen}
        onClose={toggleRightDrawer(false)}
      >
        <DrawerHeader>
          <IconButton onClick={handleRightDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <GraphInspector />
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

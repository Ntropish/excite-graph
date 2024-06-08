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

import GraphInspector from "./GraphInspector";
import GraphList from "./GraphList";
import DrawerHeader from "./DrawerHeader";

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
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleLeftDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Application
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleRightDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
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
          width: rightDrawerOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
          transition: theme.transitions.create(["width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Resizable
            defaultSize={{ width: "100%", height: "50%" }}
            enable={{ bottom: true }}
            minHeight={"10%"}
            maxHeight={"90%"}
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "red",
            }}
          >
            <Box sx={{ height: "100%", bgcolor: "background.paper" }}>
              {/* Left pane content */}
            </Box>
          </Resizable>
          <Box sx={{ flex: 1, bgcolor: "background.paper" }}>
            {/* Right pane content */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default App;

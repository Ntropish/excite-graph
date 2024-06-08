import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  AppBar,
  Typography,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Resizable } from "re-resizable";
import "react-resizable/css/styles.css";

const drawerWidth = 240;

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [leftWidth, setLeftWidth] = useState("33.33%");
  const [centerWidth, setCenterWidth] = useState("33.33%");
  const [rightWidth, setRightWidth] = useState("33.34%");

  console.log("hi");

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleResizeLeft = (e, direction, ref, d) => {
    const newLeftWidth = (ref.offsetWidth / window.innerWidth) * 100;
    const newCenterWidth = 100 - newLeftWidth - parseFloat(rightWidth);

    // log event
    console.log(e);
    console.log(direction);
    console.log(ref);
    console.log(d);

    setLeftWidth(`${newLeftWidth}%`);
    setCenterWidth(`${newCenterWidth}%`);
  };

  const handleResizeCenter = (e, direction, ref, d) => {
    const newCenterWidth = (ref.offsetWidth / window.innerWidth) * 100;
    const newRightWidth = 100 - parseFloat(leftWidth) - newCenterWidth;

    setCenterWidth(`${newCenterWidth}%`);
    setRightWidth(`${newRightWidth}%`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: drawerOpen ? "100%" : "100vw",
      }}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            MUI Resizable Layout
          </Typography>
          <IconButton
            color="inherit"
            edge="end"
            onClick={toggleDrawer}
            sx={{ marginLeft: "auto" }}
          >
            {drawerOpen ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="persistent" anchor="left" open={drawerOpen}>
        <Toolbar />
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Drawer Content</Typography>
          <Typography>Additional content can go here.</Typography>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          marginLeft: drawerOpen ? `${drawerWidth}px` : 0,
          transition: "margin 0.3s",
        }}
      >
        <Toolbar />
        <Box sx={{ display: "flex", flexGrow: 1, height: "100%" }}>
          <Resizable
            size={{ width: leftWidth, height: "100%" }}
            minWidth="10%"
            maxWidth="80%"
            enable={{ right: true }}
            onResizeStop={handleResizeLeft}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f0f0f0",
              borderRight: "1px solid #ddd",
            }}
          >
            <Box
              sx={{ textAlign: "center", fontSize: "4rem", userSelect: "none" }}
            >
              ◀
            </Box>
          </Resizable>
          <Resizable
            size={{ width: centerWidth, height: "100%" }}
            minWidth="10%"
            maxWidth="80%"
            enable={{ right: true }}
            onResizeStop={handleResizeCenter}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f0f0f0",
              borderRight: "1px solid #ddd",
            }}
          >
            <Box
              sx={{ textAlign: "center", fontSize: "4rem", userSelect: "none" }}
            >
              ▲
            </Box>
          </Resizable>
          <Box
            sx={{
              width: rightWidth,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              backgroundColor: "#f0f0f0",
              textAlign: "center",
              fontSize: "4rem",
              userSelect: "none",
            }}
          >
            ▶
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default App;

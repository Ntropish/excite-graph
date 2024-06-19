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
import DrawerHeader from "../../components/DrawerHeader";

import GraphEditor from "./GraphEditor";

const drawerWidth = 240;

const Graph = () => {
  return (
    <Box sx={{ display: "flex", height: "100%", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          flex: 1,
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",

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
            <Box
              sx={{ height: "100%", bgcolor: "background.paper", minHeight: 0 }}
            >
              {/* Graph content */}
              <GraphEditor>
                <rect x="10" y="10" width="50" height="5" fill="blue" />
                <rect x="90" y="10" width="5" height="5" fill="blue" />
                <rect x="10" y="90" width="5" height="5" fill="blue" />
                <rect x="90" y="90" width="5" height="5" fill="blue" />
              </GraphEditor>
            </Box>
          </Resizable>
          <Box sx={{ flex: 1, bgcolor: "background.paper" }}>
            {/* Timeline content */}
            Timeline
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Graph;

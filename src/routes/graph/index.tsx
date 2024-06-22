import {
  Box,
  Tab,
  Tabs,
  Stack,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";

import { Resizable } from "re-resizable";

import GraphEditor from "./GraphEditor";

import NodeList from "../../components/NodeList";
import EdgeList from "../../components/EdgeList";
import Timeline from "../../components/Timeline";
import GraphToolbar from "../../components/GraphToolbar";

const Graph = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "nodes";

  const theme = useTheme();

  const isWideScreen = useMediaQuery(
    "(min-width:1200px) and (min-aspect-ratio: 16/9)"
  ); // Adjust 'lg' as needed

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setSearchParams({ tab: newValue });
  };
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: isWideScreen ? "row" : "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Resizable
        defaultSize={{
          width: isWideScreen ? "50%" : "100%",
          height: isWideScreen ? "100%" : "50%",
        }}
        enable={{
          bottom: !isWideScreen,
          right: isWideScreen,
        }}
        minHeight={isWideScreen ? "100%" : "10%"}
        maxHeight={isWideScreen ? "100%" : "90%"}
        minWidth={isWideScreen ? "10%" : "100%"}
        style={{
          display: "flex",
          flexDirection: "column",
          borderBottom: isWideScreen
            ? "none"
            : `1px solid ${theme.palette.divider}`,
          borderRight: isWideScreen
            ? `1px solid ${theme.palette.divider}`
            : "none",
        }}
      >
        <Stack
          direction="column"
          sx={{ height: "100%", bgcolor: "background.paper", minHeight: 0 }}
        >
          {/* Graph content */}
          <GraphEditor></GraphEditor>
          <GraphToolbar />
        </Stack>
      </Resizable>
      <Box
        sx={{
          flex: 1,
          bgcolor: "background.paper",
          minHeight: 0,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Tabs for Nodes, Edges, Timeline */}

        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Nodes" value="nodes" />
          <Tab label="Edges" value="edges" />
          <Tab label="Timeline" value="timeline" />
        </Tabs>
        {/* Conditional rendering based on the current tab */}
        {currentTab === "nodes" && <NodeList />}
        {currentTab === "edges" && <EdgeList />}
        {currentTab === "timeline" && <Timeline />}
      </Box>
    </Box>
  );
};

export default Graph;

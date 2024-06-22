import { Box, Tab, Tabs } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import { Resizable } from "re-resizable";

import GraphEditor from "./GraphEditor";

import NodeList from "../../components/NodeList";

const Graph = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "nodes";

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setSearchParams({ tab: newValue });
  };
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",

        height: "100%",
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
        <Box sx={{ height: "100%", bgcolor: "background.paper", minHeight: 0 }}>
          {/* Graph content */}
          <GraphEditor>
            <line
              x1="0"
              y1="0"
              x2="100"
              y2="0"
              stroke="red"
              strokeLinecap="round"
            />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="100"
              stroke="black"
              strokeLinecap="round"
            />
          </GraphEditor>
        </Box>
      </Resizable>
      <Box
        sx={{
          flex: 1,
          bgcolor: "background.paper",
          minHeight: 0,
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
        {/* {currentTab === "edges" && <Edges />}
            {currentTab === "timeline" && <Timeline />} */}
      </Box>
    </Box>
  );
};

export default Graph;

import { Box } from "@mui/material";

import { Resizable } from "re-resizable";

import GraphEditor from "./GraphEditor";

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

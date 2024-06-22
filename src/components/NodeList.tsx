import React, { useMemo } from "react";
import { Button, Box, IconButton } from "@mui/material";
import { GraphNode, useGraphListStore } from "../stores/useGraphListStore";
import { useParams } from "react-router-dom";

import DeleteIcon from "@mui/icons-material/Delete";
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const NodeList = () => {
  const { graphId } = useParams<{ graphId: string }>();

  const graphList = useGraphListStore((state) => state.graphs);

  const activeGraph = graphList.find((graph) => graph.id === graphId);

  const nodes = useMemo(
    () => Object.values(activeGraph?.nodes || {}),
    [activeGraph?.nodes]
  );

  const removeNode = (id: string) => {
    if (!activeGraph || !graphId) {
      return;
    }
    useGraphListStore.getState().updateGraph(graphId, {
      ...activeGraph,
      nodes: Object.fromEntries(
        Object.entries(activeGraph.nodes).filter(([key]) => key !== id)
      ),
    });
  };

  const columns: MRT_ColumnDef<GraphNode>[] = [
    {
      accessorKey: "id",
      header: "ID",
      size: 60,
    },
    {
      // truncate to three decimal places
      accessorFn: (row) => row.x.toFixed(3),
      header: "X",
      minSize: 100,
    },
    {
      accessorFn: (row) => row.y.toFixed(3),
      header: "Y",
      minSize: 100,
    },

    {
      header: "Actions",
      Cell: ({ row }) => (
        <IconButton onClick={() => removeNode(row.original.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  // const { ref: resizeRef, height } = useResizeObserver<HTMLDivElement>();

  const table = useMaterialReactTable({
    columns,
    data: nodes,
    enableColumnVirtualization: true,
    enableRowVirtualization: true,
    enablePagination: false,
    enableStickyFooter: true,
    enableBottomToolbar: true,
    enableDensityToggle: false,
    state: {
      density: "compact",
    },
  });

  if (!graphId || !activeGraph) {
    return <div>Graph not found</div>;
  }

  return (
    <Box sx={{ flex: 1, minHeight: 0 }}>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default NodeList;

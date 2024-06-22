import React, { useMemo } from "react";
import { Button, Box } from "@mui/material";
import { GraphNode, useGraphListStore } from "../stores/useGraphListStore";
import { useParams } from "react-router-dom";
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import useResizeObserver from "use-resize-observer";
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
    },
    {
      accessorKey: "x",
      header: "X",
    },
    {
      accessorKey: "y",
      header: "Y",
    },

    {
      header: "Actions",
      Cell: ({ row }) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => removeNode(row.original.id)}
        >
          Delete
        </Button>
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
    muiTableContainerProps: {
      sx: { height: "100%" },
    },
    muiTablePaperProps: {
      sx: { height: "100%" },
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

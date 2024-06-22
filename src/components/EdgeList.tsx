import React, { useMemo } from "react";
import { Button, Box } from "@mui/material";
import { GraphEdge, useGraphListStore } from "../stores/useGraphListStore";
import { useParams } from "react-router-dom";
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const EdgeList = () => {
  const { graphId } = useParams<{ graphId: string }>();

  const graphList = useGraphListStore((state) => state.graphs);

  const activeGraph = graphList.find((graph) => graph.id === graphId);

  const edges = useMemo(
    () => Object.values(activeGraph?.edges || {}),
    [activeGraph?.edges]
  );

  const removeEdge = (id: string) => {
    if (!activeGraph || !graphId) {
      return;
    }
    useGraphListStore.getState().updateGraph(graphId, {
      ...activeGraph,
      edges: Object.fromEntries(
        Object.entries(activeGraph.edges).filter(([key]) => key !== id)
      ),
    });
  };

  const columns: MRT_ColumnDef<GraphEdge>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "from",
      header: "From",
    },
    {
      accessorKey: "to",
      header: "To",
    },
    {
      header: "Actions",
      Cell: ({ row }) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => removeEdge(row.original.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const tableInstance = useMaterialReactTable({
    columns,
    data: edges,
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

  return (
    <Box>
      <MaterialReactTable table={tableInstance} />
    </Box>
  );
};

export default EdgeList;

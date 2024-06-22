import React, { useMemo } from "react";
import { Button, Box, IconButton, Typography } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
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
      size: 70,
      Cell: ({ cell }) => (
        <Typography sx={{ fontSize: 12, color: "hsla(0, 0%, 100%, 0.7)" }}>
          {cell.getValue<string>()}
        </Typography>
      ),
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
        <IconButton onClick={() => removeEdge(row.original.id)}>
          <DeleteIcon />
        </IconButton>
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
    enableDensityToggle: false,

    state: {
      density: "compact",
    },
  });

  return (
    <Box>
      <MaterialReactTable table={tableInstance} />
    </Box>
  );
};

export default EdgeList;

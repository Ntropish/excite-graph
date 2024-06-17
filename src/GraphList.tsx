import React from "react";
import { Box, Typography } from "@mui/material";

import { Button } from "@mui/material";
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useGraphStore } from "./useGraphStore";

import { useNavigate } from "react-router-dom";

function GraphList() {
  const graphs = useGraphStore((state) => state.graphs);
  const removeGraph = useGraphStore((state) => state.removeGraph);
  const addGraph = useGraphStore((state) => state.addGraph);
  const navigate = useNavigate();

  const handleAddGraphButtonClick = () => {
    addGraph({
      id: "graph-" + Math.random().toString(36).substr(2, 9),
      nodes: [],
      edges: {},
      viewBox: "0 0 100 100",
    });
  };

  const columns: MRT_ColumnDef<(typeof graphs)[0]>[] = [
    {
      accessorKey: "id",
      header: "Graph ID",
    },
    {
      accessorKey: "nodes.length",
      header: "Number of Nodes",
      Cell: ({ cell }) => cell.getValue<number>(),
    },
    {
      accessorKey: "edges",
      header: "Number of Edges",
      Cell: ({ cell }) =>
        Object.values(cell.getValue<object>()).reduce(
          (acc, edges) => acc + Object.keys(edges).length,
          0
        ),
    },
    {
      header: "Actions",
      Cell: ({ row }) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => removeGraph(row.original.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: graphs,
    renderTopToolbarCustomActions: () => (
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddGraphButtonClick}
      >
        Add Graph
      </Button>
    ),
    muiTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        navigate(`/graph/${row.original.id}`);
      },
    }),
  });

  return <MaterialReactTable table={table} />;
}

export default GraphList;

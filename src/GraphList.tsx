import React from "react";
import { Box, Typography } from "@mui/material";

import { Button } from "@mui/material";
import { MRT_ColumnDef, MaterialReactTable } from "material-react-table";
import { useGraphStore } from "./useGraphStore";

function GraphList() {
  const graphs = useGraphStore((state) => state.graphs);
  const removeGraph = useGraphStore((state) => state.removeGraph);

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

  return <MaterialReactTable columns={columns} data={graphs} />;
}

export default GraphList;

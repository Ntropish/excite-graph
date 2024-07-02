import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useGraphListStore } from "./stores/useGraphListStore";

import { useNavigate } from "react-router-dom";

import { useSearchParams } from "react-router-dom";

function GraphList() {
  const [searchParams] = useSearchParams();

  const graphs = useGraphListStore((state) => state.graphs);
  const removeGraph = useGraphListStore((state) => state.removeGraph);
  const addGraph = useGraphListStore((state) => state.addGraph);
  const navigate = useNavigate();

  const handleAddGraphButtonClick = () => {
    addGraph({
      id: "graph-" + Math.random().toString(36).substr(2, 9),
      nodes: {},
      edges: {},
      viewBox: "0 0 100 100",
      lastId: 0,
      title: "",
    });
  };

  const columns: MRT_ColumnDef<(typeof graphs)[0]>[] = [
    {
      accessorKey: "id",
      header: "Graph ID",
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "nodes",
      header: "Number of Nodes",
      Cell: ({ cell }) =>
        Object.values(cell.getValue<object>()).reduce(
          (acc, edges) => acc + Object.keys(edges).length,
          0
        ),
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
        <IconButton onClick={() => removeGraph(row.original.id)}>
          <DeleteIcon />
        </IconButton>
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
      onClick: () => {
        const query = new URLSearchParams(searchParams);
        navigate(`/graph/${row.original.id}?${query.toString()}`);
      },
    }),
  });

  return <MaterialReactTable table={table} />;
}

export default GraphList;

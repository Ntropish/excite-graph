import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NodePayload {
  x: number;
  y: number;
}

interface Node {
  id: number;
  payload: NodePayload;
}

interface EdgePayload {
  isFlipped: boolean;
}

interface Edges {
  [targetNodeId: number]: EdgePayload;
}

interface Graph {
  id: string;
  nodes: Node[];
  edges: {
    [startNodeId: number]: Edges;
  };
}

interface GraphState {
  graphs: Graph[];
  addGraph: (graph: Graph) => void;
  removeGraph: (id: string) => void;
}

export const useGraphStore = create<GraphState>()(
  persist(
    (set) => ({
      graphs: [],
      addGraph: (graph) =>
        set((state) => ({
          graphs: [...state.graphs, graph],
        })),
      removeGraph: (id) =>
        set((state) => ({
          graphs: state.graphs.filter((graph) => graph.id !== id),
        })),
    }),
    {
      name: "graphs-storage", // Name of the item in the storage (must be unique)
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    }
  )
);

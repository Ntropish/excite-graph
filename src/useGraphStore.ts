import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
  viewBox: string;
}

interface GraphState {
  graphs: { [id: string]: Graph }; // Store graphs in a dictionary with their id as the key
  addGraph: (graph: Graph) => void;
  removeGraph: (id: string) => void;
  listGraphs: () => Graph[]; // Function to list all graphs
}

export const useGraphStore = create<GraphState>()(
  persist(
    (set, get) => ({
      graphs: {},
      addGraph: (graph) =>
        set((state) => ({
          graphs: {
            ...state.graphs,
            [graph.id]: graph, // Add or update graph by id
          },
        })),
      removeGraph: (id) =>
        set((state) => {
          const newGraphs = { ...state.graphs };
          delete newGraphs[id]; // Remove graph by id
          return { graphs: newGraphs };
        }),
      listGraphs: () => Object.values(get().graphs), // Return all graphs as an array
    }),
    {
      name: "graphs-storage", // Name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // Use localStorage as the storage
    }
  )
);

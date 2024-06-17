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
  graphMap: { [id: string]: Graph }; // Store graphs in a dictionary with their id as the key
  graphs: Graph[]; // Derived list of all graphs
  addGraph: (graph: Graph) => void;
  removeGraph: (id: string) => void;
  updateGraph: (id: string, graph: Graph) => void;
}

export const useGraphStore = create<GraphState>()(
  persist(
    (set, get) => ({
      graphMap: {},
      graphs: [],
      addGraph: (graph) => {
        set((state) => {
          const newGraphMap = {
            ...state.graphMap,
            [graph.id]: graph, // Add or update graph by id
          };
          return {
            graphMap: newGraphMap,
            graphs: Object.values(newGraphMap), // Automatically update the list of graphs
          };
        });
      },
      removeGraph: (id) =>
        set((state) => {
          const newGraphMap = { ...state.graphMap };
          delete newGraphMap[id]; // Remove graph by id
          return {
            graphMap: newGraphMap,
            graphs: Object.values(newGraphMap), // Automatically update the list of graphs
          };
        }),
      updateGraph: (id, graph) =>
        set((state) => {
          const newGraphMap = {
            ...state.graphMap,
            [id]: graph, // Add or update graph by id
          };
          return {
            graphMap: newGraphMap,
            graphs: Object.values(newGraphMap), // Automatically update the list of graphs
          };
        }),
    }),
    {
      name: "graphs-storage", // Name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // Use localStorage as the storage
    }
  )
);

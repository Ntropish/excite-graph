import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface GraphNode {
  x: number;
  y: number;
}

interface EdgePayload {
  isFlipped: boolean;
}

export interface GraphEdgesLeaf {
  [targetNodeId: number]: EdgePayload;
}

export interface GraphEdges {
  [startNodeId: number]: GraphEdgesLeaf;
}

export interface Graph {
  id: string;
  nodes: GraphNode[];
  edges: GraphEdges;
  viewBox: string;
}

interface GraphListState {
  graphMap: { [id: string]: Graph }; // Store graphs in a dictionary with their id as the key
  graphs: Graph[]; // Derived list of all graphs
  addGraph: (graph: Graph) => void;
  removeGraph: (id: string) => void;
  updateGraph: (id: string, graph: Graph) => void;
}

export const useGraphListStore = create<GraphListState>()(
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
      name: "graph-list-storage", // Name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // Use localStorage as the storage
    }
  )
);

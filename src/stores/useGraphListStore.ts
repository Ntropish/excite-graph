import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import * as z from "zod";

export const graphNodeSchema = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
});

export type GraphNode = z.infer<typeof graphNodeSchema>;

export const graphEdgeSchema = z.object({
  id: z.string(),
  isFlipped: z.boolean(),
  from: z.string(),
  to: z.string(),
});

export type GraphEdge = z.infer<typeof graphEdgeSchema>;

export const graphSchema = z.object({
  id: z.string(),
  title: z.string(),
  nodes: z.record(graphNodeSchema),
  edges: z.record(graphEdgeSchema),
  viewBox: z.string(),
  lastId: z.number(),
});

export type Graph = z.infer<typeof graphSchema>;

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

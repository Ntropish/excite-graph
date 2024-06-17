import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SelectionState {
  selectedNodes: number[];
  setSelectedNodes: (nodes: number[]) => void;
  addSelectedNode: (node: number) => void;
  removeSelectedNode: (node: number) => void;
  clearSelectedNodes: () => void;
  selectedEdges: [number, number][];
  setSelectedEdges: (edges: [number, number][]) => void;
  addSelectedEdge: (edge: [number, number]) => void;
  removeSelectedEdge: (edge: [number, number]) => void;
  clearSelectedEdges: () => void;
}

export const useSelectionStore = create<SelectionState>()(
  persist(
    (set, get) => ({
      selectedNodes: [],
      setSelectedNodes: (nodes) => set({ selectedNodes: nodes }),
      addSelectedNode: (node) =>
        set((state) => ({
          selectedNodes: [...state.selectedNodes, node],
        })),
      removeSelectedNode: (node) =>
        set((state) => ({
          selectedNodes: state.selectedNodes.filter((n) => n !== node),
        })),
      clearSelectedNodes: () => set({ selectedNodes: [] }),
      selectedEdges: [],
      setSelectedEdges: (edges) => set({ selectedEdges: edges }),
      addSelectedEdge: (edge) =>
        set((state) => ({
          selectedEdges: [...state.selectedEdges, edge],
        })),
      removeSelectedEdge: (edge) =>
        set((state) => ({
          selectedEdges: state.selectedEdges.filter(
            (e) => e[0] !== edge[0] || e[1] !== edge[1]
          ),
        })),
      clearSelectedEdges: () => set({ selectedEdges: [] }),
    }),
    {
      name: "selection-storage", // Name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // Use localStorage as the storage
    }
  )
);

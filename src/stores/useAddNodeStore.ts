import { create } from "zustand";

interface AddNodeState {
  active: boolean;
  location: DOMPoint | null;
  startAddingNode: (location: DOMPoint) => void;
  cancelAddingNode: () => void;
  updateLocation: (location: DOMPoint) => void;
  confirmAddingNode: (location?: DOMPoint) => void;
}

export const useAddNodeStore = create<AddNodeState>()((set, get) => ({
  active: false,
  location: null,
  startAddingNode: (location) => set({ active: true, location }),
  cancelAddingNode: () => set({ active: false, location: null }),
  updateLocation: (location) => set({ location }),
  confirmAddingNode: (location) => {
    if (location) {
      set({ active: false, location });
    } else if (get().location) {
      set({ active: false, location: get().location });
    }
  },
}));

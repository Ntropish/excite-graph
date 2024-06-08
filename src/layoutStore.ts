import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PanelSizesState {
  leftWidth: number;
  centerWidth: number;
  rightWidth: number;
  setLeftWidth: (width: number) => void;
  setCenterWidth: (width: number) => void;
  setRightWidth: (width: number) => void;
}

const useStore = create<PanelSizesState>()(
  persist(
    (set) => ({
      leftWidth: 0,
      centerWidth: 0,
      rightWidth: 0,
      setLeftWidth: (width: number) => set({ leftWidth: width }),
      setCenterWidth: (width: number) => set({ centerWidth: width }),
      setRightWidth: (width: number) => set({ rightWidth: width }),
    }),
    {
      name: "panel-sizes-storage", // unique name for the local storage key
      getStorage: () => localStorage, // specify the storage mechanism
    }
  )
);

export default useStore;

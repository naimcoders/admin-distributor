import { create } from "zustand";

interface General {
  bankName: string;
  setBankName: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
}

const useGeneralStore = create<General>((set) => ({
  bankName: "",
  setBankName: (v) => set({ bankName: v }),
  category: "",
  setCategory: (v) => set({ category: v }),
}));

export default useGeneralStore;

import { create } from "zustand";

interface General {
  bankName: string;
  setBankName: (v: string) => void;
}

const useGeneralStore = create<General>((set) => ({
  bankName: "",
  setBankName: (v) => set({ bankName: v }),
}));

export default useGeneralStore;

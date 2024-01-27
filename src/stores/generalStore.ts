import { FormEvent } from "react";
import { create } from "zustand";

type CategoryProps = string[] | FormEvent<HTMLDivElement>;

interface General {
  bankName: string;
  setBankName: (v: string) => void;
  category: CategoryProps;
  setCategory: (v: CategoryProps) => void;
  picSales: CategoryProps;
  setPicSales: (v: CategoryProps) => void;
}

const useGeneralStore = create<General>((set) => ({
  bankName: "",
  setBankName: (v) => set({ bankName: v }),
  category: [],
  setCategory: (v) => set({ category: v }),
  picSales: [],
  setPicSales: (v) => set({ picSales: v }),
}));

export default useGeneralStore;

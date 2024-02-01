import { create } from "zustand";

interface Modal {
  isBankName: boolean;
  setIsBankName: (v: boolean) => void;
  isCategory: boolean;
  setIsCategory: (v: boolean) => void;
  isSubCategory: boolean;
  setIsSubCategory: (v: boolean) => void;
  isHistory: boolean;
  setIsHistory: (v: boolean) => void;
  isPeriod: boolean;
  setIsPeriod: (v: boolean) => void;
}

const useModalStore = create<Modal>((set) => ({
  isBankName: false,
  setIsBankName: (v) => set({ isBankName: v }),
  isCategory: false,
  setIsCategory: (v) => set({ isCategory: v }),
  isSubCategory: false,
  setIsSubCategory: (v) => set({ isSubCategory: v }),
  isHistory: false,
  setIsHistory: (v) => set({ isHistory: v }),
  isPeriod: false,
  setIsPeriod: (v) => set({ isPeriod: v }),
}));

export default useModalStore;

export const useActiveModal = () => {
  const {
    isBankName,
    setIsBankName,
    isCategory,
    setIsCategory,
    isHistory,
    setIsHistory,
    isPeriod,
    setIsPeriod,
    isSubCategory,
    setIsSubCategory,
  } = useModalStore();

  const actionIsBankName = () => setIsBankName(!isBankName);
  const actionIsCategory = () => setIsCategory(!isCategory);
  const actionIsSubCategory = () => setIsSubCategory(!isSubCategory);
  const actionIsHistory = () => setIsHistory(!isHistory);
  const actionIsPeriod = () => setIsPeriod(!isPeriod);

  return {
    isBankName,
    actionIsBankName,
    isCategory,
    actionIsCategory,
    isHistory,
    actionIsHistory,
    isPeriod,
    actionIsPeriod,
    isSubCategory,
    actionIsSubCategory,
  };
};

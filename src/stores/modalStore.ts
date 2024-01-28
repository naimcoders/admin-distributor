import { create } from "zustand";

interface Modal {
  isBankName: boolean;
  setIsBankName: (v: boolean) => void;
  isCategory: boolean;
  setIsCategory: (v: boolean) => void;
  isHistory: boolean;
  setIsHistory: (v: boolean) => void;
}

const useModalStore = create<Modal>((set) => ({
  isBankName: false,
  setIsBankName: (v) => set({ isBankName: v }),
  isCategory: false,
  setIsCategory: (v) => set({ isCategory: v }),
  isHistory: false,
  setIsHistory: (v) => set({ isHistory: v }),
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
  } = useModalStore();

  const actionIsBankName = () => setIsBankName(!isBankName);
  const actionIsCategory = () => setIsCategory(!isCategory);
  const actionIsHistory = () => setIsHistory(!isHistory);

  return {
    isBankName,
    actionIsBankName,
    isCategory,
    actionIsCategory,
    isHistory,
    actionIsHistory,
  };
};

import { create } from "zustand";

interface Modal {
  isBankName: boolean;
  setIsBankName: (v: boolean) => void;
  isCategory: boolean;
  setIsCategory: (v: boolean) => void;
}

const useModalStore = create<Modal>((set) => ({
  isBankName: false,
  setIsBankName: (v) => set({ isBankName: v }),
  isCategory: false,
  setIsCategory: (v) => set({ isCategory: v }),
}));

export default useModalStore;

export const useActiveModal = () => {
  const { isBankName, setIsBankName, isCategory, setIsCategory } =
    useModalStore();
  const actionIsBankName = () => setIsBankName(!isBankName);
  const actionIsCategory = () => setIsCategory(!isCategory);

  return { isBankName, actionIsBankName, isCategory, actionIsCategory };
};

import { create } from "zustand";

interface Modal {
  isBankName: boolean;
  setIsBankName: (v: boolean) => void;
}

const useModalStore = create<Modal>((set) => ({
  isBankName: false,
  setIsBankName: (v) => set({ isBankName: v }),
}));

export default useModalStore;

export const useActiveModal = () => {
  const { isBankName, setIsBankName } = useModalStore();
  const actionIsBankName = () => setIsBankName(!isBankName);

  return { isBankName, actionIsBankName };
};

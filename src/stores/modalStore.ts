import { create } from "zustand";

interface Modal {
  isPrice: boolean;
  setIsPrice: (v: boolean) => void;
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
  isDangerous: boolean;
  setIsDangerous: (v: boolean) => void;
  isCondition: boolean;
  setIsCondition: (v: boolean) => void;
  isCoordinate: boolean;
  setIsCoordinate: (v: boolean) => void;
  isConfirm: boolean;
  setIsConfirm: (v: boolean) => void;
  isPostage: boolean;
  setIsPostage: (v: boolean) => void;
  isVariant: boolean;
  setIsVariant: (v: boolean) => void;
  isSubDistributor: boolean;
  setIsSubDistributor: (v: boolean) => void;
  isTransfer: boolean;
  setIsTransfer: (v: boolean) => void;
  isTopUp: boolean;
  setIsTopUp: (v: boolean) => void;
  isWithdraw: boolean;
  setIsWithdraw: (v: boolean) => void;
  isConfirmPay: boolean;
  setIsConfirmPay: (v: boolean) => void;
}

const useModalStore = create<Modal>((set) => ({
  isPrice: false,
  setIsPrice: (v) => set({ isPrice: v }),
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
  isDangerous: false,
  setIsDangerous: (v) => set({ isDangerous: v }),
  isCondition: false,
  setIsCondition: (v) => set({ isCondition: v }),
  isCoordinate: false,
  setIsCoordinate: (v) => set({ isCoordinate: v }),
  isConfirm: false,
  setIsConfirm: (v) => set({ isConfirm: v }),
  isPostage: false,
  setIsPostage: (v) => set({ isPostage: v }),
  isVariant: false,
  setIsVariant: (v) => set({ isVariant: v }),
  isSubDistributor: false,
  setIsSubDistributor: (v) => set({ isSubDistributor: v }),
  isTransfer: false,
  setIsTransfer: (v) => set({ isTransfer: v }),
  isTopUp: false,
  setIsTopUp: (v) => set({ isTopUp: v }),
  isWithdraw: false,
  setIsWithdraw: (v) => set({ isWithdraw: v }),
  isConfirmPay: false,
  setIsConfirmPay: (v) => set({ isConfirmPay: v }),
}));

export default useModalStore;

export const useActiveModal = () => {
  const {
    isPrice,
    setIsPrice,
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
    isDangerous,
    setIsDangerous,
    isCondition,
    setIsCondition,
    isCoordinate,
    setIsCoordinate,
    isConfirm,
    setIsConfirm,
    isPostage,
    setIsPostage,
    isVariant,
    setIsVariant,
    isSubDistributor,
    setIsSubDistributor,
    isTransfer,
    setIsTransfer,
    isTopUp,
    setIsTopUp,
    isWithdraw,
    setIsWithdraw,
    isConfirmPay,
    setIsConfirmPay,
  } = useModalStore();

  const actionIsBankName = () => setIsBankName(!isBankName);
  const actionIsCategory = () => setIsCategory(!isCategory);
  const actionIsSubCategory = () => setIsSubCategory(!isSubCategory);
  const actionIsHistory = () => setIsHistory(!isHistory);
  const actionIsPeriod = () => setIsPeriod(!isPeriod);
  const actionIsDangerous = () => setIsDangerous(!isDangerous);
  const actionIsCondition = () => setIsCondition(!isCondition);
  const actionIsCoordinate = () => setIsCoordinate(!isCoordinate);
  const actionIsConfirm = () => setIsConfirm(!isConfirm);
  const actionIsPostage = () => setIsPostage(!isPostage);
  const actionIsVariant = () => setIsVariant(!isVariant);
  const actionIsSubDistributor = () => setIsSubDistributor(!isSubDistributor);
  const actionIsTransfer = () => setIsTransfer(!isTransfer);
  const actionIsTopUp = () => setIsTopUp(!isTopUp);
  const actionIsWithdraw = () => setIsWithdraw(!isWithdraw);
  const actionIsPrice = () => setIsPrice(!isPrice);
  const actionIsConfirmPay = () => setIsConfirmPay(!isConfirmPay);

  return {
    isConfirmPay,
    actionIsConfirmPay,
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
    isDangerous,
    actionIsDangerous,
    isCondition,
    actionIsCondition,
    isCoordinate,
    actionIsCoordinate,
    isConfirm,
    actionIsConfirm,
    isPostage,
    actionIsPostage,
    isVariant,
    actionIsVariant,
    isSubDistributor,
    actionIsSubDistributor,
    isTransfer,
    actionIsTransfer,
    isTopUp,
    actionIsTopUp,
    isWithdraw,
    actionIsWithdraw,
    isPrice,
    actionIsPrice,
  };
};

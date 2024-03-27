import { create } from "zustand";

interface Modal {
  isPromotion: boolean;
  setIsPromotion: (v: boolean) => void;
  isDeleteImageProduct: boolean;
  setIsDeleteImageProduct: (v: boolean) => void;
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
  isConfirmTransfer: boolean;
  setIsConfirmTransfer: (v: boolean) => void;
  isConfirmTopup: boolean;
  setIsConfirmTopup: (v: boolean) => void;
  isCreatePin: boolean;
  setIsCreatePin: (v: boolean) => void;
}

const useModalStore = create<Modal>((set) => ({
  isPromotion: false,
  setIsPromotion: (v) => set({ isPromotion: v }),
  isDeleteImageProduct: false,
  setIsDeleteImageProduct: (v) => set({ isDeleteImageProduct: v }),
  isCreatePin: false,
  setIsCreatePin: (v) => set({ isCreatePin: v }),
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
  isConfirmTransfer: false,
  setIsConfirmTransfer: (v) => set({ isConfirmTransfer: v }),
  isConfirmTopup: false,
  setIsConfirmTopup: (v) => set({ isConfirmTopup: v }),
}));

export default useModalStore;

export const useActiveModal = () => {
  const modals = useModalStore();

  const actionIsPromotion = () => modals.setIsPromotion(!modals.isPromotion);
  const actionIsBankName = () => modals.setIsBankName(!modals.isBankName);
  const actionIsCategory = () => modals.setIsCategory(!modals.isCategory);
  const actionIsSubCategory = () =>
    modals.setIsSubCategory(!modals.isSubCategory);
  const actionIsHistory = () => modals.setIsHistory(!modals.isHistory);
  const actionIsPeriod = () => modals.setIsPeriod(!modals.isPeriod);
  const actionIsDangerous = () => modals.setIsDangerous(!modals.isDangerous);
  const actionIsCondition = () => modals.setIsCondition(!modals.isCondition);
  const actionIsCoordinate = () => modals.setIsCoordinate(!modals.isCoordinate);
  const actionIsConfirm = () => modals.setIsConfirm(!modals.isConfirm);
  const actionIsPostage = () => modals.setIsPostage(!modals.isPostage);
  const actionIsVariant = () => modals.setIsVariant(!modals.isVariant);
  const actionIsSubDistributor = () =>
    modals.setIsSubDistributor(!modals.isSubDistributor);
  const actionIsTransfer = () => modals.setIsTransfer(!modals.isTransfer);
  const actionIsTopUp = () => modals.setIsTopUp(!modals.isTopUp);
  const actionIsWithdraw = () => modals.setIsWithdraw(!modals.isWithdraw);
  const actionIsPrice = () => modals.setIsPrice(!modals.isPrice);
  const actionIsConfirmTransfer = () =>
    modals.setIsConfirmTransfer(!modals.isConfirmTransfer);
  const actionIsConfirmTopUp = () =>
    modals.setIsConfirmTopup(!modals.isConfirmTopup);
  const actionIsCreatePin = () => modals.setIsCreatePin(!modals.isCreatePin);
  const actionIsDeleteImageProduct = () =>
    modals.setIsDeleteImageProduct(!modals.isDeleteImageProduct);

  return {
    actionIsPromotion,
    isPromotion: modals.isPromotion,
    isDeleteImageProduct: modals.isDeleteImageProduct,
    actionIsDeleteImageProduct,
    isConfirmTopup: modals.isConfirmTopup,
    actionIsConfirmTopUp,
    isConfirmTransfer: modals.isConfirmTransfer,
    actionIsConfirmTransfer,
    isBankName: modals.isBankName,
    actionIsBankName,
    isCategory: modals.isCategory,
    actionIsCategory,
    isHistory: modals.isHistory,
    actionIsHistory,
    isPeriod: modals.isPeriod,
    actionIsPeriod,
    isSubCategory: modals.isSubCategory,
    actionIsSubCategory,
    isDangerous: modals.isDangerous,
    actionIsDangerous,
    isCondition: modals.isCondition,
    actionIsCondition,
    isCoordinate: modals.isCoordinate,
    actionIsCoordinate,
    isConfirm: modals.isConfirm,
    actionIsConfirm,
    isPostage: modals.isPostage,
    actionIsPostage,
    isVariant: modals.isVariant,
    actionIsVariant,
    isSubDistributor: modals.isSubDistributor,
    actionIsSubDistributor,
    isTransfer: modals.isTransfer,
    actionIsTransfer,
    isTopUp: modals.isTopUp,
    actionIsTopUp,
    isWithdraw: modals.isWithdraw,
    actionIsWithdraw,
    isPrice: modals.isPrice,
    actionIsPrice,
    actionIsCreatePin,
    isCreatePin: modals.isCreatePin,
  };
};

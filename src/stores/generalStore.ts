import { FormEvent } from "react";
import { DeliveryPrice, Price, VariantProduct } from "src/api/product.service";
import { CoordinateProps } from "src/components/Coordinate";
import { create } from "zustand";

type CategoryProps = string[] | FormEvent<HTMLDivElement>;

interface Period<T> {
  startAt: T;
  endAt: T;
}

interface PostageProps {
  weight: number;
  size: {
    width: number;
    length: number;
    height: number;
  };
  postage: number;
  isOutOfTownDelivery: boolean;
}

export interface VariantTypeProps extends VariantProduct {
  files?: File;
}

export const defaultValuePrice: Price = {
  id: "",
  price: 0,
  priceDiscount: 0,
  fee: 0,
  startAt: 0,
  expiredAt: 0,
};

interface General {
  price: Price;
  setPrice: (v: Price) => void;
  deliveryPrice: DeliveryPrice;
  setDeliveryPrice: (v: DeliveryPrice) => void;
  clearDeliveryPrice: () => void;

  epoch: { startAt: number; endAt: number };
  setEpoch: (v: Period<number>) => void;
  clearEpoch: () => void;
  date: { startAt: string; endAt: string };
  setDate: (v: Period<string>) => void;

  variantTypes: VariantTypeProps[];
  setVariantType: (v: VariantTypeProps[]) => void;
  variantTypesDetailProduct: VariantTypeProps[];
  setVariantTypesDetailProduct: (v: VariantTypeProps[]) => void;

  bankName: string;
  setBankName: (v: string) => void;
  category: CategoryProps;
  setCategory: (v: CategoryProps) => void;
  picSales: CategoryProps;
  setPicSales: (v: CategoryProps) => void;
  reportType: string;
  setReportType: (v: string) => void;
  coordinate: CoordinateProps | null;
  setCoordinate: (v: CoordinateProps) => void;
  formatAddress: string;
  setFormatAddress: (v: string) => void;
  postageProduct: PostageProps;
  setPostageProduct: (v: PostageProps) => void;
}

export const defaultValueDeliveryPrice = {
  id: "",
  height: 0,
  isCourierInternal: false,
  length: 0,
  price: 0,
  weight: 0,
  wide: 0,
};

const useGeneralStore = create<General>((set) => ({
  price: defaultValuePrice,
  setPrice: (v) => set({ price: v }),
  deliveryPrice: defaultValueDeliveryPrice,
  setDeliveryPrice: (v) => set({ deliveryPrice: v }),
  clearDeliveryPrice: () => set({ deliveryPrice: defaultValueDeliveryPrice }),

  epoch: { startAt: 0, endAt: 0 },
  setEpoch: (v) => set({ epoch: v }),
  clearEpoch: () => set({ epoch: { startAt: 0, endAt: 0 } }),
  date: { startAt: "", endAt: "" },
  setDate: (v) => set({ date: v }),

  variantTypes: [],
  setVariantType: (v) => set({ variantTypes: v }),
  variantTypesDetailProduct: [],
  setVariantTypesDetailProduct: (v) => set({ variantTypesDetailProduct: v }),

  bankName: "",
  setBankName: (v) => set({ bankName: v }),
  category: [],
  setCategory: (v) => set({ category: v }),
  picSales: [],
  setPicSales: (v) => set({ picSales: v }),
  reportType: "",
  setReportType: (v) => set({ reportType: v }),
  coordinate: null,
  setCoordinate: (v) => set({ coordinate: v }),
  formatAddress: "",
  setFormatAddress: (v) => set({ formatAddress: v }),
  postageProduct: {
    weight: 0,
    size: { width: 0, length: 0, height: 0 },
    postage: 0,
    isOutOfTownDelivery: false,
  },
  setPostageProduct: (v) => set({ postageProduct: v }),
}));

export default useGeneralStore;

interface VariantIdProps {
  variantId: string[];
  setVariantId: (v: string) => void;
  clearVariantId: () => void;
  variantColorId: string[];
  setVariantColorId: (v: string) => void;
  clearVariantColorId: () => void;
}

export const useVariantIdStore = create<VariantIdProps>((set, get) => ({
  variantId: [],
  setVariantId: (val) => {
    const d: string[] = [...get().variantId, val];
    return set({ variantId: d });
  },
  clearVariantId: () => set({ variantId: [] }),
  variantColorId: [],
  setVariantColorId: (val) => {
    const d: string[] = [...get().variantColorId, val];
    return set({ variantColorId: d });
  },
  clearVariantColorId: () => set({ variantColorId: [] }),
}));

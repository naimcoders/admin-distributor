import { FormEvent } from "react";
import { DeliveryPrice } from "src/api/product.service";
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

interface VariantSizeProps {
  name: string;
  price?: number;
  imageUrl?: string;
}

export interface VariantTypeProps {
  name: string;
  files?: File;
  imageUrl?: string;
  variantColorProduct: VariantSizeProps[];
}

interface General {
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
  isCourierInternal: true,
  length: 0,
  price: 0,
  weight: 0,
  wide: 0,
};

const useGeneralStore = create<General>((set) => ({
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

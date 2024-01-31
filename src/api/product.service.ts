import queryString from "query-string";
import { ReqPaging, ResPaging } from "src/interface";
import { req } from "./request";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export interface Product {
  category: Category;
  categoryId: string;
  createdAt: number;
  deliveryPrice: DeliveryPrice;
  description: string;
  id: string;
  imageUrl: DeliveryPrice;
  isAvailable: boolean;
  isDangerous: boolean;
  isPrimary: boolean;
  name: string;
  price: DeliveryPrice;
  rate: number;
  updatedAt: number;
  user: User;
  userId: string;
  variantProduct: VariantProduct[];
  wishlist: number;
  yourWishlist: boolean;
}

export interface Category {
  category: SubCategory;
  createdAt: number;
  id: string;
  subCategory: SubCategory[];
  updatedAt: number;
  userId: string;
}

export interface SubCategory {
  createdAt: number;
  id: string;
  isActive?: boolean;
  name: string;
  updatedAt: number;
  categoryId?: string;
}

export interface DeliveryPrice {}

export interface User {
  bank: Bank;
  courier: Courier;
  customer: Customer;
  distributor: Distributor;
  id: string;
  location: Location[];
  store: Distributor;
  wallet: Wallet;
}

export interface Bank {
  accountName: string;
  accountNumber: string;
  bankName: string;
  createdAt: number;
  id: string;
  updatedAt: number;
  userId: string;
}

export interface Courier {
  courierInternal: CourierInternal;
  createdAt: number;
  details: string;
  document: DeliveryPrice;
  email: string;
  emailVerify: boolean;
  fcmToken: string;
  id: string;
  imageUrl: string;
  isActive: boolean;
  isCourierInternal: boolean;
  isSuspend: boolean;
  name: string;
  phoneNumber: string;
  rate: number;
  updatedAt: number;
  vehicle: DeliveryPrice;
}

export interface CourierInternal {
  courier: string;
  courierId: string;
  createdAt: number;
  distributor: Distributor;
  distributorId: string;
  id: string;
  store: Distributor;
  storeId: string;
  updatedAt: number;
}

export interface Distributor {
  banner: string;
  createdAt: number;
  details: string;
  documents?: DeliveryPrice;
  email: string;
  emailVerify: boolean;
  fcmToken: string;
  id: string;
  imageUrl: string;
  isSuspend: boolean;
  isVerify: boolean;
  name?: string;
  ownerName: string;
  phoneNumber: string;
  rate: number;
  updatedAt: number;
  isOpen?: boolean;
  ktpImageUrl?: string;
  storeName?: string;
}

export interface Customer {
  createdAt: number;
  dateBirth: string;
  details: string;
  email: string;
  emailVerify: boolean;
  fcmToken: string;
  gender: string;
  id: string;
  imageUrl: string;
  isSuspend: boolean;
  name: string;
  phoneNumber: string;
  updatedAt: number;
}

export interface Location {
  addressName: string;
  city: string;
  detailAddress: string;
  district: string;
  isPrimary: boolean;
  lat: number;
  lng: number;
  province: string;
  type: string;
  userId: string;
  zipCode: string;
}

export interface Wallet {
  active: boolean;
  balance: number;
  createdAt: number;
  history: History[];
  id: string;
  updatedAt: number;
  userId: string;
}

export interface History {
  amount: number;
  createdAt: number;
  description: string;
  id: string;
  isCredit: boolean;
  status: string;
  transactionId: string;
  walletId: string;
}

export interface VariantProduct {
  createdAt: number;
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  productId: string;
  updatedAt: number;
  variantColorProduct: VariantColorProduct[];
}

export interface VariantColorProduct {
  createdAt: number;
  id: string;
  imageUrl: string;
  name: string;
  variantProductId: string;
}

class Api {
  private static instance: Api;
  private constructor() {}
  public static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance;
  }

  private path = "product";

  private errors: { [key: number]: string } = {
    400: "input tidak valid",
    401: "hak akses ditolak",
    403: "forbidden",
    404: "data tidak ditemukan",
    500: "server sedang bermasalah, silahkan coba beberapa saat lagi",
  };

  async find(r: ReqPaging): Promise<ResPaging<Product>> {
    const query = queryString.stringify(
      {
        page: r.page,
        limit: r.limit,
        search: r.search,
      },
      { skipEmptyString: true, skipNull: true }
    );

    return await req<ResPaging<Product>>({
      method: "GET",
      isNoAuth: false,
      errors: this.errors,
      path: `${this.path}/me?${query}`,
    });
  }
}

interface ApiProductInfo {
  find(r: ReqPaging): Promise<ResPaging<Product>>;
}

export function getProductApiInfo(): ApiProductInfo {
  return Api.getInstance();
}

const key = "product";

export const useProduct = () => {
  const find = () => {
    const [page, _] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");

    const byPaging = async () =>
      await getProductApiInfo().find({
        page,
        limit,
        search,
      });

    const { data, isLoading, error } = useQuery<ResPaging<Product>, Error>({
      queryKey: [key, page, limit, search],
      queryFn: byPaging,
    });

    return {
      data,
      isLoading,
      error: error?.message,
      page,
      limit,
      setLimit,
      setSearch,
      isNext: data?.canNext,
    };
  };

  return { find };
};

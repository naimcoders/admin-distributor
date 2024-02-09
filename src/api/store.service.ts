import queryString from "query-string";
import { ReqPaging, ResPaging } from "src/interface";
import { req } from "./request";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export interface Store {
  banner: string;
  createdAt: number;
  details: Details;
  email: string;
  emailVerify: boolean;
  fcmToken: string;
  id: string;
  imageUrl: string;
  isOpen: boolean;
  isSuspend: boolean;
  isVerify: boolean;
  ktpImageUrl: string;
  ownerName: string;
  phoneNumber: string;
  rate: number;
  storeName: string;
  updatedAt: number;
}

export interface Details {
  bank: Bank;
  courier: Courier;
  customer: Customer;
  distributor: Distributor;
  location: Location[];
  store: string;
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
  createdAt: number;
  details: string;
  document: Document;
  email: string;
  emailVerify: boolean;
  fcmToken: string;
  id: string;
  imageUrl: string;
  isActive: boolean;
  isSuspend: boolean;
  name: string;
  phoneNumber: string;
  rate: number;
  updatedAt: number;
  vehicle: Document;
}

export interface Document {}

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

export interface Distributor {
  banner: string;
  createdAt: number;
  deletedAt: DeletedAt;
  details: string;
  documents: Document;
  email: string;
  emailVerify: boolean;
  fcmToken: string;
  id: string;
  imageUrl: string;
  isSuspend: boolean;
  isVerify: boolean;
  name: string;
  ownerName: string;
  phoneNumber: string;
  rate: number;
  updatedAt: number;
}

export interface DeletedAt {
  time: string;
  valid: boolean;
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

class Api {
  private static instance: Api;
  private constructor() {}
  public static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance;
  }

  private path = "store";

  private errors: { [key: number]: string } = {
    400: "input tidak valid",
    401: "hak akses ditolak",
    403: "forbidden",
    404: "data tidak ditemukan",
    500: "server sedang bermasalah, silahkan coba beberapa saat lagi",
  };

  async find(r: ReqPaging): Promise<ResPaging<Store>> {
    const query = queryString.stringify(
      {
        limit: r.limit,
        page: r.page,
        search: r.search,
      },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    );

    return await req<ResPaging<Store>>({
      method: "GET",
      isNoAuth: false,
      path: `${this.path}?${query}`,
      errors: this.errors,
    });
  }

  async findById(id: string): Promise<Store> {
    return await req<Store>({
      method: "GET",
      isNoAuth: false,
      path: `${this.path}/${id}`,
      errors: this.errors,
    });
  }
}

interface ApiStoreInfo {
  find(r: ReqPaging): Promise<ResPaging<Store>>;
  findById(id: string): Promise<Store>;
}

export function getStoreApiInfo(): ApiStoreInfo {
  return Api.getInstance();
}

const key = "store";

export const useStore = () => {
  const find = () => {
    const [page, _] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");

    const byPaging = async () =>
      await getStoreApiInfo().find({ page, limit, search });

    const { data, isLoading, error } = useQuery<ResPaging<Store>, Error>({
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
      search,
      setSearch,
      isNext: data?.canNext,
    };
  };

  const findByid = (id: string) => {
    const byId = async () => await getStoreApiInfo().findById(id);

    const { data, isLoading, error } = useQuery<Store, Error>({
      queryKey: [key, id],
      queryFn: byId,
    });

    return {
      data,
      isLoading,
      error: error?.message,
    };
  };

  return { find, findByid };
};

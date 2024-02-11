import { ReqPaging, ResPaging } from "src/interface";
import { req } from "./request";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import queryString from "query-string";

export interface Distributor {
  banner: string;
  createdAt: number;
  details: Details;
  documents: Documents;
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

export interface Details {
  bank: Bank;
  courier: Courier;
  customer: Customer;
  distributor: string;
  email: string;
  id: string;
  location: Location[];
  store: Store;
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
  document: Documents;
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
  vehicle: Documents;
}

export interface CourierInternal {
  courier: string;
  courierId: string;
  createdAt: number;
  distributor: string;
  distributorId: string;
  id: string;
  store: Store;
  storeId: string;
  updatedAt: number;
}

export interface Store {
  banner: string;
  createdAt: number;
  details: string;
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

export interface Documents {}

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

class Api {
  private static instance: Api;
  private constructor() {}
  public static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance;
  }

  private path = "distributor";
  async find(r: ReqPaging): Promise<ResPaging<Distributor>> {
    const query = queryString.stringify(
      { page: r.page, limit: r.limit, search: r.search },
      { skipEmptyString: true, skipNull: true }
    );

    return await req<ResPaging<Distributor>>({
      method: "GET",
      path: `${this.path}?${query}`,
      errors: "",
      isNoAuth: false,
    });
  }

  async findById(id: string): Promise<Distributor> {
    return await req<Distributor>({
      method: "GET",
      errors: "",
      path: `${this.path}/${id}`,
      isNoAuth: false,
    });
  }
}

interface ApiDistributorInfo {
  find(r: ReqPaging): Promise<ResPaging<Distributor>>;
  findById(id: string): Promise<Distributor>;
}

export function getDistributorApiInfo(): ApiDistributorInfo {
  return Api.getInstance();
}

const key = "distributor";

export const useDistributor = () => {
  const find = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");

    const byPaging = async () =>
      await getDistributorApiInfo().find({ page, limit, search });

    const { data, isLoading, error } = useQuery({
      queryKey: [key, page, limit, search],
      queryFn: byPaging,
    });

    return {
      data,
      isLoading,
      error: error?.message,
      page,
      setPage,
      limit,
      setLimit,
      search,
      setSearch,
      isNext: data?.canNext,
    };
  };

  const findById = (id: string) => {
    const byId = async () => await getDistributorApiInfo().findById(id);
    const { data, isLoading, error } = useQuery({
      queryKey: [key, id],
      queryFn: byId,
      enabled: !!id,
    });

    return {
      data,
      isLoading,
      error: error?.message,
    };
  };

  return { find, findById };
};

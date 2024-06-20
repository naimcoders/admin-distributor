import queryString from "query-string";
import { ReqPaging, ResPaging } from "src/interface";
import { req } from "./request";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export interface Store {
  id: string;
  ownerName: string;
  email: string;
  storeName: string;
  phoneNumber: string;
  fcmToken: string;
  banner: string;
  isVerify: boolean;
  isOpen: boolean;
  rate: number;
  isSuspend: boolean;
  emailVerify: boolean;
  imageUrl: string;
  ktpImageUrl: string;
  location: Location[];
  createdAt: number;
  updatedAt: number;
}

export interface Location {
  id: string;
  userId: string;
  lat: number;
  lng: number;
  province: string;
  city: string;
  district: string;
  type: string;
  zipCode: string;
  isPrimary: boolean;
  addressName: string;
  detailAddress: string;
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

  async find(r: ReqPaging): Promise<ResPaging<Store>> {
    const query = queryString.stringify(
      {
        limit: r.limit,
        page: r.page,
        search: r.search,
        createdById: r.createdById,
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
      errors: "",
    });
  }

  async findById(id: string): Promise<Store> {
    return await req<Store>({
      method: "GET",
      isNoAuth: false,
      path: `${this.path}/${id}`,
      errors: "",
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

export const findStores = (pageTable: number, createdById: string) => {
  const [page, setPage] = useState(pageTable);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery<ResPaging<Store>, Error>({
    queryKey: [key, page, limit, search, createdById],
    queryFn: () => getStoreApiInfo().find({ page, limit, search, createdById }),
    enabled: !!page && !!limit,
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

export const findStoreById = (id: string) => {
  const { data, isLoading, error } = useQuery<Store, Error>({
    queryKey: [key, id],
    queryFn: () => getStoreApiInfo().findById(id),
    enabled: !!id,
  });

  return {
    data,
    isLoading,
    error: error?.message,
  };
};

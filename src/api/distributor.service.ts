/* eslint-disable react-hooks/rules-of-hooks */
import { ReqPaging, ResPaging } from "src/interface";
import { req } from "./request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import queryString from "query-string";
import { toast } from "react-toastify";
import { useAuth } from "src/firebase/auth";
import { setUser } from "src/stores/auth";

export enum RoleDistributor {
  DISTRIBUTOR = "DISTRIBUTOR",
  SUB_DISTRIBUTOR = "SUB_DISTRIBUTOR",
}
export interface Distributor {
  banner: string;
  createdAt: number;
  documents: Documents;
  email: string;
  emailVerify: boolean;
  fcmToken: string;
  id: string;
  imageUrl: string;
  isSuspend: boolean;
  locations: Location[];
  isVerify: boolean;
  name: string;
  ownerName: string;
  phoneNumber: string;
  rate: number;
  updatedAt: number;
  role: RoleDistributor;
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

interface Create {
  documents: Documents;
  email: string;
  isSuspend: boolean;
  isVerify: boolean;
  location: Omit<Location, "id">;
  name: string;
  ownerName: string;
  password: string;
  phoneNumber: string;
}

export interface Documents {
  ktpImage: string;
}

export interface Location {
  addressName: string;
  city: string;
  detailAddress: string;
  district: string;
  id: string;
  isPrimary: boolean;
  lat: number;
  lng: number;
  province: string;
  type: string;
  userId: string;
  zipCode: string;
}

interface Suspend {
  isSuspend: boolean;
}

interface UpdateDocument {
  distributorId: string;
  oldKtpImage: string;
  ktpImage: string;
}

interface UpdateDistributor {
  ownerName: string;
  email?: string;
  phoneNumber: string;
  name: string;
  detailAddress?: string;
  password?: string;
  oldPassword?: string;
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

  async findTotalSubDistributor(userId: string): Promise<number> {
    return await req<number>({
      method: "GET",
      isNoAuth: false,
      path: `${this.path}/total-sub?userId=${userId}`,
      errors: "",
    });
  }

  async find(
    distributorId: string,
    r: ReqPaging
  ): Promise<ResPaging<Distributor>> {
    const query = queryString.stringify(
      {
        page: r.page,
        limit: r.limit,
        search: r.search,
        createdById: distributorId,
      },
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

  async updateSubDistributor(
    distributorId: string,
    r: UpdateDistributor
  ): Promise<null> {
    return await req<null>({
      method: "PUT",
      isNoAuth: false,
      body: r,
      path: `${this.path}/${distributorId}`,
      errors: "",
    });
  }

  async suspend(distributorId: string, r: Suspend): Promise<Distributor> {
    return await req<Distributor>({
      method: "PUT",
      isNoAuth: false,
      body: r,
      path: `${this.path}/${distributorId}/suspend`,
      errors: "",
    });
  }

  async create(r: Create): Promise<Distributor> {
    return await req<Distributor>({
      method: "POST",
      isNoAuth: false,
      body: r,
      path: this.path,
      errors: "",
    });
  }

  async updateDocument(r: UpdateDocument): Promise<null> {
    return await req<null>({
      method: "PUT",
      isNoAuth: false,
      body: r,
      path: `${this.path}/update-document`,
      errors: "",
    });
  }

  async updateDistributor(r: UpdateDistributor): Promise<null> {
    return await req<null>({
      method: "PUT",
      isNoAuth: false,
      body: r,
      path: `${this.path}/update`,
      errors: "",
    });
  }
}

interface ApiDistributorInfo {
  find(distributorId: string, r: ReqPaging): Promise<ResPaging<Distributor>>;
  findTotalSubDistributor(userId: string): Promise<number>;
  findById(id: string): Promise<Distributor>;
  suspend(distributorId: string, r: Suspend): Promise<Distributor>;
  create(r: Create): Promise<Distributor>;
  updateDocument(r: UpdateDocument): Promise<null>;
  updateSubDistributor(
    distributorId: string,
    r: UpdateDistributor
  ): Promise<null>;
  updateDistributor(r: UpdateDistributor): Promise<null>;
}

export function getDistributorApiInfo(): ApiDistributorInfo {
  return Api.getInstance();
}

const key = "distributor";

export const findTotalSubDistributor = () => {
  const user = setUser((v) => v.user);
  const { data, isLoading, error } = useQuery<number, Error>({
    queryKey: [key, "total", user?.id],
    queryFn: () =>
      getDistributorApiInfo().findTotalSubDistributor(user?.id ?? ""),
    enabled: !!user,
  });

  return {
    data,
    isLoading,
    error: error?.message,
  };
};

export const createDistributor = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation<
    Distributor,
    Error,
    { data: Create }
  >({
    mutationKey: [key, "create"],
    mutationFn: async (r) => await getDistributorApiInfo().create(r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [key] });
    },
  });

  return { mutateAsync, isPending };
};

export const suspendDistributor = () => {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation<
    Distributor,
    Error,
    { id: string; isSuspend: boolean }
  >({
    mutationKey: [key, "suspend"],
    mutationFn: (r) =>
      getDistributorApiInfo().suspend(r.id, { isSuspend: r.isSuspend }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: [key] }),
  });

  return { mutateAsync };
};

export const updateDistributor = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation<
    null,
    Error,
    UpdateDistributor
  >({
    mutationKey: [key, "update-distributor"],
    mutationFn: (r) => getDistributorApiInfo().updateDistributor(r),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: [key] }),
  });
  return { mutateAsync, isPending };
};

export const useDistributor = () => {
  const queryClient = useQueryClient();

  const find = (pageTable: number) => {
    const { user } = useAuth();
    const [page, setPage] = useState(pageTable);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");

    const byPaging = async () =>
      await getDistributorApiInfo().find(user?.uid ?? "", {
        page,
        limit,
        search,
      });

    const { data, isLoading, error } = useQuery({
      queryKey: [key, page, limit, search, user?.uid],
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
    const { data, isLoading, error } = useQuery<Distributor, Error>({
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

  const updateSubDistributor = useMutation<
    null,
    Error,
    { data: UpdateDistributor; distributorId: string }
  >({
    mutationKey: [key, "update-sub-distributor"],
    mutationFn: async (r) =>
      await getDistributorApiInfo().updateSubDistributor(
        r.distributorId,
        r.data
      ),
    onSuccess: () => {
      toast.success("Data berhasil diperbarui");
      void queryClient.invalidateQueries({ queryKey: [key] });
    },
    onError: (e) => toast.error(e.message),
  });

  const updateDocument = useMutation<null, Error, { data: UpdateDocument }>({
    mutationKey: [key, "update-document"],
    mutationFn: async (r) =>
      await getDistributorApiInfo().updateDocument(r.data),
    onSuccess: () => {
      toast.success("KTP berhasil diperbarui");
      void queryClient.invalidateQueries({ queryKey: [key] });
    },
    onError: (e) => toast.error(e.message),
  });

  return {
    find,
    findById,
    updateDocument,
    updateSubDistributor,
    updateDistributor,
  };
};

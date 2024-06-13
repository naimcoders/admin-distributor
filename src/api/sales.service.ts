import { ReqPaging, ResPaging } from "src/interface";
import { req } from "./request";
import queryString from "query-string";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Sales {
  id: string;
  name: string;
  imageUrl: string;
  phoneNumber: string;
  email: string;
  comition: number;
  fcmToken: string;
  ktpImage: string;
  isActive: boolean;
  isVerified: boolean;
  category: Category[];
  revenue: number;
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  isActive: boolean;
}

interface CreateSales {
  name: string;
  phoneNumber: string;
  email: string;
  ktpImagePath: string;
  comition: number;
  categoryId: string[];
}

interface Activated {
  isActive: boolean;
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

  private path = "sales";

  async find(r: ReqPaging): Promise<ResPaging<Sales>> {
    const query = queryString.stringify(
      { page: r.page, limit: r.limit, search: r.search },
      { skipEmptyString: true, skipNull: true }
    );

    return await req<ResPaging<Sales>>({
      method: "GET",
      isNoAuth: false,
      path: `${this.path}?${query}`,
      errors: "",
    });
  }

  async findSalesById(salesId: string): Promise<Sales> {
    return await req<Sales>({
      method: "GET",
      isNoAuth: false,
      path: `${this.path}/${salesId}`,
      errors: "",
    });
  }

  async createSales(r: CreateSales): Promise<Sales> {
    return await req<Sales>({
      method: "POST",
      isNoAuth: false,
      path: `${this.path}`,
      errors: "",
      body: r,
    });
  }

  async salesActivated(salesId: string, r: Activated): Promise<Sales> {
    return await req<Sales>({
      method: "PUT",
      isNoAuth: false,
      path: `${this.path}/${salesId}/activated`,
      errors: "",
      body: r,
    });
  }
}

interface ApiSalesInfo {
  find(r: ReqPaging): Promise<ResPaging<Sales>>;
  createSales(r: CreateSales): Promise<Sales>;
  findSalesById(salesId: string): Promise<Sales>;
  salesActivated(salesId: string, r: Activated): Promise<Sales>;
}

function getSalesApiInfo(): ApiSalesInfo {
  return Api.getInstance();
}

const key = "sales";

export const findSales = (pageTable: number) => {
  const [page, setPage] = React.useState(pageTable);
  const [limit, setLimit] = React.useState(10);
  const [search, setSearch] = React.useState("");

  const data = useQuery<ResPaging<Sales>, Error>({
    queryKey: [key, page, limit, search],
    queryFn: () => getSalesApiInfo().find({ page, limit, search }),
  });

  return {
    data: data.data,
    isLoading: data.isLoading,
    error: data.error?.message,
    limit,
    setLimit,
    page,
    setPage,
    setSearch,
    isNext: data.data?.canNext,
  };
};

export const findSalesById = (salesId: string) => {
  const data = useQuery<Sales, Error>({
    queryKey: [key, salesId],
    queryFn: () => getSalesApiInfo().findSalesById(salesId),
    enabled: !!salesId,
  });

  return {
    data: data.data,
    isLoading: data.isLoading,
    error: data.error,
  };
};

export const createSales = () => {
  const queryClient = useQueryClient();
  const data = useMutation<Sales, Error, CreateSales>({
    mutationKey: ["create-sales"],
    mutationFn: (r) => getSalesApiInfo().createSales(r),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: [key] }),
  });

  return {
    mutateAsync: data.mutateAsync,
    isLoading: data.isPending,
    error: data.error?.message,
  };
};

export const salesActivated = () => {
  const queryClient = useQueryClient();
  return useMutation<Sales, Error, Activated & { salesId: string }>({
    mutationKey: ["sales-activated"],
    mutationFn: (r) => getSalesApiInfo().salesActivated(r.salesId, r),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: [key] }),
  });
};

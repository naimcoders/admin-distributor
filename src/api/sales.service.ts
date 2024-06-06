import { ReqPaging, ResPaging } from "src/interface";
import { req } from "./request";
import queryString from "query-string";
import React from "react";
import { useQuery } from "@tanstack/react-query";

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
}

interface ApiSalesInfo {
  find(r: ReqPaging): Promise<ResPaging<Sales>>;
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

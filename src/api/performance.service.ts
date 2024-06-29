import queryString from "query-string";
import { req } from "./request";
import { setUser } from "src/stores/auth";
import { useQuery } from "@tanstack/react-query";

export interface Buyers {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  role: string;
  lat: number;
  lng: number;
  address: string;
  revenue: number;
  totalOrder: number;
}

interface StartEndAt {
  startAt: number;
  endAt: number;
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

  private path = "performance";

  async findBuyers(merchantId: string): Promise<Buyers[]> {
    const query = queryString.stringify(
      { merchantId },
      { skipEmptyString: true, skipNull: true }
    );

    return await req<Buyers[]>({
      method: "GET",
      isNoAuth: false,
      path: `${this.path}/buyers?${query}`,
      errors: "",
    });
  }

  async findRevenue(
    merchantId: string,
    startAt?: number,
    endAt?: number
  ): Promise<number> {
    const query = queryString.stringify(
      {
        merchantId,
        startAt,
        endAt,
      },
      { skipEmptyString: true, skipNull: true }
    );

    return await req<number>({
      method: "GET",
      isNoAuth: false,
      path: `${this.path}/revenue?${query}`,
      errors: "",
    });
  }

  async findOrderCount(merchantId: string): Promise<number> {
    const query = queryString.stringify(
      { merchantId },
      { skipEmptyString: true, skipNull: true }
    );

    return await req<number>({
      method: "GET",
      isNoAuth: false,
      path: `${this.path}/order-count?${query}`,
      errors: "",
    });
  }

  async findRevenueSales(r: StartEndAt): Promise<number> {
    const query = queryString.stringify(
      { startAt: r.startAt, endAt: r.endAt },
      { skipEmptyString: true, skipNull: true }
    );

    return await req<number>({
      method: "GET",
      isNoAuth: false,
      path: `${this.path}/revenue/sales?${query}`,
      errors: "",
    });
  }

  async findOrderCountSales(r: StartEndAt): Promise<number> {
    const query = queryString.stringify(
      { startAt: r.startAt, endAt: r.endAt },
      { skipEmptyString: true, skipNull: true }
    );

    return await req<number>({
      method: "GET",
      isNoAuth: false,
      path: `${this.path}/order-count/sales?${query}`,
      errors: "",
    });
  }
}

interface ApiPerformanceInfo {
  findBuyers(merchantId: string): Promise<Buyers[]>;
  findRevenue(
    merchantId: string,
    startAt?: number,
    endAt?: number
  ): Promise<number>;
  findOrderCount(merchantId: string): Promise<number>;
  findRevenueSales(r: StartEndAt): Promise<number>;
  findOrderCountSales(r: StartEndAt): Promise<number>;
}

function getPerformanceApiInfo(): ApiPerformanceInfo {
  return Api.getInstance();
}

const key = "performance";

export const findBuyers = () => {
  const user = setUser((v) => v.user);

  const { data, isLoading, error } = useQuery<Buyers[], Error>({
    queryKey: [key + "-buyers", user?.id],
    queryFn: () => getPerformanceApiInfo().findBuyers(user?.id ?? ""),
    enabled: !!user?.id,
  });

  return { data, isLoading, error: error?.message };
};

export const findRevenue = (startAt: number, endAt: number) => {
  const user = setUser((v) => v.user);

  const { data, isLoading, error } = useQuery<number, Error>({
    queryKey: [key + "-revenue", user?.id, startAt, endAt],
    queryFn: () =>
      getPerformanceApiInfo().findRevenue(user?.id ?? "", startAt, endAt),
    enabled: !!user?.id && !!startAt && !!endAt,
  });

  return { data, isLoading, error: error?.message };
};

export const findOrderCount = () => {
  const user = setUser((v) => v.user);

  const { data, isLoading, error } = useQuery<number, Error>({
    queryKey: [key + "-order", user?.id],
    queryFn: () => getPerformanceApiInfo().findOrderCount(user?.id ?? ""),
    enabled: !!user?.id,
  });

  return { data, isLoading, error: error?.message };
};

export const findRevenueSales = (r: StartEndAt) => {
  const data = useQuery<number, Error>({
    queryKey: ["revenue-sales", r],
    queryFn: () => getPerformanceApiInfo().findRevenueSales(r),
    enabled: !!r.startAt && !!r.endAt,
  });

  return { data, isLoading: data.isLoading, error: data.error?.message };
};

export const findOrderCountSales = (r: StartEndAt) => {
  const data = useQuery<number, Error>({
    queryKey: ["order-count-sales", r],
    queryFn: () => getPerformanceApiInfo().findOrderCountSales(r),
    enabled: !!r.startAt && !!r.endAt,
  });

  return { data, isLoading: data.isLoading, error: data.error?.message };
};

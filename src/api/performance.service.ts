import queryString from "query-string";
import { req } from "./request";
import { setUser } from "src/stores/auth";
import { setHoursEpochTime } from "src/helpers";
import { useQuery } from "@tanstack/react-query";

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
}

interface ApiPerformanceInfo {
  findRevenue(
    merchantId: string,
    startAt?: number,
    endAt?: number
  ): Promise<number>;
  findOrderCount(merchantId: string): Promise<number>;
}

function getPerformanceApiInfo(): ApiPerformanceInfo {
  return Api.getInstance();
}

const key = "performance";

export const findRevenue = () => {
  const user = setUser((v) => v.user);
  const startAt = setHoursEpochTime(12, 1);
  const endAt = setHoursEpochTime(23, 59);

  const { data, isLoading, error } = useQuery<number, Error>({
    queryKey: [key, "buyers", user?.id, startAt, endAt],
    queryFn: () =>
      getPerformanceApiInfo().findRevenue(user?.id ?? "", startAt, endAt),
    enabled: !!user?.id && !!startAt && !!endAt,
  });

  return { data, isLoading, error: error?.message };
};

export const findOrderCount = () => {
  const user = setUser((v) => v.user);

  const { data, isLoading, error } = useQuery<number, Error>({
    queryKey: [key, "buyers", user?.id],
    queryFn: () => getPerformanceApiInfo().findOrderCount(user?.id ?? ""),
    enabled: !!user?.id,
  });

  return { data, isLoading, error: error?.message };
};

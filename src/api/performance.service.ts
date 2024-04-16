import queryString from "query-string";
import { req } from "./request";
import { setUser } from "src/stores/auth";
import { dateToEpochConvert, epochToDateConvert } from "src/helpers";

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
      path: `${this.path}?${query}`,
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
}

function getPerformanceApiInfo(): ApiPerformanceInfo {
  return Api.getInstance();
}

export const findBuyers = () => {
  const user = setUser((v) => v.user);
  const now = new Date();
};

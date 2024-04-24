import queryString from "query-string";
import { req } from "./request";
import { useQuery } from "@tanstack/react-query";

export interface Channel {
  channel_code: string;
  channel_category: string;
  currency: string;
  channel_name: string;
  amount_limits: AmountLimits;
}

export interface AmountLimits {
  minimum: number;
  maximum: number;
  minimum_increment: number;
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

  private path = "channel";

  async findWithdraw(channelCategory: string): Promise<Channel[]> {
    const query = queryString.stringify(
      { channelCategory },
      { skipEmptyString: true, skipNull: true }
    );

    return await req<Channel[]>({
      method: "GET",
      isNoAuth: false,
      path: `${this.path}/withdraw?${query}`,
      errors: "",
    });
  }
}

interface ApiCategoryInfo {
  findWithdraw(channelCategory: string): Promise<Channel[]>;
}

export function getChannelApiInfo(): ApiCategoryInfo {
  return Api.getInstance();
}

const key = "channel";

export const findWithdraw = (channelCategory: string) => {
  const { data, isLoading, error } = useQuery<Channel[], Error>({
    queryKey: [key],
    queryFn: () => getChannelApiInfo().findWithdraw(channelCategory),
    enabled: !!channelCategory,
  });

  return { data, isLoading, error: error?.message };
};

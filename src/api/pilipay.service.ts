import queryString from "query-string";
import { req } from "./request";
import { useQuery } from "@tanstack/react-query";

interface Pilipay {
  id: string;
  userId: string;
  active: boolean;
  balance: number;
  history: History[];
  createdAt: number;
  updatedAt: number;
}

interface History {
  id: string;
  walletId: string;
  amount: number;
  isCredit: boolean;
  status: string;
  description: string;
  transactionId: string;
  topupRequestId: string;
  withdrawRequestId: string;
  createdAt: number;
  successAt: number;
  failedAt: number;
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

  private path = "pilipay";

  async findMeWallet(showHistory: boolean): Promise<Pilipay> {
    const query = queryString.stringify(
      { showHistory },
      { skipNull: true, skipEmptyString: true }
    );

    return await req<Pilipay>({
      method: "GET",
      isNoAuth: false,
      path: `${this.path}/me?${query}`,
      errors: "",
    });
  }
}

interface ApiPilipayInfo {
  findMeWallet(showHistory: boolean): Promise<Pilipay>;
}

function getPilipayApiInfo(): ApiPilipayInfo {
  return Api.getInstance();
}

const key = "pilipay";

export const usePilipay = () => {
  const findMeWallet = (showHistory: boolean) => {
    return useQuery<Pilipay, Error>({
      queryKey: [key],
      queryFn: async () => await getPilipayApiInfo().findMeWallet(showHistory),
    });
  };

  return { findMeWallet };
};

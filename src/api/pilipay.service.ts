import queryString from "query-string";
import { req } from "./request";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

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

interface Activated {
  lat: number;
  lng: number;
  otp: string;
  otpId: string;
  pin: string;
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

  async activated(r: Activated): Promise<Pilipay> {
    return await req<Pilipay>({
      method: "POST",
      isNoAuth: false,
      path: `${this.path}/activated`,
      errors: "",
      body: r,
    });
  }
}

interface ApiPilipayInfo {
  findMeWallet(showHistory: boolean): Promise<Pilipay>;
  activated(r: Activated): Promise<Pilipay>;
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
      enabled: !!showHistory,
    });
  };

  const activated = useMutation<Pilipay, Error, { data: Activated }>({
    mutationKey: [key],
    mutationFn: async (r) => await getPilipayApiInfo().activated(r.data),
    onSuccess: () => {
      toast.success("Akun berhasil diaktifkan");
    },
    onError: (e) => toast.error(e.message),
  });

  return { findMeWallet, activated };
};

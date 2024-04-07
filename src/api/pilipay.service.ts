/* eslint-disable react-hooks/rules-of-hooks */
import queryString from "query-string";
import { req } from "./request";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getApiTransactionInfo, ITransaction } from "./transaction.service";

export interface Pilipay {
  id: string;
  userId: string;
  active: boolean;
  balance: number;
  history: History[];
  createdAt: number;
  updatedAt: number;
}

export interface History {
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

export interface Activated {
  lat: number;
  lng: number;
  otp: string;
  otpId: string;
  pin: string;
}

export interface PayoutChannels {
  paymentMethod: string;
  paymentChannel: string;
  name: string;
  imageUrl: string;
  isAvailable: boolean;
  amountLimit: AmountLimit;
}

export interface AmountLimit {
  minimum: number;
  maximum: number;
}

export interface ITopup {
  amount: number;
  paymentType: string;
  paymentMethod: string;
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
  private pathPaymentChannel = "channel";

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

  async findPaymentChannel(): Promise<PayoutChannels[]> {
    return await req<PayoutChannels[]>({
      method: "GET",
      isNoAuth: false,
      path: `${this.pathPaymentChannel}/payment`,
      errors: "",
    });
  }

  async topup(r: ITopup): Promise<ITransaction> {
    const reqTopup = await req<{ data: string; code: number; errors: string }>({
      method: "POST",
      isNoAuth: false,
      path: `${this.path}/topup`,
      errors: "",
      body: r,
    });

    const findTransactionTopup = await getApiTransactionInfo().findTransaction({
      topupId: reqTopup.data,
    });

    return findTransactionTopup;
  }
}

interface ApiPilipayInfo {
  findMeWallet(showHistory: boolean): Promise<Pilipay>;
  activated(r: Activated): Promise<Pilipay>;
  findPaymentChannel(): Promise<PayoutChannels[]>;
  topup(r: ITopup): Promise<ITransaction>;
}

function getPilipayApiInfo(): ApiPilipayInfo {
  return Api.getInstance();
}

export const findPaymentChannel = () => {
  const data = useQuery<PayoutChannels[], Error>({
    queryKey: ["payment-channel"],
    queryFn: async () => await getPilipayApiInfo().findPaymentChannel(),
  });

  return {
    data: data.data,
    isLoading: data.isLoading,
    error: data?.error,
  };
};

export const findMeWallet = (showHistory: boolean) => {
  const data = useQuery<Pilipay, Error>({
    queryKey: [key],
    queryFn: async () => await getPilipayApiInfo().findMeWallet(showHistory),
    enabled: !!showHistory,
  });

  return {
    data: data.data,
    isLoading: data.isLoading,
    error: data?.error,
  };
};

const key = "pilipay";

export const usePilipay = () => {
  const activated = useMutation<Pilipay, Error, Activated>({
    mutationKey: [key],
    mutationFn: async (r) => await getPilipayApiInfo().activated(r),
    onSuccess: () => {
      toast.success("Pilipay berhasil diaktifkan");
    },
    onError: (e) => {
      toast.error("Gagal mengaktifkan pilipay");
      console.log(e);
    },
  });

  const topup = useMutation<ITransaction, Error, ITopup>({
    mutationKey: [key],
    mutationFn: async (r) => await getPilipayApiInfo().topup(r),
    onSuccess: async () => {
      toast.success("Silahkan melakukan pembayaran");
    },
    onError: (e) => {
      toast.error("Gagal topup pilipay");
      console.log(e);
    },
  });

  return { activated, topup };
};

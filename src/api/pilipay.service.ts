/* eslint-disable react-hooks/rules-of-hooks */
import queryString from "query-string";
import { req } from "./request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export enum ETypeHistoryPilipay {
  TOPUP = "Top Up",
  WITHDRAW = "Withdraw",
  TRANSFER = "Transfer",
  ORDER = "Order",
}

export interface Pilipay {
  id: string;
  userId: string;
  active: boolean;
  balance: number;
  history: HistoryPilipay[];
  createdAt: number;
  updatedAt: number;
}

export interface HistoryPilipay {
  id: string;
  walletId: string;
  amount: number;
  isCredit: boolean;
  status: string;
  description: string;
  orderId: string | null;
  transactionId: string | null;
  topupRequestId: string | null;
  withdrawRequestId: string | null;
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

export interface ITransferBalance {
  amount: number;
  toPhoneNumber: string;
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

  async topup(r: ITopup): Promise<string> {
    return await req<string>({
      method: "POST",
      isNoAuth: false,
      path: `${this.path}/topup`,
      errors: "",
      body: r,
    });
  }

  async transferBalance(r: ITransferBalance): Promise<Pilipay> {
    return await req<Pilipay>({
      method: "POST",
      isNoAuth: false,
      path: `${this.path}/transfer-balance`,
      body: r,
      errors: "",
    });
  }
}

interface ApiPilipayInfo {
  findMeWallet(showHistory: boolean): Promise<Pilipay>;
  activated(r: Activated): Promise<Pilipay>;
  findPaymentChannel(): Promise<PayoutChannels[]>;
  topup(r: ITopup): Promise<string>;
  transferBalance(r: ITransferBalance): Promise<Pilipay>;
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

const key = "pilipay";

export const findMeWallet = (showHistory: boolean) => {
  const data = useQuery<Pilipay, Error>({
    queryKey: [key],
    queryFn: async () => await getPilipayApiInfo().findMeWallet(showHistory),
  });

  return {
    data: data.data,
    isLoading: data.isLoading,
    error: data?.error,
  };
};

export const transferBalance = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    Pilipay,
    Error,
    ITransferBalance
  >({
    mutationKey: ["transfer-balance"],
    mutationFn: (r) => getPilipayApiInfo().transferBalance(r),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: [key] }),
  });

  return { mutateAsync, isPending };
};

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

  const topup = useMutation<string, Error, ITopup>({
    mutationKey: [key],
    mutationFn: (r) => getPilipayApiInfo().topup(r),
  });

  return { activated, topup };
};

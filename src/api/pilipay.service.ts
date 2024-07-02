/* eslint-disable react-hooks/rules-of-hooks */
import queryString from "query-string";
import { req } from "./request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ReqPaging, ResPaging } from "src/interface";
import React from "react";

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

export interface IWithdraw {
  amount: number;
  pin: string;
  number: string;
  channelCode: string;
  channelCategory: string;
  accountHolderName: string;
}

export interface ITransaction {
  id: string;
  pilipayId: string;
  status: string;
  type: string;
  amount: number;
  createdAt: number;
  updatedAt: number;
  successAt: number;
  failedAt: number;
  topup?: ITopupTransaction;
  withdraw?: IWithdrawTransaction;
  transfer?: ITransfer;
  orders?: IOrders;
}

export interface IOrders {
  id: string;
  orderId: string;
  amount: number;
  type: string;
}

export interface ITopupTransaction {
  id: string;
  actions: Actions;
  paymentType: string;
  paymentMethod: string;
}

export interface Actions {
  retail: Retail;
  virtualAccount: VirtualAccount;
  eWallet: EWallet;
}

export interface EWallet {
  action: string;
  urlType: string;
  method: string;
  url: string;
  qrCode: string;
}

export interface Retail {
  amount: number;
  currency: string;
  channelCode: string;
  channelProperties: RetailChannelProperties;
}

export interface RetailChannelProperties {
  paymentCode: string;
  customerName: string;
  expiresAt: Date;
}

export interface VirtualAccount {
  amount: number;
  currency: string;
  channelCode: string;
  channelProperties: VirtualAccountChannelProperties;
  metadata: Metadata;
}

export interface VirtualAccountChannelProperties {
  customerName: string;
  virtualAccountNumber: string;
  expiresAt: Date;
}

export interface Metadata {
  additionalProp1: string;
  additionalProp2: string;
  additionalProp3: string;
}

export interface ITransfer {
  id: string;
  toPhoneNumber: string;
}

export interface IWithdrawTransaction {
  id: string;
  channelCode: string;
  numberAccount: string;
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

  async withdraw(r: IWithdraw): Promise<Pilipay> {
    return await req<Pilipay>({
      method: "POST",
      isNoAuth: false,
      path: `${this.path}/withdraw`,
      body: r,
      errors: "",
    });
  }

  async transactions(
    typeTransactions: string,
    r: ReqPaging
  ): Promise<ResPaging<ITransaction>> {
    const query = queryString.stringify(
      {
        page: r.page,
        limit: r.limit,
        typeTransactions,
      },
      { skipEmptyString: true, skipNull: true }
    );

    return await req<ResPaging<ITransaction>>({
      method: "GET",
      isNoAuth: false,
      path: `${this.path}/transactions?${query}`,
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
  withdraw(r: IWithdraw): Promise<Pilipay>;
  transactions(
    typeTransactions: string,
    r: ReqPaging
  ): Promise<ResPaging<ITransaction>>;
}

function getPilipayApiInfo(): ApiPilipayInfo {
  return Api.getInstance();
}

export const getPilipayTransactions = (typeTransactions: string) => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  const data = useQuery<ResPaging<ITransaction>, Error>({
    queryKey: ["pilipay-transaction", page, limit, typeTransactions],
    queryFn: () =>
      getPilipayApiInfo().transactions(typeTransactions, { limit, page }),
    enabled: !!typeTransactions,
  });

  return {
    data: data.data,
    isLoading: data.isLoading,
    error: data.error?.message,
    limit,
    page,
    setPage,
    setLimit,
    isNext: data.data?.canNext,
  };
};

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

export const createWithdraw = () => {
  const { mutateAsync, isPending } = useMutation<Pilipay, Error, IWithdraw>({
    mutationKey: ["create-withdraw"],
    mutationFn: (r) => getPilipayApiInfo().withdraw(r),
  });

  return { mutateAsync, isPending };
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

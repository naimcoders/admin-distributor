/* eslint-disable react-hooks/rules-of-hooks */
import queryString from "query-string";
import { req } from "./request";
import { useQuery } from "@tanstack/react-query";

export interface ITransaction {
  id: string;
  userId: string;
  paymentRequestId: string;
  topupRequestId: string;
  amount: number;
  paymentType: string;
  paymentMethod: string;
  status: string;
  statusPaymentMethod: string;
  isCredit: boolean;
  orderId: string;
  typeTransaction: string;
  actions: Actions;
  history: History[];
  createdAt: number;
  updatedAt: number;
  expiredAt: number;
}

export interface Actions {
  transactionId: string;
  retail: Retail;
  virtualAccount: VirtualAccount;
  eWallet: EWallet;
  payLater: PayLater;
  idempotencyKey: string;
  createdAt: number;
}

export interface EWallet {
  action: string;
  urlType: string;
  method: string;
  url: string;
  qrCode: string;
}

export interface PayLater {
  desktopWebCheckoutURL: string;
  mobileWebCheckoutURL: string;
  mobileDeeplinkCheckoutURL: string;
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
}

export interface VirtualAccountChannelProperties {
  expiresAt: Date;
  customerName: string;
  virtualAccountNumber: string;
}

export interface History {
  id: string;
  paymentId: string;
  transactionId: string;
  status: string;
  createdAt: number;
}

export interface IQueryTransaction {
  transactionId?: string;
  topupId?: string;
  orderId?: string;
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

  private path = "transaction";

  async findTransaction(q: IQueryTransaction): Promise<ITransaction> {
    const query = queryString.stringify(
      { ...q },
      { skipNull: true, skipEmptyString: true }
    );

    return await req<ITransaction>({
      method: "GET",
      isNoAuth: false,
      path: `${this.path}?${query}`,
      errors: "",
    });
  }
}

interface ApiTransactionInfo {
  findTransaction(q: IQueryTransaction): Promise<ITransaction>;
}

export function getApiTransactionInfo(): ApiTransactionInfo {
  return Api.getInstance();
}

const key = "transaction";

export const findTransaction = (q: IQueryTransaction) => {
  const data = useQuery<ITransaction, Error>({
    queryKey: [key],
    queryFn: async () => await getApiTransactionInfo().findTransaction(q),
  });

  return {
    data: data.data,
    isLoading: data.isLoading,
    error: data?.error,
  };
};

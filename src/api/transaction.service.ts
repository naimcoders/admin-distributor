/* eslint-disable react-hooks/rules-of-hooks */
import queryString from "query-string";
import { req } from "./request";
import { useQuery } from "@tanstack/react-query";

export enum EITransactionStatus {
  SUCCESS = "SUCCESS",
  PENDING = "PENDING",
  FAILED = "FAILED",
}

export interface ITransaction {
  id: string;
  userId: string;
  paymentRequestId: string;
  topupRequestId: string;
  amount: number;
  paymentType: string;
  paymentMethod: string;
  status: EITransactionStatus;
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
  retail: Retail | null;
  virtualAccount: VirtualAccount | null;
  eWallet: EWallet | null;
  payLater: PayLater | null;
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
  channel_code: string;
  channel_properties: RetailChannelProperties;
}

export interface RetailChannelProperties {
  payment_code: string;
  customer_name: string;
  expires_at: Date;
}

export interface VirtualAccount {
  amount: number;
  currency: string;
  channel_code: string;
  channel_properties: VirtualAccountChannelProperties;
}

export interface VirtualAccountChannelProperties {
  expires_at: Date;
  customer_name: string;
  virtual_account_number: string;
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
      {
        transactionId: q.transactionId,
        topupId: q.topupId,
        orderId: q.orderId,
      },
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
    queryKey: [key, q],
    queryFn: () => getApiTransactionInfo().findTransaction(q),
  });

  return {
    data: data.data,
    isLoading: data.isLoading,
    error: data?.error,
  };
};

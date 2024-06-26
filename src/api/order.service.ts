import queryString from "query-string";
import { req } from "./request";
import { ReqPaging, ResPaging } from "src/interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";

export interface Order {
  id: string;
  customerId: string;
  customer: Customer;
  merchantId: string;
  merchant: Customer;
  invoice: Invoice;
  note: string;
  pin: string;
  receiptUrl: string;
  status: string;
  price: Price;
  promo: Promo;
  delivery: Delivery;
  items: Item[];
  idempotencyKey: string;
  createdAt: number;
  updatedAt: number;
}

export interface Invoice {
  id: string;
  orderId: string;
  customerId: string;
  status: string;
  merchantId: string;
  invoiceNumber: string;
  discount: number;
  totalAmount: number;
  totalPrice: number;
  pilipay: boolean;
  paymentType: string;
  paymentMethod: string;
  createdAt: number;
  successAt: number;
  failedAt: number;
  updatedAt: number;
  expiredAt: number;
}

export interface Customer {
  id: string;
  address: string;
  customerId?: string;
  name: string;
  phoneNumber: string;
  email: string;
  courierId?: string;
  merchantId?: string;
  lat?: number;
  lng?: number;
}

export interface Delivery {
  id: string;
  orderId: string;
  courierId: string;
  courier: Customer;
  status: string;
  price: number;
  distance: number;
  note: string;
  history: History[];
  successAt: number;
  failedAt: number;
  createdAt: number;
  updatedAt: number;
}

export interface History {
  courierId: string;
  note: string;
  status: string;
  createdAt: number;
}

export interface Item {
  id: string;
  note: string;
  qty: number;
  orderId: string;
  productId: string;
  product: Product;
  category: Category;
  price: number;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  imageUrl: string[];
  rate: number;
  description: string;
  categoryProductId: string;
  categoryProduct: CategoryProduct;
  subCategoryProductId: string;
  subCategoryProduct: SubCategory;
  deliveryPrice: DeliveryPrice;
  price: ProductPrice;
  wishlist: number;
  variantProduct: VariantProduct[];
  role: string;
}

export interface CategoryProduct {
  id: string;
  userId: string;
  categoryId: string;
  category: Category;
  subCategory: SubCategory[];
}

export interface SubCategory {
  id: string;
  categoryProductId: string;
  name: string;
}

export interface DeliveryPrice {
  id: string;
  productId: string;
  weight: number;
  wide: number;
  height: number;
  length: number;
  isCourierInternal: boolean;
  price: number;
}

export interface ProductPrice {
  id: string;
  productId: string;
  price: number;
  priceDiscount: number;
  fee: number;
  startAt: number;
  expiredAt: number;
}

export interface VariantProduct {
  id: string;
  name: string;
  imageUrl: string;
  productId: string;
  price: number;
  variantColorProduct: VariantColorProduct[];
}

export interface VariantColorProduct {
  id: string;
  variantProductId: string;
  price: number;
  name: string;
  imageUrl: string;
}

export interface Price {
  deliveryPrice: number;
  discount: number;
  feeApp: number;
  totalPriceItems: number;
  totalPrice: number;
}

export interface Promo {
  id: string;
  promoType: string;
  categoryId: string;
  startAt: number;
  endAt: number;
  discount: number;
  createdAt: number;
  updatedAt: number;
}

export type ReqStatusOrder =
  | "PENDING"
  | "WAITING_ACCEPT"
  | "ACCEPT"
  | "ITEM_READY"
  | "VERIFY_PIN"
  | "DELIVERY"
  | "COMPLETE"
  | "REJECT";

class Api {
  private static instance: Api;
  private constructor() {}
  public static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance;
  }

  private path = "order";

  async find(
    r: ReqPaging,
    status: ReqStatusOrder,
    merchantId: string,
    customerId?: string
  ): Promise<ResPaging<Order>> {
    const query = queryString.stringify({
      page: r.page,
      limit: r.limit,
      status,
      merchantId,
      customerId,
    });

    return await req<ResPaging<Order>>({
      method: "GET",
      isNoAuth: false,
      path: `${this.path}?${query}`,
      errors: "",
    });
  }

  async findById(orderId: string): Promise<Order> {
    return await req<Order>({
      method: "GET",
      isNoAuth: false,
      path: `${this.path}/${orderId}`,
      errors: "",
    });
  }

  async accept(orderId: string): Promise<string> {
    return await req<string>({
      method: "PUT",
      isNoAuth: false,
      path: `${this.path}/${orderId}/accept`,
      errors: "",
    });
  }

  async itemReady(orderId: string): Promise<string> {
    return await req<string>({
      method: "PUT",
      isNoAuth: false,
      path: `${this.path}/${orderId}/item-ready`,
      errors: "",
    });
  }

  async reject(orderId: string): Promise<string> {
    return await req<string>({
      method: "PUT",
      isNoAuth: false,
      path: `${this.path}/${orderId}/reject`,
      errors: "",
    });
  }

  async countOrder(merchantId: string, status: string): Promise<number> {
    const query = queryString.stringify(
      { merchantId, status },
      { skipEmptyString: true, skipNull: true }
    );

    return await req<number>({
      method: "GET",
      isNoAuth: false,
      path: `${this.path}/count?${query}`,
      errors: "",
    });
  }
}

interface ApiOrderInfo {
  find(
    r: ReqPaging,
    status: ReqStatusOrder,
    merchantId: string,
    customerId?: string
  ): Promise<ResPaging<Order>>;
  findById(orderId: string): Promise<Order>;
  accept(orderId: string): Promise<string>;
  itemReady(orderId: string): Promise<string>;
  reject(orderId: string): Promise<string>;
  countOrder(merchantId: string, status: string): Promise<number>;
}

function getOrderApiInfo(): ApiOrderInfo {
  return Api.getInstance();
}

const key = "order";

export const countOrder = (merchantId: string, status: string) => {
  const data = useQuery<number, Error>({
    queryKey: [key, merchantId, status],
    queryFn: () => getOrderApiInfo().countOrder(merchantId, status),
    enabled: !!merchantId && !!status,
  });

  return {
    data: data.data,
    isLoading: data.isLoading,
    error: data.error?.message,
  };
};

export const findOrders = (
  statusOrder: ReqStatusOrder,
  merchantId: string,
  customerId?: string
) => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [search, setSearch] = React.useState("");

  const byPaging = () =>
    getOrderApiInfo().find(
      {
        limit,
        page,
        search,
      },
      statusOrder,
      merchantId,
      customerId
    );

  const { data, error, isLoading } = useQuery<ResPaging<Order>, Error>({
    queryKey: [key, page, limit, search, statusOrder, customerId, merchantId],
    queryFn: byPaging,
    enabled: !!statusOrder,
  });

  return {
    data,
    isLoading,
    error: error?.message,
    page,
    limit,
    search,
    setPage,
    setLimit,
    setSearch,
    isNext: data?.canNext,
  };
};

export const findOrderById = (orderId: string) => {
  const get = () => getOrderApiInfo().findById(orderId);
  const { data, isLoading, error } = useQuery<Order, Error>({
    queryKey: [key, orderId],
    queryFn: get,
    enabled: !!orderId,
  });

  return { data, isLoading, error: error?.message };
};

export const acceptOrder = (orderId: string) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation<string, Error>({
    mutationKey: ["accept-order", orderId],
    mutationFn: () => getOrderApiInfo().accept(orderId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [key, orderId] });
    },
  });

  return { mutateAsync, isPending };
};

export const itemReadyOrder = (orderId: string) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation<string, Error>({
    mutationKey: ["item-ready-order", orderId],
    mutationFn: () => getOrderApiInfo().itemReady(orderId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [key, orderId] });
    },
  });

  return { mutateAsync, isPending };
};

export const rejectOrder = (orderId: string) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation<string, Error>({
    mutationKey: ["reject-order", orderId],
    mutationFn: () => getOrderApiInfo().reject(orderId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [key, orderId] });
    },
  });

  return { mutateAsync, isPending };
};

import queryString from "query-string";
import { req } from "./request";
import { ReqPaging } from "src/interface";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export interface Order {
  id: string;
  customerId: string;
  customer: Customer;
  merchantId: string;
  merchant: Customer;
  note: string;
  pin: string;
  receiptUrl: string;
  status: string;
  price: WelcomePrice;
  promo: Promo;
  delivery: Delivery;
  items: Item[];
  idempotencyKey: string;
  createdAt: number;
  updatedAt: number;
}

export interface Customer {
  id: string;
  customerId?: string;
  name: string;
  phoneNumber: string;
  email: string;
  courierId?: string;
  merchantId?: string;
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

export interface WelcomePrice {
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

type ReqStatusOrder =
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

  private path = "api/v1/order";

  async find(
    r: ReqPaging,
    status: ReqStatusOrder,
    customerId?: string,
    merchantId?: string
  ): Promise<Order> {
    const query = queryString.stringify({
      page: r.page,
      limit: r.limit,
      status,
      customerId,
      merchantId,
    });

    return await req<Order>({
      method: "GET",
      isNoAuth: false,
      path: `${this.path}?${query}`,
      errors: "",
    });
  }
}

interface ApiOrderInfo {
  find(
    r: ReqPaging,
    status: ReqStatusOrder,
    customerId?: string,
    merchantId?: string
  ): Promise<Order>;
}

function getOrderApiInfo(): ApiOrderInfo {
  return Api.getInstance();
}

const key = "order";

export const findOrders = (
  statusOrder: ReqStatusOrder,
  customerId?: string,
  merchantId?: string
) => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [search, setSearch] = React.useState("");

  const byPaging = async () =>
    await getOrderApiInfo().find(
      {
        limit,
        page,
        search,
      },
      statusOrder,
      customerId,
      merchantId
    );

  const { data, error, isLoading } = useQuery<Order, Error>({
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
  };
};

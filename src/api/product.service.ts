/* eslint-disable react-hooks/rules-of-hooks */
import queryString from "query-string";
import { ReqPaging, ResPaging } from "src/interface";
import { req } from "./request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { setUser } from "src/stores/auth";

export interface Product {
  categoryProduct: CategoryProduct;
  categoryProductId: string;
  subCategoryProductId: string;
  subCategoryProduct: SubCategoryProduct;
  createdAt: number;
  deliveryPrice: DeliveryPrice;
  description: string;
  id: string;
  imageUrl: string[];
  isAvailable: boolean;
  isDangerous: boolean;
  isPrimary: boolean;
  name: string;
  price: Price;
  rate: number;
  updatedAt: number;
  user: User;
  userId: string;
  variantProduct: VariantProduct[];
  wishlist: number;
  yourWishlist: boolean;
  isAccept: boolean;
}

export interface CategoryProduct {
  category: SubCategoryProduct;
  createdAt: number;
  id: string;
  subCategory: SubCategoryProduct[];
  updatedAt: number;
  userId: string;
}

export interface SubCategoryProduct {
  createdAt: number;
  id: string;
  isActive?: boolean;
  name: string;
  updatedAt: number;
  categoryProductId?: string;
}

export interface DeliveryPrice {
  id: string;
  weight: number;
  wide: number;
  height: number;
  length: number;
  isCourierInternal: boolean;
  price: number;
}

export interface ImageURL {}

export interface Price {
  id: string;
  price: number;
  priceDiscount: number;
  fee: number;
  startAt: number;
  expiredAt: number;
}

export interface User {
  bank: Bank;
  courier: Courier;
  customer: Customer;
  distributor: Distributor;
  email: string;
  id: string;
  location: Location[];
  store: Distributor;
  wallet: Wallet;
}

export interface Bank {
  accountName: string;
  accountNumber: string;
  bankName: string;
  createdAt: number;
  id: string;
  updatedAt: number;
  userId: string;
}

export interface Courier {
  courierInternal: CourierInternal;
  createdAt: number;
  details: string;
  document: ImageURL;
  email: string;
  emailVerify: boolean;
  fcmToken: string;
  id: string;
  imageUrl: string;
  isActive: boolean;
  isCourierInternal: boolean;
  isSuspend: boolean;
  name: string;
  phoneNumber: string;
  rate: number;
  updatedAt: number;
  vehicle: ImageURL;
}

export interface CourierInternal {
  courier: string;
  courierId: string;
  createdAt: number;
  distributor: Distributor;
  distributorId: string;
  id: string;
  store: Distributor;
  storeId: string;
  updatedAt: number;
}

export interface Distributor {
  banner: string;
  createdAt: number;
  details: string;
  documents?: Documents;
  email: string;
  emailVerify: boolean;
  fcmToken: string;
  id: string;
  imageUrl: string;
  isSuspend: boolean;
  isVerify: boolean;
  name?: string;
  ownerName: string;
  phoneNumber: string;
  rate: number;
  updatedAt: number;
  isOpen?: boolean;
  ktpImageUrl?: string;
  storeName?: string;
}

export interface Documents {
  ktpImage: string;
}

export interface Customer {
  createdAt: number;
  dateBirth: string;
  details: string;
  email: string;
  emailVerify: boolean;
  fcmToken: string;
  gender: string;
  id: string;
  imageUrl: string;
  isSuspend: boolean;
  name: string;
  phoneNumber: string;
  updatedAt: number;
}

export interface Location {
  id: string;
  addressName: string;
  city: string;
  detailAddress: string;
  district: string;
  isPrimary: boolean;
  lat: number;
  lng: number;
  province: string;
  type: string;
  userId: string;
  zipCode: string;
}

export interface Wallet {
  active: boolean;
  balance: number;
  createdAt: number;
  history: History[];
  id: string;
  updatedAt: number;
  userId: string;
}

export interface History {
  amount: number;
  createdAt: number;
  description: string;
  id: string;
  isCredit: boolean;
  status: string;
  transactionId: string;
  walletId: string;
}

export interface VariantProduct {
  createdAt?: number;
  id?: string;
  imageUrl?: string;
  name: string;
  price?: number;
  productId?: string;
  updatedAt?: number;
  variantColorProduct: VariantColorProduct[];
}

export interface VariantColorProduct {
  createdAt?: number;
  id?: string;
  imageUrl?: string;
  name: string;
  price?: number;
  variantProductId?: string;
}

export interface CreateProduct {
  category: {
    categoryId: string;
  };
  deliveryPrice: DeliveryPrice;
  description: string;
  imageUrl?: string[];
  isDangerous?: boolean;
  name: string;
  subCategoryId: string;
  price: {
    id?: string;
    price: number;
    priceDiscount: number;
    fee: number;
    startAt: number;
    expiredAt: number;
  };
  variant: {
    imageUrl?: string;
    name: string;
    variantColorProduct: {
      name: string;
      id?: string;
      imageUrl?: string;
      price?: number;
    }[];
  }[];
  isAvailable: boolean;
  createForDistrbutorId?: string;
}

interface UpdateProduct extends Omit<CreateProduct, "imageUrl" | "variant"> {}
interface RemoveImage {
  imageUrl: string;
}

export interface ProductBestSelling {
  productId: string;
  productName: string;
  categoryName: string;
  orderCount: number;
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

  private path = "product";

  private errors: { [key: number]: string } = {
    400: "input tidak valid",
    401: "hak akses ditolak",
    403: "forbidden",
    404: "data tidak ditemukan",
    500: "server sedang bermasalah, silahkan coba beberapa saat lagi",
  };

  async find(userId: string, r: ReqPaging): Promise<ResPaging<Product>> {
    const query = queryString.stringify(
      {
        page: r.page,
        limit: r.limit,
        search: r.search,
        userId: userId,
      },
      { skipEmptyString: true, skipNull: true }
    );

    return await req<ResPaging<Product>>({
      method: "GET",
      isNoAuth: false,
      errors: this.errors,
      path: `${this.path}?${query}`,
    });
  }

  async findTotalProduct(userId: string): Promise<number> {
    return await req<number>({
      method: "GET",
      isNoAuth: false,
      errors: this.errors,
      path: `${this.path}/total?userId=${userId}`,
    });
  }

  async findById(productId: string): Promise<Product> {
    return await req<Product>({
      method: "GET",
      isNoAuth: false,
      errors: this.errors,
      path: `${this.path}/${productId}`,
    });
  }

  async create(r: CreateProduct): Promise<Product> {
    return await req<Product>({
      method: "POST",
      path: this.path,
      isNoAuth: false,
      errors: this.errors,
      body: r,
    });
  }

  async update(productId: string, r: UpdateProduct): Promise<Product> {
    return await req<Product>({
      method: "PUT",
      body: r,
      isNoAuth: false,
      errors: this.errors,
      path: `${this.path}/${productId}`,
    });
  }

  async removeImageUrl(productId: string, r: RemoveImage): Promise<void> {
    return await req<void>({
      method: "PATCH",
      body: r,
      isNoAuth: false,
      errors: this.errors,
      path: `${this.path}/${productId}`,
    });
  }

  async ProductBestSelling(userId: string): Promise<ProductBestSelling[]> {
    const query = queryString.stringify(
      { userId },
      { skipEmptyString: true, skipNull: true }
    );

    return await req<ProductBestSelling[]>({
      method: "GET",
      isNoAuth: false,
      path: `${this.path}/best-selling?${query}`,
      errors: this.errors,
    });
  }
}

interface ApiProductInfo {
  find(userId: string, r: ReqPaging): Promise<ResPaging<Product>>;
  findById(productId: string): Promise<Product>;
  create(r: CreateProduct): Promise<Product>;
  update(productId: string, r: UpdateProduct): Promise<Product>;
  removeImageUrl(productId: string, r: RemoveImage): Promise<void>;
  findTotalProduct(userId: string): Promise<number>;
  ProductBestSelling(userId: string): Promise<ProductBestSelling[]>;
}

export function getProductApiInfo(): ApiProductInfo {
  return Api.getInstance();
}

const key = "product";

export const productBestSelling = () => {
  const user = setUser((v) => v.user);

  const { data, isLoading, error } = useQuery<ProductBestSelling[], Error>({
    queryKey: [`${key}-best-selling`, user?.id],
    queryFn: () => getProductApiInfo().ProductBestSelling(user?.id ?? ""),
    enabled: !!user?.id,
  });

  return { data, isLoading, error: error?.message };
};

export const findtotalProduct = () => {
  const user = setUser((v) => v.user);
  const findTotalProduct = useQuery<number, Error>({
    queryKey: [key, "total", user?.id],
    queryFn: () => getProductApiInfo().findTotalProduct(user?.id ?? ""),
    enabled: !!user,
  });

  return {
    data: findTotalProduct?.data,
    isLoading: findTotalProduct?.isLoading,
    error: findTotalProduct?.error?.message,
  };
};

export const useProduct = (productId?: string) => {
  const queryClient = useQueryClient();

  const removeImageUrl = useMutation<void, Error, { data: RemoveImage }>({
    mutationKey: [key, "remove-image", productId],
    mutationFn: async (r) =>
      await getProductApiInfo().removeImageUrl(productId ?? "", r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [key, productId],
      });
    },
    onError: (e) => toast.error(e.message),
  });

  const update = useMutation<Product, Error, { data: UpdateProduct }>({
    mutationKey: [key, "update", productId],
    mutationFn: (r) => getProductApiInfo().update(productId ?? "", r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [key],
      });
    },
  });

  const create = useMutation<Product, Error, { data: CreateProduct }>({
    mutationKey: [key],
    mutationFn: (r) => getProductApiInfo().create(r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
    onError: (e) => toast.error(e.message),
  });

  const findById = useQuery<Product, Error>({
    queryKey: [key, productId],
    queryFn: () => getProductApiInfo().findById(productId ?? ""),
    enabled: !!productId,
  });

  const find = (userId: string, pageTable: number) => {
    const [page, setPage] = useState(pageTable);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");

    const byPaging = async () =>
      await getProductApiInfo().find(userId, {
        page,
        limit,
        search,
      });

    const { data, isLoading, error } = useQuery<ResPaging<Product>, Error>({
      queryKey: [key, page, limit, search, userId],
      queryFn: byPaging,
      enabled: !!userId,
    });

    return {
      data,
      isLoading,
      error: error?.message,
      page,
      limit,
      setLimit,
      setSearch,
      isNext: data?.canNext,
      setPage,
      search,
    };
  };

  return { find, findById, create, update, removeImageUrl };
};

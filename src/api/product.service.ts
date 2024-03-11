import queryString from "query-string";
import { ReqPaging, ResPaging } from "src/interface";
import { req } from "./request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

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
  price: number;
  priceDiscount: number;
  fee: number;
  startAt: null;
  expiredAt: null;
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
  createdAt: number;
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  productId: string;
  updatedAt: number;
  variantColorProduct: VariantColorProduct[];
}

export interface VariantColorProduct {
  createdAt: number;
  id: string;
  imageUrl: string;
  name: string;
  variantProductId: string;
}

interface CreateProduct {
  category: {
    categoryId: string;
  };
  deliveryPrice: DeliveryPrice;
  description: string;
  imageUrl: string[];
  isDangerous: boolean;
  name: string;
  price: {
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
      imageUrl?: string;
      price?: number;
    }[];
  }[];
}

interface UpdateProduct extends Omit<CreateProduct, "imageUrl" | "variant"> {}

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

  async find(r: ReqPaging): Promise<ResPaging<Product>> {
    const query = queryString.stringify(
      {
        page: r.page,
        limit: r.limit,
        search: r.search,
      },
      { skipEmptyString: true, skipNull: true }
    );

    return await req<ResPaging<Product>>({
      method: "GET",
      isNoAuth: false,
      errors: this.errors,
      path: `${this.path}/me?${query}`,
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
}

interface ApiProductInfo {
  find(r: ReqPaging): Promise<ResPaging<Product>>;
  findById(productId: string): Promise<Product>;
  create(r: CreateProduct): Promise<Product>;
  update(productId: string, r: UpdateProduct): Promise<Product>;
}

export function getProductApiInfo(): ApiProductInfo {
  return Api.getInstance();
}

const key = "product";

export const useProduct = () => {
  const queryClient = useQueryClient();

  const update = (productId: string) => {
    const mutate = useMutation<Product, Error, { data: UpdateProduct }>({
      mutationKey: [key, productId],
      mutationFn: async (r) =>
        await getProductApiInfo().update(productId, r.data),
      onSuccess: () => {
        toast.success("Produk berhasil diperbarui");
        void queryClient.invalidateQueries({ queryKey: [key] });
      },
      onError: (e) => toast.error(e.message),
    });
    return mutate;
  };

  const create = () => {
    const mutate = useMutation<Product, Error, { data: CreateProduct }>({
      mutationKey: [key],
      mutationFn: async (r) => await getProductApiInfo().create(r.data),
      onSuccess: () => {
        toast.success("Produk berhasil dibuat");
        void queryClient.invalidateQueries({ queryKey: [key] });
      },
      onError: (e) => toast.error(e.message),
    });
    return mutate;
  };

  const findById = (productId: string) => {
    const find = async () => getProductApiInfo().findById(productId);
    const { data, isLoading, error } = useQuery<Product, Error>({
      queryKey: [key, productId],
      queryFn: find,
      enabled: !!productId,
    });

    return { data, isLoading, error: error?.message };
  };

  const find = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");

    const byPaging = async () =>
      await getProductApiInfo().find({
        page,
        limit,
        search,
      });

    const { data, isLoading, error } = useQuery<ResPaging<Product>, Error>({
      queryKey: [key, page, limit, search],
      queryFn: byPaging,
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
    };
  };

  return { find, findById, create, update };
};

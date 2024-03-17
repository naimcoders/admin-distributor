import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { req } from "./request";
import { toast } from "react-toastify";

export interface SubCategoryProduct {
  categoryProductId: string;
  createdAt: number;
  id: string;
  name: string;
  updatedAt: number;
}

interface Create {
  name: string;
  categoryProductId: string;
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

  private path = "sub-category-product";

  private errors: { [key: number]: string } = {
    400: "input tidak valid",
    401: "hak akses ditolak",
    403: "forbidden",
    404: "data tidak ditemukan",
    500: "server sedang bermasalah, silahkan coba beberapa saat lagi",
  };

  async findById(categoryProductId: string): Promise<SubCategoryProduct[]> {
    return await req<SubCategoryProduct[]>({
      method: "GET",
      isNoAuth: false,
      path: `${this.path}/${categoryProductId}`,
      errors: this.errors,
    });
  }

  async create(r: Create): Promise<SubCategoryProduct> {
    return await req<SubCategoryProduct>({
      method: "POST",
      isNoAuth: false,
      body: r,
      path: this.path,
      errors: this.errors,
    });
  }
}

interface ApiSubCategoryProductInfo {
  findById(categoryProductId: string): Promise<SubCategoryProduct[]>;
  create(r: Create): Promise<SubCategoryProduct>;
}

function getSubCategoryProductApiInfo(): ApiSubCategoryProductInfo {
  return Api.getInstance();
}

const key = "sub-category-product";

export const useSubCategoryProduct = () => {
  const queryClient = useQueryClient();

  const findById = (categoryProductId: string) => {
    const { data, isLoading, error } = useQuery<SubCategoryProduct[], Error>({
      queryKey: [key, categoryProductId],
      queryFn: async () =>
        await getSubCategoryProductApiInfo().findById(categoryProductId),
    });
    return { data, isLoading, error: error?.message };
  };

  const create = (categoryProductId: string) => {
    const mutate = useMutation<SubCategoryProduct, Error, { data: Create }>({
      mutationKey: [key, categoryProductId],
      mutationFn: async (r) =>
        await getSubCategoryProductApiInfo().create(r.data),
      onSuccess: () => {
        toast.success("Sub-kategori berhasil dibuat");
        void queryClient.invalidateQueries({
          queryKey: [key, categoryProductId],
        });
      },
      onError: (e) => toast.error(e.message),
    });
    return mutate;
  };

  return { findById, create };
};

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

  async update(subCategoryId: string, r: Create): Promise<SubCategoryProduct> {
    return await req<SubCategoryProduct>({
      method: "PUT",
      isNoAuth: false,
      body: r,
      path: `${this.path}/${subCategoryId}`,
      errors: this.errors,
    });
  }

  async remove(subCategoryId: string): Promise<{}> {
    return await req<{}>({
      method: "DELETE",
      isNoAuth: false,
      path: `${this.path}/${subCategoryId}`,
      errors: this.errors,
    });
  }

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
  update(subCategoryId: string, r: Create): Promise<SubCategoryProduct>;
  remove(subCategoryId: string): Promise<{}>;
  findById(categoryProductId: string): Promise<SubCategoryProduct[]>;
  create(r: Create): Promise<SubCategoryProduct>;
}

function getSubCategoryProductApiInfo(): ApiSubCategoryProductInfo {
  return Api.getInstance();
}

const key = "sub-category-product";
const createKey = `${key}-create`;
const removeKey = `${key}-remove`;
const updateKey = `${key}-update`;

export const useSubCategoryProduct = (categoryProductId: string) => {
  const queryClient = useQueryClient();

  const update = useMutation<
    SubCategoryProduct,
    Error,
    { subCategoryId: string; data: Create }
  >({
    mutationKey: [updateKey, categoryProductId],
    mutationFn: async (r) =>
      await getSubCategoryProductApiInfo().update(r.subCategoryId, r.data),
    onSuccess: () => {
      toast.success("Sub-kategori berhasil diperbarui");
      void queryClient.invalidateQueries({
        queryKey: [key, categoryProductId],
      });
    },
    onError: (e) => toast.error(e.message),
  });

  const remove = useMutation<{}, Error, { subCategoryId: string }>({
    mutationKey: [removeKey, categoryProductId],
    mutationFn: async (r) =>
      await getSubCategoryProductApiInfo().remove(r.subCategoryId),
    onSuccess: () => {
      toast.success("Sub-kategori berhasil dihapus");
      void queryClient.invalidateQueries({
        queryKey: [key, categoryProductId],
      });
    },
    onError: (e) => toast.error(e.message),
  });

  const findById = useQuery<SubCategoryProduct[], Error>({
    queryKey: [key, categoryProductId],
    queryFn: async () =>
      await getSubCategoryProductApiInfo().findById(categoryProductId),
  });

  const create = useMutation<SubCategoryProduct, Error, { data: Create }>({
    mutationKey: [createKey, categoryProductId],
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

  return { update, remove, findById, create };
};

import { useQuery } from "@tanstack/react-query";
import { req } from "./request";

export interface Category {
  category: SubCategory;
  createdAt: number;
  id: string;
  subCategory: SubCategory[];
  updatedAt: number;
  userId: string;
}

export interface SubCategory {
  createdAt: number;
  id: string;
  isActive?: boolean;
  name: string;
  updatedAt: number;
  categoryId?: string;
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

  private path = "category";

  private errors: { [key: number]: string } = {
    400: "input tidak valid",
    401: "hak akses ditolak",
    403: "forbidden",
    404: "data tidak ditemukan",
    500: "server sedang bermasalah, silahkan coba beberapa saat lagi",
  };

  async find(): Promise<Category[]> {
    return await req<Category[]>({
      method: "GET",
      path: this.path,
      isNoAuth: false,
      errors: this.errors,
    });
  }
}

interface ApiCategoryInfo {
  find(): Promise<Category[]>;
}

export function getCategoryApiInfo(): ApiCategoryInfo {
  return Api.getInstance();
}

const key = "category";

export const useCategory = () => {
  const find = () => {
    const get = async () => await getCategoryApiInfo().find();
    const { data, isLoading, error } = useQuery<Category[], Error>({
      queryKey: [key],
      queryFn: get,
    });

    return {
      data,
      isLoading,
      error: error?.message,
    };
  };

  return { find };
};

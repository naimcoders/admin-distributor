import { useQuery } from "@tanstack/react-query";
import { req } from "./request";

export interface Category {
  createdAt: number;
  id: string;
  isActive?: boolean;
  name: string;
  updatedAt: number;
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

  async find(): Promise<Category[]> {
    return await req<Category[]>({
      method: "GET",
      path: this.path,
      isNoAuth: false,
      errors: "",
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

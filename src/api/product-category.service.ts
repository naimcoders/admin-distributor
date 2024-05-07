import { useQuery } from "@tanstack/react-query";
import { req } from "./request";
import queryString from "query-string";

export interface ProductCategory {
  category: Category;
  categoryId: string;
  createdAt: number;
  id: string;
  subCategory: Category[];
  updatedAt: number;
  userId: string;
}

interface Category {
  createdAt: number;
  id: string;
  isActive?: boolean;
  name: string;
  updatedAt: number;
  categoryProductId?: string;
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

  private path = "category-product";
  private subCategoryPath = "sub-category-product";

  async find(): Promise<ProductCategory[]> {
    return await req<ProductCategory[]>({
      method: "GET",
      isNoAuth: false,
      path: this.path,
      errors: "",
    });
  }

  async create(): Promise<ProductCategory[]> {
    return await req<ProductCategory[]>({
      method: "GET",
      path: this.path,
      isNoAuth: false,
      errors: "",
    });
  }

  async findSubCategoryByCategoryId(
    categoryProductId: string
  ): Promise<Category[]> {
    const query = queryString.stringify(
      { categoryProductId },
      { skipEmptyString: true, skipNull: true }
    );

    return await req<Category[]>({
      method: "GET",
      path: `${this.subCategoryPath}?${query}`,
      isNoAuth: false,
      errors: "",
    });
  }
}

interface ApiProductCategoryInfo {
  find(): Promise<ProductCategory[]>;
  findSubCategoryByCategoryId(categoryProductId: string): Promise<Category[]>;
}

export function getProductCategoryApiInfo(): ApiProductCategoryInfo {
  return Api.getInstance();
}

const key = "product-category";
const subProductCategoryKey = "sub-product-category";

export const findSubCategoryByCategoryId = (categoryProductId: string) => {
  const data = useQuery<Category[], Error>({
    queryKey: [subProductCategoryKey, categoryProductId],
    queryFn: () =>
      getProductCategoryApiInfo().findSubCategoryByCategoryId(
        categoryProductId
      ),
    enabled: !!categoryProductId,
  });
  return {
    data: data.data,
    isLoading: data.isLoading,
    error: data.error?.message,
  };
};

export const useProductCategory = () => {
  const find = () => {
    const get = async () => await getProductCategoryApiInfo().find();
    const { data, isLoading, error } = useQuery<ProductCategory[], Error>({
      queryKey: [key],
      queryFn: get,
    });
    return { data, isLoading, error: error?.message };
  };

  return { find };
};

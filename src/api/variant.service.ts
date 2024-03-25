import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VariantProduct } from "./product.service";
import { req } from "./request";
import { toast } from "react-toastify";

interface UpdateVariant extends VariantProduct {}
interface RemoveImage {
  imageUrl: string;
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

  private path = "variant";

  private errors: { [key: number]: string } = {
    400: "input tidak valid",
    401: "hak akses ditolak",
    403: "forbidden",
    404: "data tidak ditemukan",
    500: "server sedang bermasalah, silahkan coba beberapa saat lagi",
  };

  async create(r: VariantProduct): Promise<VariantProduct> {
    return await req<VariantProduct>({
      method: "POST",
      body: r,
      isNoAuth: false,
      errors: this.errors,
      path: this.path,
    });
  }

  async removeImage(variantId: string, r: RemoveImage): Promise<{}> {
    return await req<{}>({
      method: "PATCH",
      body: r,
      isNoAuth: false,
      errors: this.errors,
      path: `${this.path}/${variantId}`,
    });
  }

  async update(variantId: string, r: UpdateVariant): Promise<VariantProduct> {
    return await req<VariantProduct>({
      method: "PUT",
      body: r,
      isNoAuth: false,
      errors: this.errors,
      path: `${this.path}/${variantId}`,
    });
  }

  async remove(variantId: string): Promise<{}> {
    return await req<{}>({
      method: "DELETE",
      isNoAuth: false,
      errors: this.errors,
      path: `${this.path}/${variantId}`,
    });
  }

  async removeVariantColor(variantColorId: string): Promise<{}> {
    return await req<{}>({
      method: "DELETE",
      isNoAuth: false,
      errors: this.errors,
      path: `${this.path}/variant-color/${variantColorId}`,
    });
  }
}

interface ApiVariantInfo {
  update(variantId: string, r: UpdateVariant): Promise<VariantProduct>;
  remove(variantId: string): Promise<{}>;
  removeVariantColor(variantColorId: string): Promise<{}>;
  create(r: VariantProduct): Promise<VariantProduct>;
  removeImage(variantId: string, r: RemoveImage): Promise<{}>;
}

function getVariantApiInfo(): ApiVariantInfo {
  return Api.getInstance();
}

const key = "variant";

export const useVariant = (productId: string) => {
  const queryClient = useQueryClient();

  const create = useMutation<VariantProduct, Error, { data: VariantProduct }>({
    mutationKey: [key, "create", productId],
    mutationFn: async (r) => await getVariantApiInfo().create(r.data),
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: ["product", productId] }),
    onError: (e) => {
      toast.error(`Failed to create variant : ${e.message}`);
    },
  });

  const removeImage = useMutation<
    {},
    Error,
    { data: RemoveImage; variantId: string }
  >({
    mutationKey: [key, "remove-image", productId],
    mutationFn: async (r) =>
      await getVariantApiInfo().removeImage(r.variantId, r.data),
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: ["product", productId] }),
    onError: (e) => toast.error(`Failed to remove image : ${e.message}`),
  });

  const removeVariantColor = useMutation<{}, Error, { variantColorId: string }>(
    {
      mutationKey: [key, "remove-variant-color", productId],
      mutationFn: async (r) =>
        await getVariantApiInfo().removeVariantColor(r.variantColorId),
      onError: (e) =>
        toast.error(`Failed to remove variant color id : ${e.message}`),
    }
  );

  const remove = useMutation<{}, Error, { variantId: string }>({
    mutationKey: [key, "remove", productId],
    mutationFn: async (r) => await getVariantApiInfo().remove(r.variantId),
    onError: (e) => toast.error(`Failed to remove variant : ${e.message}`),
  });

  const update = useMutation<
    VariantProduct,
    Error,
    { data: VariantProduct; variantId: string }
  >({
    mutationKey: [key, "update", productId],
    mutationFn: async (r) =>
      await getVariantApiInfo().update(r.variantId, r.data),
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: ["product", productId] }),
    onError: (e) => toast.error(`Failed to update the variant : ${e.message}`),
  });

  return { update, remove, removeVariantColor, create, removeImage };
};

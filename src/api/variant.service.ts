import { useMutation } from "@tanstack/react-query";
import { VariantProduct } from "./product.service";
import { req } from "./request";
import { toast } from "react-toastify";

interface UpdateVariant extends VariantProduct {}

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
    return await req<VariantProduct>({
      method: "DELETE",
      isNoAuth: false,
      errors: this.errors,
      path: `${this.path}/${variantId}`,
    });
  }

  async removeVariantColor(
    variantId: string,
    variantColorId: string
  ): Promise<{}> {
    return await req<{}>({
      method: "DELETE",
      isNoAuth: false,
      errors: this.errors,
      path: `${this.path}/${variantId}/color/${variantColorId}`,
    });
  }
}

interface ApiVariantInfo {
  update(variantId: string, r: UpdateVariant): Promise<VariantProduct>;
  remove(variantId: string): Promise<{}>;
  removeVariantColor(variantId: string, variantColorId: string): Promise<{}>;
}

function getVariantApiInfo(): ApiVariantInfo {
  return Api.getInstance();
}

const key = "variant";

export const useVariant = () => {
  const removeVariantColor = (productId: string) => {
    const mutate = useMutation<
      {},
      Error,
      { variantId: string; variantColorId: string }
    >({
      mutationKey: [key, productId],
      mutationFn: async (r) =>
        await getVariantApiInfo().removeVariantColor(
          r.variantId,
          r.variantColorId
        ),
      onSuccess: () => {
        console.log("removed the variant color successfully");
      },
      onError: (e) => {
        toast.error(
          `Something wrong to remove variant color id : ${e.message}`
        );
      },
    });

    return mutate;
  };

  const remove = (productId: string) => {
    const mutate = useMutation<{}, Error, { variantId: string }>({
      mutationKey: [key, productId],
      mutationFn: async (r) => await getVariantApiInfo().remove(r.variantId),
      onError: (e) =>
        toast.error(`Something wrong to remove variant : ${e.message}`),
    });
    return mutate;
  };

  const update = (productId: string) => {
    const mutate = useMutation<
      VariantProduct,
      Error,
      { data: VariantProduct; variantId: string }
    >({
      mutationKey: [key, productId],
      mutationFn: async (r) =>
        await getVariantApiInfo().update(r.variantId, r.data),
      onSuccess: () => {
        // void queryClient.invalidateQueries({
        //   queryKey: ["product", productId],
        // });
        console.log("updated successfully");
      },
      onError: (e) =>
        toast.error(`Something wrong to update the variant : ${e.message}`),
    });
    return mutate;
  };

  return { update, remove, removeVariantColor };
};

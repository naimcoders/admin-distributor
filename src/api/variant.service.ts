import { useMutation, useQueryClient } from "@tanstack/react-query";
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
}

interface ApiVariantInfo {
  update(variantId: string, r: UpdateVariant): Promise<VariantProduct>;
}

function getVariantApiInfo(): ApiVariantInfo {
  return Api.getInstance();
}

const key = "variant";

export const useVariant = () => {
  const queryClient = useQueryClient();

  const update = () => {
    const mutate = useMutation<
      VariantProduct,
      Error,
      { data: VariantProduct; variantId: string }
    >({
      mutationKey: [key],
      mutationFn: async (r) =>
        await getVariantApiInfo().update(r.variantId, r.data),
      // onSuccess: () => {
      //   void queryClient.invalidateQueries({
      //     queryKey: ["product", productId],
      //   });
      // },
      onError: (e) => toast.error(e.message),
    });
    return mutate;
  };

  return { update };
};

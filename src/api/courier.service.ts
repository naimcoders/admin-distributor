import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { req } from "./request";
import { Location } from "./location.service";
import queryString from "query-string";

export interface Courier {
  courierInternal: CourierInternal;
  createdAt: number;
  document: Document;
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
  vehicle: Vehicle;
}

export interface CourierInternal {
  courier: string;
  courierId: string;
  ownerId: string;
  createdAt: number;
  updatedAt: number;
}

export interface Document {
  bankAccountBook: string;
  idImage: string;
  licenseImage: string;
  selfieImage: string;
  vehicleImage: string;
}

export interface Vehicle {
  brand: string;
  image: string;
  isUnder: boolean;
  outYear: number;
  skpd: string;
  stnk: string;
  type: string;
  typeVehicle: string;
}

export interface ReqCourierInternal {
  email: string;
  name: string;
  phoneNumber: string;
  location?: Location;
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

  private path = "courier";

  async createCourierInternal(r: ReqCourierInternal): Promise<Courier> {
    return await req<Courier>({
      method: "POST",
      isNoAuth: false,
      path: `${this.path}/internal`,
      body: r,
      errors: "",
    });
  }

  async findByMyCourier(userId: string): Promise<Courier> {
    const query = queryString.stringify(
      { userId },
      { skipNull: true, skipEmptyString: true }
    );

    return await req<Courier>({
      method: "GET",
      isNoAuth: false,
      path: `${this.path}/internal?${query}`,
      errors: "",
    });
  }

  async updateCourierInternal(r: ReqCourierInternal): Promise<Courier> {
    return await req<Courier>({
      method: "PUT",
      isNoAuth: false,
      path: `${this.path}/internal`,
      body: r,
      errors: "",
    });
  }
}

interface ApiCourierInfo {
  createCourierInternal(r: ReqCourierInternal): Promise<Courier>;
  findByMyCourier(userId: string): Promise<Courier>;
  updateCourierInternal(r: ReqCourierInternal): Promise<Courier>;
}

function getCourierApiInfo(): ApiCourierInfo {
  return Api.getInstance();
}

const keyCourierInternal = "courier-internal";

export const findMyCouurier = (merchantId: string) => {
  const { data, isLoading, error } = useQuery<Courier, Error>({
    queryKey: [keyCourierInternal],
    queryFn: () => getCourierApiInfo().findByMyCourier(merchantId),
    enabled: !!merchantId,
  });

  return { data, isLoading, error };
};

export const createCourierInternal = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    Courier,
    Error,
    ReqCourierInternal
  >({
    mutationKey: [keyCourierInternal, "create"],
    mutationFn: (r) => getCourierApiInfo().createCourierInternal(r),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [keyCourierInternal] });
    },
  });

  return { mutateAsync, isPending };
};

export const updateCourierInternal = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    Courier,
    Error,
    ReqCourierInternal
  >({
    mutationKey: [keyCourierInternal, "update"],
    mutationFn: (r) => getCourierApiInfo().updateCourierInternal(r),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [keyCourierInternal] });
    },
  });

  return { mutateAsync, isPending };
};

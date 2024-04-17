import { useMutation } from "@tanstack/react-query";
import { req } from "./request";

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
}

interface ApiCourierInfo {
  createCourierInternal(r: ReqCourierInternal): Promise<Courier>;
}

function getCourierApiInfo(): ApiCourierInfo {
  return Api.getInstance();
}

// const key = "courier";
const keyCourierInternal = "courier-internal";

export const useCourier = () => {
  const createCourierInternal = useMutation<Courier, Error, ReqCourierInternal>(
    {
      mutationKey: [keyCourierInternal, "create"],
      mutationFn: (r) => getCourierApiInfo().createCourierInternal(r),
    }
  );

  return { createCourierInternal };
};

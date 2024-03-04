import { FbAuth } from "src/firebase";
import { req } from "./request";
import { useMutation } from "@tanstack/react-query";

export enum Role {
  ADMIN = "ADMIN",
  DISTRIBUTOR = "DISTRIBUTOR",
}

interface ReqLogin {
  email: string;
  password: string;
  role: Role;
  fcmToken: string;
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

  private path = "login-admin";

  async login(r: ReqLogin): Promise<void> {
    const token = await req<string>({
      errors: "",
      method: "POST",
      isNoAuth: true,
      path: this.path,
      body: r,
    });
    await FbAuth.signInWithCustomToken(token);
  }
}

interface ApiLoginInfo {
  login(r: ReqLogin): Promise<void>;
}

export function getLoginApiInfo(): ApiLoginInfo {
  return Api.getInstance();
}

const key = "login";
export const useLogin = () => {
  return useMutation({
    mutationKey: [key],
    mutationFn: async (r: ReqLogin) => await getLoginApiInfo().login(r),
  });
};

import { FbAuth } from "src/firebase";
import { req } from "./request";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface ReqLogin {
  email: string;
  password: string;
  fcmToken: string;
}

interface SendOtp {
  phoneNumber: string;
  role: string;
  type: string;
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

  private path = "auth";

  async login(r: ReqLogin): Promise<void> {
    const token = await req<string>({
      errors: "",
      method: "POST",
      isNoAuth: true,
      path: `${this.path}/login-distributor`,
      body: r,
    });
    await FbAuth.signInWithCustomToken(token);
  }

  async sendOtp(r: SendOtp): Promise<string> {
    return await req<string>({
      method: "POST",
      isNoAuth: true,
      body: r,
      path: `${this.path}/send-otp`,
      errors: "",
    });
  }
}

interface ApiLoginInfo {
  login(r: ReqLogin): Promise<void>;
  sendOtp(r: SendOtp): Promise<string>;
}

export function getLoginApiInfo(): ApiLoginInfo {
  return Api.getInstance();
}

const key = "auth";

export const useLogin = () => {
  const login = useMutation({
    mutationKey: [key],
    mutationFn: async (r: ReqLogin) => await getLoginApiInfo().login(r),
  });

  const sendOtp = useMutation<string, Error, { data: SendOtp }>({
    mutationKey: [key, "send-otp"],
    mutationFn: async (r) => await getLoginApiInfo().sendOtp(r.data),
    onSuccess: () => toast.success("OTP berhasil dikirim"),
    onError: (e) => toast.error(e.message),
  });

  return { login, sendOtp };
};

import { getAuth } from "firebase/auth";
import { FbApp } from "src/firebase";

interface Treq {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  errors: { [key: number]: string };
  body?: any;
  isNoAuth?: boolean;
}

interface TRes<T> {
  code: number;
  errors: string | null;
  data: T | null;
}

export async function req<R>({
  isNoAuth,
  method,
  path,
  body,
  errors,
}: Treq): Promise<R> {
  let token = "";
  if (!isNoAuth) {
    const user = getAuth(FbApp).currentUser;
    if (user === null) {
      throw new Error("current user not found");
    }
    token = await user.getIdToken();
  }

  const baseURL = import.meta.env.VITE_BASE_URL;
  const mReq = await fetch(baseURL + path, {
    method: method,
    body: ["GET", "DELETE"].includes(method) ? undefined : JSON.stringify(body),
    mode: "cors",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const data: TRes<R> = await mReq.json();
  if (data.code >= 200 && data.code <= 299) {
    return data.data as R;
  } else if (errors[data.code] !== "") {
    throw new Error(`${data.errors}`);
  } else {
    throw new Error(`unknown error ${data.code}: ${data.errors}`);
  }
}

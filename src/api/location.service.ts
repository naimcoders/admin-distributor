import { req } from "./request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import queryString from "query-string";
import { setUser } from "src/stores/auth";

export interface Location {
  id: string;
  addressName: string;
  detailAddress: string;
  city: string;
  district: string;
  lat: number;
  lng: number;
  province: string;
  zipCode: string;
  isPrimary: boolean;
  type: string;
  userId: string;
}

interface Coordinate {
  lat: number;
  lng: number;
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

  private path = "location";

  async findLocationByUserId(userId: string): Promise<Location[]> {
    return await req<Location[]>({
      method: "GET",
      isNoAuth: false,
      path: `${this.path}/${userId}`,
      errors: "",
    });
  }

  async create(r: Location): Promise<Location> {
    return await req<Location>({
      method: "POST",
      isNoAuth: false,
      path: this.path,
      errors: "",
      body: r,
    });
  }

  async findGeoLocation(r: Coordinate): Promise<Location> {
    const query = queryString.stringify(
      {
        lat: r.lat,
        lng: r.lng,
      },
      { skipEmptyString: true, skipNull: true }
    );

    return await req<Location>({
      method: "GET",
      path: `${this.path}?${query}`,
      isNoAuth: false,
      errors: "",
    });
  }
}

interface ApiLocationInfo {
  findLocationByUserId(userId: string): Promise<Location[]>;
  findGeoLocation(r: Coordinate): Promise<Location>;
  create(r: Location): Promise<Location>;
}

function getLocationApiInfo(): ApiLocationInfo {
  return Api.getInstance();
}

const key = "location";

export const findLocationByUserId = () => {
  const user = setUser((v) => v.user);

  return useQuery<Location[], Error>({
    queryKey: [key, user?.id],
    queryFn: () => getLocationApiInfo().findLocationByUserId(user?.id ?? ""),
    enabled: !!user?.id,
  });
};

export const createLocation = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation<Location, Error, Location>({
    mutationKey: [key, "create"],
    mutationFn: (r) => getLocationApiInfo().create(r),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: [key] }),
  });
  return { mutateAsync, isPending };
};

export const findGeoLocation = (lat: number, lng: number) => {
  return useQuery<Location, Error>({
    queryKey: [key, lat, lng],
    queryFn: () => getLocationApiInfo().findGeoLocation({ lat, lng }),
    enabled: !!lat && !!lng,
  });
};

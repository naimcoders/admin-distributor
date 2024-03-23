import { req } from "./request";
import { useQuery } from "@tanstack/react-query";
import queryString from "query-string";

export interface Location {
  addressName: string;
  city: string;
  district: string;
  lat: number;
  lng: number;
  province: string;
  zipCode: string;
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
  findGeoLocation(r: Coordinate): Promise<Location>;
}

function getLocationApiInfo(): ApiLocationInfo {
  return Api.getInstance();
}

const key = "location";

export const useLocation = () => {
  const findGeoLocation = (lat: number, lng: number) => {
    return useQuery<Location, Error>({
      queryKey: [key, lat, lng],
      queryFn: async () =>
        await getLocationApiInfo().findGeoLocation({ lat, lng }),
      enabled: !!lat && !!lng,
    });
  };

  return { findGeoLocation };
};

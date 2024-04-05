class Api {
  private static instance: Api;
  private constructor() {}
  public static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance;
  }

  private path = "pilipay";
}

interface ApiPilipayInfo {}

function getPilipayApiInfo(): ApiPilipayInfo {
  return Api.getInstance();
}

const key = "pilipay";

const usePilipay = () => {
  return {};
};

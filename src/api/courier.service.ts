class Api {
  private static instance: Api;
  private constructor() {}
  public static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance;
  }

  private path = "";
}

interface ApiCourierInfo {}

function getCourierApiInfo(): ApiCourierInfo {
  return Api.getInstance();
}

const key = "courier";

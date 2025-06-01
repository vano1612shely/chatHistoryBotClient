import axios, { type AxiosRequestConfig, type Method } from "axios";

export const LocalStorageTokenKey = "token";

type ApiRequestConfig = {
  url: string;
  params?: Record<string, any>;
  payload?: any;
  contentType?: string;
  headers?: Record<string, string>;
  skipAuthHeaders?: boolean;
};

type ApiMethod = <T = any>(config: ApiRequestConfig) => Promise<T>;

const getData = (): {
  token: string | null;
} => {
  return {
    token: localStorage.getItem(LocalStorageTokenKey),
  };
};

const rawApiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
});

rawApiClient.interceptors.request.use(
  (config) => {
    if (config.headers?.skipAuthHeaders) {
      delete config.headers.skipAuthHeaders;
      return config;
    }

    const data = getData();
    if (data.token) {
      config.headers.token = data.token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
rawApiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(LocalStorageTokenKey);
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

function createMethod(method: Method): ApiMethod {
  return async function <T = any>({
    url,
    params,
    payload,
    contentType,
    headers,
    skipAuthHeaders,
  }: ApiRequestConfig): Promise<T> {
    return rawApiClient.request<any, T>({
      url,
      method,
      params,
      data: payload,
      headers: {
        "Content-Type": contentType || "application/json",
        ...(headers || {}),
        ...(skipAuthHeaders ? { skipAuthHeaders: true } : {}),
      },
    });
  };
}

const getBlobFile = async ({
  url,
  params,
}: ApiRequestConfig): Promise<{
  fileBlob: Blob;
  isZip: boolean;
}> => {
  const options: AxiosRequestConfig = {
    responseType: "blob",
    params,
  };
  const res = await rawApiClient.get(url, options);
  const isZip = res?.headers?.["content-type"] === "application/zip";

  return {
    fileBlob: res.data,
    isZip,
  };
};

export const apiClient = {
  get: createMethod("get"),
  post: createMethod("post"),
  put: createMethod("put"),
  delete: createMethod("delete"),
  patch: createMethod("patch"),
  getBlobFile: getBlobFile,
};

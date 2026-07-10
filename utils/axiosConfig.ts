import axios from "axios";
import { store } from "@/store";
import {
  selectedRefresh,
  selectedToken,
  setAuthTokens,
  logoutUser,
} from "@/redux/reducer/auth/auth";
import {
  isAccessTokenExpired,
  isRefreshTokenInvalid,
  refreshAuthToken,
} from "@/utils/authApi";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
export const pictureUrl = process.env.NEXT_PUBLIC_PROFILE_URL;

const axiosInstance = axios.create({
  baseURL,
});

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  refreshQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  refreshQueue = [];
};

const handleTokenRefresh = async (refresh: string) => {
  try {
    const { data } = await refreshAuthToken(refresh);
    store.dispatch(
      setAuthTokens({ access: data.access, refresh: data.refresh })
    );
    processQueue(null, data.access);
    return data.access as string;
  } catch (err) {
    processQueue(err, null);
    store.dispatch(logoutUser());
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
    throw err;
  } finally {
    isRefreshing = false;
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = selectedToken(store.getState());
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const responseData = error.response?.data;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      isAccessTokenExpired(responseData)
    ) {
      originalRequest._retry = true;
      const refresh = selectedRefresh(store.getState());

      if (!refresh) {
        store.dispatch(logoutUser());
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await handleTokenRefresh(refresh);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      try {
        const newToken = await new Promise<string>((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        });
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    if (
      error.response?.status === 401 &&
      isRefreshTokenInvalid(responseData)
    ) {
      store.dispatch(logoutUser());
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

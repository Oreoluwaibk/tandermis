import axios from "axios";
import { store } from "@/store";
import { selectedToken } from "@/redux/reducer/auth/auth";
import { setToken, logoutUser } from "@/redux/reducer/auth/auth";
// import { refreshToken } from "@/redux/action/auth";
// import { refreshToken } from "@/services/auth";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
export const pictureUrl = process.env.NEXT_PUBLIC_PROFILE_URL;

const axiosInstance = axios.create({
  baseURL,
});

// Track refresh activity
let isRefreshing = false;
let refreshQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  refreshQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  refreshQueue = [];
};

/**
 * Helper: performs token refresh and updates store + localStorage
 */
// const handleTokenRefresh = async (oldToken: string) => {
//   const now = Date.now();

//   try {
//     const { data } = await refreshToken({ token: oldToken });
//     const newToken = data?.token;
//     const newExpiry = data?.tokenExpiry || now + 3600 * 1000; // fallback: 1h

//     store.dispatch(setToken({ token: newToken, tokenExpiry: newExpiry }));

//     processQueue(null, newToken);
//     return newToken;
//   } catch (err) {
//     processQueue(err, null);
//     if (typeof window !== "undefined") {
//       const currentUrl = window.location.pathname + window.location.search;
//       store.dispatch(setLastRoute(currentUrl));
//     }
//     store.dispatch(logoutUser());
//     throw err;
//   } finally {
//     isRefreshing = false;
//   }
// };

axiosInstance.interceptors.request.use(
  async (config) => {
    const state = store.getState();
    const token = selectedToken(state);
    // const expiry = selectedTokenExpiry(state);
    const now = Date.now();

    // ✅ Check if token expired before sending request
    // if (expiry && expiry < now) {
    //   if (!isRefreshing) {
    //     isRefreshing = true;
    //     const newToken = await handleTokenRefresh(token);
    //     config.headers["Authorization"] = `Bearer ${newToken}`;
    //   } else {
    //     // wait for ongoing refresh to finish
    //     const newToken = await new Promise((resolve, reject) => {
    //       refreshQueue.push({ resolve, reject });
    //     });
    //     config.headers["Authorization"] = `Bearer ${newToken}`;
    //   }
    // } else if (token) {
    //   config.headers["Authorization"] = `Bearer ${token}`;
    // }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ Handle 401 errors (unauthorized)
    console.log("the current error", error.response?.status, !originalRequest._retry);
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const state = store.getState();
      const token = selectedToken(state);

      if (!token) {
        if (typeof window !== "undefined") {
          const currentUrl = window.location.pathname + window.location.search;
          // store.dispatch(setLastRoute(currentUrl));
        }
        store.dispatch(logoutUser());
        return Promise.reject(error);
      }

      // if (!isRefreshing) {
      //   isRefreshing = true;
      //   try {
      //     const newToken = await handleTokenRefresh(token);

      //     // retry with new token
      //     originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
      //     return axiosInstance(originalRequest);
      //   } catch (err) {
      //     return Promise.reject(err);
      //   }
      // } else {
      //   // wait for ongoing refresh
      //   try {
      //     const newToken = await new Promise((resolve, reject) => {
      //       refreshQueue.push({ resolve, reject });
      //     });
      //     originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
      //     return axiosInstance(originalRequest);
      //   } catch (err) {
      //     return Promise.reject(err);
      //   }
      // }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

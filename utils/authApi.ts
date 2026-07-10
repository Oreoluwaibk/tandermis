import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const refreshAuthToken = (refresh: string) =>
  axios.post(`${baseUrl}/auth/token/refresh`, { refresh });

export interface TokenRefreshError {
  detail?: string;
  code?: string;
  messages?: Array<{
    token_class?: string;
    token_type?: string;
    message?: string;
  }>;
}

export const isAccessTokenExpired = (data: TokenRefreshError) =>
  data?.code === "token_not_valid" &&
  data?.messages?.[0]?.token_type === "access" &&
  data?.messages?.[0]?.message === "Token is expired";

export const isRefreshTokenInvalid = (data: TokenRefreshError) =>
  data?.code === "token_not_valid" &&
  (data?.detail === "Token is blacklisted" ||
    data?.detail === "Token is invalid");

import axios from "axios";
import axiosInstance from "@/utils/axiosConfig";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export interface LoginData {
  email: string;
  password: string;
}

export interface IUser {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  job_title?: string;
  workplace_name?: string;
  phone_number?: string;
  country_code?: string;
  account_id?: number;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: IUser;
}

export interface SignupResponse {
  user: IUser;
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface SigninReducer {
  user: IUser | null;
  isAuthenticated: boolean;
  token: string | null;
  refresh: string | null;
  loading: boolean;
  success: boolean;
  error: unknown;
}

export interface SignupPayload {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  phone_number: string;
  country_code: string;
  job_title: string;
  workplace_name: string;
  address_line_1: string;
  address_line_2?: string;
  local_government_area: string;
  state: string;
  country: string;
  account_id: number;
  invite_token?: string;
}

export const login = (data: LoginData) =>
  axios.post<LoginResponse>(`${baseUrl}/auth/login`, data);

export const registerUser = (data: SignupPayload) =>
  axios.post<SignupResponse>(`${baseUrl}/auth/signup`, data);

export const createContributor = (accessToken: string) =>
  axios.post(
    `${baseUrl}/api/contributor`,
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

export const apiLogout = (refresh: string) =>
  axiosInstance.post("/auth/logout", { refresh });

export const requestPasswordReset = (data: { email: string }) =>
  axios.post(`${baseUrl}/auth/request-password-reset`, data);

export const resetPasswordApi = (data: {
  uid: string;
  token: string;
  new_password: string;
}) => axios.post(`${baseUrl}/auth/reset-password`, data);

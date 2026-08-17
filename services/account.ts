import axios from "axios";
import axiosInstance from "@/utils/axiosConfig";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export type AccountType = "INDIVIDUAL" | "TEAM";

export interface Account {
  id: number;
  name: string;
  account_type: AccountType;
  max_seat: number;
  address: string;
  state: string;
  country: string;
}

export interface CreateAccountPayload {
  name: string;
  account_type: AccountType;
  max_seat: number;
  address: string;
  state: string;
  country: string;
}

export interface CreateAccountResponse {
  message: string;
  account: Account;
}

export const createAccount = (payload: CreateAccountPayload) =>
  axios.post<CreateAccountResponse>(`${baseUrl}/api/account`, payload);

export const getAccount = () => axiosInstance.get("/api/account");

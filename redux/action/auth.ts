import axiosInstance from "@/utils/axiosConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import axiosInstance from "../../../utils/axiosConfig";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export interface loginData {
    email: string;
    password: string;
}
export interface IUser {
    "id": number;
    "email": string;
    "first_name": string;
    "last_name": string;
}

export interface signinReducer {
    user: IUser | null
    isAuthenticated: boolean;
    token: string | null
    refresh: string | null
    loading: boolean;
    success: boolean;
    error: any;
}
export interface registerPayload {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
};

export interface User {};

export const login = async (data:loginData) => {
    const response = await axios.post(`${baseUrl}/accounts/login/`, data);
    return Promise.resolve(response);
}

export const logoutUser = async () => {
    const url = `/Authentication/logout`;
    const response = await axiosInstance.post(url, {});

    return Promise.resolve(response);
}

export const loginAction = createAsyncThunk(
  "auth/login",
  async (data: { token: {access: string; refresh: string}, user: User }) => {
    const { token, user,  } = data;

    // ✅ Persist data
    localStorage.setItem("tandermis_user", JSON.stringify(user));
    
    localStorage.setItem(
      "tandermis_token",
      JSON.stringify(token.access)
    );

    localStorage.setItem(
      "tandermis_refresh_token",
      JSON.stringify(token.refresh)
    );

    // ✅ Return payload for Redux
    return {
      token: token.access,
      user,
      refresh: token.refresh
    };
  }
);

export const registerUser = async (data: registerPayload) => {
    const response = await axios.post(`${baseUrl}/accounts/signup/`, data);
    return Promise.resolve(response);
}


export const changePassword = async(data:{ email: string }) => {
    const response = await axios.post(`${baseUrl}/accounts/password-reset/`, data);
    return Promise.resolve(response);
}

export const resetPassword = async(data: {newPassword: string, token: string, email: string }) => {
    const response = await axios.post(`${baseUrl}/accounts/password-reset/`, data);
    return Promise.resolve(response);
}

export const submitResponse = async(data: FormData) => {
    const url = `/derm-cases/`;
    const response = await axiosInstance.post(url, data, {
        headers: {
            "Content-Type": "multi-part/formdata"
        }
    });

    return Promise.resolve(response);
}

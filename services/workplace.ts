import { IUser } from "@/redux/action/auth";
import axiosInstance from "@/utils/axiosConfig";

export interface WorkplacePayload {
  job_title: string;
  workplace_name: string;
  address_line_1: string;
  address_line_2?: string;
  local_government_area: string;
  state: string;
  country: string;
}

export interface WorkplaceResponse {
  message: string;
  user: IUser;
}

export const updateWorkplace = (payload: WorkplacePayload) =>
  axiosInstance.patch<WorkplaceResponse>("/api/workplace", payload);

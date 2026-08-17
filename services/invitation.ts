import axios from "axios";
import axiosInstance from "@/utils/axiosConfig";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export type InvitationRole = "MEMBER" | "ADMIN";

export interface TeamInvitation {
  account_id: number;
  account_name: string;
  address: string;
  state: string;
  country: string;
  invited_by: string;
  token: string;
  is_accepted: number;
  valid_to: string;
  role: InvitationRole;
  email: string;
}

export interface InvitationLookupResponse {
  status: "valid" | "invalid";
  reason: string;
  invitation?: TeamInvitation;
  error?: string;
  valid_to?: string;
}

export interface SendInvitationPayload {
  email: string;
  role: InvitationRole;
}

export interface SendInvitationResponse {
  message: string;
  email_status: string;
  expires_at: string;
}

export const getTeamInvitation = (token: string) =>
  axios.get<InvitationLookupResponse>(`${baseUrl}/api/team-invitation`, {
    params: { token },
  });

export const sendTeamInvitation = (payload: SendInvitationPayload) =>
  axiosInstance.post<SendInvitationResponse>("/api/team-invitation", payload);

export const acceptTeamInvitation = (token: string) =>
  axiosInstance.post("/api/team-invitation/accept", { token });

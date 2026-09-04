import axiosInstance from "@/utils/axiosConfig";
import { parseApiDate } from "@/utils/subscription";

export type FreeTrialStatus = "SUCCESS" | "FAILED";

export interface FreeTrialResponse {
  status: FreeTrialStatus | string;
  subscription_valid_to: string;
  message: string;
}

const isFreeTrialPayload = (data: unknown): data is FreeTrialResponse =>
  Boolean(
    data &&
      typeof data === "object" &&
      "status" in data &&
      "message" in (data as FreeTrialResponse)
  );

export const startFreeTrial = () =>
  axiosInstance.post<FreeTrialResponse>("/api/free-trial", {});

export const trialSubscriptionTo = (data: FreeTrialResponse) => {
  const value = data.subscription_valid_to?.trim();
  return value || null;
};

export const interpretFreeTrial = (data: FreeTrialResponse) => {
  const expiry = trialSubscriptionTo(data);
  const expiryIsFuture = Boolean(
    expiry && (parseApiDate(expiry)?.getTime() || 0) > Date.now()
  );
  const status = String(data.status || "").toUpperCase();

  return {
    activated: status === "SUCCESS",
    alreadySubscribed: status === "FAILED" && expiryIsFuture,
    usedPreviously: status === "FAILED" && !expiryIsFuture,
    expiry: status === "SUCCESS" || expiryIsFuture ? expiry : null,
    message: data.message,
  };
};

export const requestFreeTrial = async () => {
  try {
    const res = await startFreeTrial();
    return interpretFreeTrial(res.data);
  } catch (err: unknown) {
    const data = (err as { response?: { data?: unknown } })?.response?.data;
    if (isFreeTrialPayload(data)) {
      return interpretFreeTrial(data);
    }
    throw err;
  }
};

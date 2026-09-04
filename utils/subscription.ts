import { IUser } from "@/redux/action/auth";

export const parseApiDate = (value?: string | null) => {
  if (!value?.trim()) return null;
  const normalized = value.trim().replace(/(\.\d{3})\d+/, "$1");
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const hasValidSubscription = (user?: IUser | null) => {
  const expiry = parseApiDate(user?.account_details?.subscription_valid_to);
  if (!expiry) return false;
  return expiry.getTime() > Date.now();
};

export const applySubscriptionToUser = (
  user: IUser,
  subscriptionValidTo?: string | null
): IUser => ({
  ...user,
  account_details: {
    account_id: user.account_details?.account_id || user.account_id || 0,
    role: user.account_details?.role || "ADMIN",
    max_seat: user.account_details?.max_seat || 1,
    subscription_valid_to:
      subscriptionValidTo?.trim() ||
      user.account_details?.subscription_valid_to ||
      null,
  },
});

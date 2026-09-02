import { IUser } from "@/redux/action/auth";

export const hasValidSubscription = (user?: IUser | null) => {
  const expiry = user?.account_details?.subscription_valid_to;
  if (!expiry) return false;

  const date = new Date(expiry);
  if (Number.isNaN(date.getTime())) return false;

  return date.getTime() > Date.now();
};

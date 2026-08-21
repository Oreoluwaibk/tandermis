import axios from "axios";
import { AccountType } from "@/services/account";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export interface PricingPlan {
  account_type: AccountType;
  max_seat: number;
  price: number;
  currency: string;
  subscription_duration: string;
}

export const getPricing = () =>
  axios.get<PricingPlan[]>(`${baseUrl}/api/pricing`);

export const formatPlanPrice = (price: number, currency = "NGN") => {
  if (currency === "NGN") return `₦${Number(price).toLocaleString()}`;
  return `${currency} ${Number(price).toLocaleString()}`;
};

export const matchPricingPlan = (
  plans: PricingPlan[],
  accountType?: AccountType | null,
  maxSeat?: number | null
): PricingPlan | null => {
  if (!plans.length) return null;

  const type = accountType || "INDIVIDUAL";
  const seats = maxSeat || (type === "INDIVIDUAL" ? 1 : 2);
  const forType = plans
    .filter((plan) => plan.account_type === type)
    .sort((a, b) => a.max_seat - b.max_seat);

  const pool = forType.length ? forType : plans;
  const exact = pool.find((plan) => plan.max_seat === seats);
  if (exact) return exact;

  return pool.find((plan) => plan.max_seat >= seats) || pool[pool.length - 1];
};

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

export const extractPricingPlans = (data: unknown): PricingPlan[] => {
  if (Array.isArray(data)) return data as PricingPlan[];
  return [];
};

export const getPricing = () =>
  axios.get<PricingPlan[]>(`${baseUrl}/api/pricing`);

export const formatPlanPrice = (price: number, currency?: string) => {
  const amount = Number(price).toLocaleString();
  if (!currency) return amount;
  if (currency.toUpperCase() === "NGN") return `₦${amount}`;
  return `${currency} ${amount}`;
};

export const matchPricingPlan = (
  plans: PricingPlan[],
  accountType?: AccountType | string | null,
  maxSeat?: number | null
): PricingPlan | null => {
  if (!plans.length) return null;

  const type = accountType || "INDIVIDUAL";
  const forType = plans
    .filter((plan) => plan.account_type === type)
    .sort((a, b) => a.max_seat - b.max_seat);

  const pool = forType.length ? forType : plans;
  if (maxSeat == null) return pool[0];

  const exact = pool.find((plan) => plan.max_seat === maxSeat);
  if (exact) return exact;

  return pool.find((plan) => plan.max_seat >= maxSeat) || pool[pool.length - 1];
};

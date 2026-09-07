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

export const normalizeDuration = (value?: string | null) =>
  (value || "").trim().toLowerCase().replace(/\s+/g, " ");

const durationDays = (value: string) => {
  const match = value.trim().toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(.+)$/);
  const amount = match ? Number(match[1]) : 1;
  const unit = match?.[2] || value.toLowerCase();
  const multiplier = /year/.test(unit)
    ? 365
    : /month/.test(unit)
      ? 30
      : /week/.test(unit)
        ? 7
        : /day/.test(unit)
          ? 1
          : 0;
  return amount * (multiplier || Number.MAX_SAFE_INTEGER);
};

export const sortPricingPlans = (plans: PricingPlan[]) =>
  [...plans].sort((a, b) => {
    if (a.account_type !== b.account_type) {
      return a.account_type === "INDIVIDUAL" ? -1 : 1;
    }
    if (a.max_seat !== b.max_seat) return a.max_seat - b.max_seat;
    const durationDiff =
      durationDays(a.subscription_duration) -
      durationDays(b.subscription_duration);
    if (durationDiff !== 0) return durationDiff;
    return a.price - b.price;
  });

export const formatPlanTitle = (plan: PricingPlan) => {
  if (plan.account_type === "INDIVIDUAL") {
    return `Individual · ${plan.subscription_duration}`;
  }
  return `Team · ${plan.max_seat} seat${plan.max_seat === 1 ? "" : "s"} · ${plan.subscription_duration}`;
};

export const plansForAccount = (
  plans: PricingPlan[],
  accountType?: AccountType | string | null,
  maxSeat?: number | null
) => {
  const type = accountType || "INDIVIDUAL";
  return sortPricingPlans(
    plans.filter((plan) => {
      if (plan.account_type !== type) return false;
      if (maxSeat == null) return true;
      return plan.max_seat === maxSeat;
    })
  );
};

export const matchPricingPlan = (
  plans: PricingPlan[],
  accountType?: AccountType | string | null,
  maxSeat?: number | null,
  duration?: string | null
): PricingPlan | null => {
  const pool = plansForAccount(plans, accountType, maxSeat);
  if (!pool.length) {
    const byType = plansForAccount(plans, accountType);
    return byType[0] || sortPricingPlans(plans)[0] || null;
  }

  if (duration) {
    const wanted = normalizeDuration(duration);
    const exact = pool.find(
      (plan) => normalizeDuration(plan.subscription_duration) === wanted
    );
    if (exact) return exact;
  }

  return pool[0];
};

export const teamSeatOptions = (plans: PricingPlan[]) => {
  const grouped = new Map<number, PricingPlan[]>();
  plansForAccount(plans, "TEAM").forEach((plan) => {
    const group = grouped.get(plan.max_seat) || [];
    group.push(plan);
    grouped.set(plan.max_seat, group);
  });

  return [...grouped.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([seats, group]) => {
      const cheapest = group.reduce((a, b) => (a.price < b.price ? a : b));
      return {
        value: seats,
        label:
          group.length === 1
            ? `${seats} seats · ${formatPlanPrice(cheapest.price, cheapest.currency)} / ${cheapest.subscription_duration}`
            : `${seats} seats · from ${formatPlanPrice(cheapest.price, cheapest.currency)}`,
      };
    });
};

export const paymentQueryForPlan = (plan: PricingPlan) => {
  const params = new URLSearchParams({
    account_type: plan.account_type,
    max_seat: String(plan.max_seat),
    duration: plan.subscription_duration,
  });
  return `/payment?${params.toString()}`;
};

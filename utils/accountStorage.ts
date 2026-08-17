import { Account } from "@/services/account";
import { PaymentVerificationResponse } from "@/services/payment";

const ACCOUNT_KEY = "tandermis_account";
const SUBSCRIPTION_KEY = "tandermis_subscription";
const INVITE_COUNT_KEY = "tandermis_invite_count";
const PROFILE_EXTRAS_KEY = "tandermis_profile_extras";

const isBrowser = typeof window !== "undefined";

export interface ProfileExtras {
  phone_number?: string;
  country_code?: string;
  address_line_1?: string;
  address_line_2?: string;
  local_government_area?: string;
  state?: string;
  country?: string;
  job_title?: string;
  workplace_name?: string;
}

const readJson = <T>(key: string): T | null => {
  if (!isBrowser) return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const getStoredAccount = () => readJson<Account>(ACCOUNT_KEY);

export const setStoredAccount = (account: Account) => {
  if (!isBrowser) return;
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
};

export const getStoredSubscription = () =>
  readJson<PaymentVerificationResponse>(SUBSCRIPTION_KEY);

export const setStoredSubscription = (data: PaymentVerificationResponse) => {
  if (!isBrowser) return;
  localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(data));
};

export const getInviteCount = () => {
  if (!isBrowser) return 0;
  return parseInt(localStorage.getItem(INVITE_COUNT_KEY) || "0", 10) || 0;
};

export const incrementInviteCount = (by = 1) => {
  if (!isBrowser) return 0;
  const next = getInviteCount() + by;
  localStorage.setItem(INVITE_COUNT_KEY, String(next));
  return next;
};

export const getProfileExtras = () => readJson<ProfileExtras>(PROFILE_EXTRAS_KEY);

export const setProfileExtras = (extras: ProfileExtras) => {
  if (!isBrowser) return;
  localStorage.setItem(PROFILE_EXTRAS_KEY, JSON.stringify(extras));
};

export const clearAccountStorage = () => {
  if (!isBrowser) return;
  localStorage.removeItem(ACCOUNT_KEY);
  localStorage.removeItem(SUBSCRIPTION_KEY);
  localStorage.removeItem(INVITE_COUNT_KEY);
  localStorage.removeItem(PROFILE_EXTRAS_KEY);
};

export const AFTER_HOURS_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "tandermis@gmail.com";

export const SERVICE_UNAVAILABLE_MESSAGE =
  "Our diagnosis service is currently unavailable. To request access, please email us first.";

/** Diagnosis is paused until access is granted by email. */
export const isServiceAvailable = () => false;

export const useServiceHours = () => false;

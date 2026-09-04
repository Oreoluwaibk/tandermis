import { parseApiDate } from "@/utils/subscription";

export const formatReadableDate = (value?: string | null) => {
  const date = parseApiDate(value);
  if (!date) return value || "";

  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatPaymentStatus = (status?: string) => {
  switch (status?.toUpperCase()) {
    case "SUCCESS":
      return "Successful";
    case "PENDING":
      return "Pending";
    case "UNKNOWN":
      return "Unsuccessful";
    default:
      return status || "Unknown";
  }
};

export const formatSubscriptionSummary = (value?: string | null) => {
  if (!value) return "Your subscription was not successful.";
  if (!parseApiDate(value)) return value;
  return `Your subscription is valid until ${formatReadableDate(value)}.`;
};

const isIsoDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}T/.test(value)) return false;
  return !Number.isNaN(new Date(value).getTime());
};

export const formatReadableDate = (value?: string | null) => {
  if (!value) return "";
  if (!isIsoDate(value)) return value;

  return new Date(value).toLocaleString("en-GB", {
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
  if (!isIsoDate(value)) return value;
  return `Your subscription is valid until ${formatReadableDate(value)}.`;
};

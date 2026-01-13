export const createErrorMessage = (data: any): string => {
  if (!data) return "Unable to complete request, something went wrong";

  // ✅ Highest priority: ASP.NET Core validation errors
  if (data.errors && typeof data.errors === "object") {
    const messages: string[] = [];

    Object.values(data.errors).forEach((value: any) => {
      if (Array.isArray(value)) {
        messages.push(...value);
      } else if (typeof value === "string") {
        messages.push(value);
      }
    });

    if (messages.length > 0) {
      return messages.join(" | ");
    }
  }

  // ✅ Common direct message formats
  if (data.error) return data.error;
  if (data.message) return data.message;
  if (data.detail) return data.detail;

  // Title comes LAST, because "One or more validation errors occurred."
  // is useless without the messages.
  if (data.title) return data.title;

  // Array fallback
  if (Array.isArray(data)) return data.join(", ");

  // Generic object fallback
  if (typeof data === "object") {
    return Object.entries(data)
      .map(([key, val]) => `${key}: ${val}`)
      .join(", ");
  }

  return "Unable to complete request, something went wrong";
};

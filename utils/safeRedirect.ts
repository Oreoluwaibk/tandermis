export const getSafeRedirect = (
  next: string | null,
  fallback = "/dermatology"
) => {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }
  return next;
};

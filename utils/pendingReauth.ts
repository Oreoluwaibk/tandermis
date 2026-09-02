const REAUTH_KEY = "tandermis_pending_reauth";

const isBrowser = typeof window !== "undefined";

export const setPendingReauth = (email: string, password: string) => {
  if (!isBrowser) return;
  sessionStorage.setItem(REAUTH_KEY, JSON.stringify({ email, password }));
};

export const getPendingReauth = (): { email: string; password: string } | null => {
  if (!isBrowser) return null;
  const raw = sessionStorage.getItem(REAUTH_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { email?: string; password?: string };
    if (!parsed.email || !parsed.password) return null;
    return { email: parsed.email, password: parsed.password };
  } catch {
    return null;
  }
};

export const clearPendingReauth = () => {
  if (!isBrowser) return;
  sessionStorage.removeItem(REAUTH_KEY);
};

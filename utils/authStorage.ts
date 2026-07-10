const USER_KEY = "tandermis_user";
const TOKEN_KEY = "tandermis_token";
const REFRESH_KEY = "tandermis_refresh_token";

const isBrowser = typeof window !== "undefined";

const readValue = (key: string): string | null => {
  if (!isBrowser) return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "string" ? parsed : raw;
  } catch {
    return raw;
  }
};

export const getAccessToken = () => readValue(TOKEN_KEY);
export const getRefreshToken = () => readValue(REFRESH_KEY);

export const getStoredUser = <T>() => {
  if (!isBrowser) return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const setAuthStorage = (data: {
  access: string;
  refresh: string;
  user?: unknown | null;
}) => {
  if (!isBrowser) return;
  localStorage.setItem(TOKEN_KEY, data.access);
  localStorage.setItem(REFRESH_KEY, data.refresh);
  if (data.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }
};

export const clearAuthStorage = () => {
  if (!isBrowser) return;
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

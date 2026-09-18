import { useEffect, useState } from "react";

export const SERVICE_TIMEZONE = "Africa/Lagos";
export const SERVICE_OPENS_AT = "9:00 AM";
export const SERVICE_CLOSES_AT = "5:00 PM";
export const SERVICE_DAYS = "Monday to Friday";
export const AFTER_HOURS_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "tandermis@gmail.com";

const getLagosParts = (now = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: SERVICE_TIMEZONE,
    hour: "numeric",
    hour12: false,
    weekday: "short",
  }).formatToParts(now);

  const hourPart = parts.find((part) => part.type === "hour")?.value;
  const weekday = parts.find((part) => part.type === "weekday")?.value;
  const hour = Number(hourPart);

  return {
    hour: hour === 24 ? 0 : hour,
    weekday: weekday || "",
  };
};

const WEEKDAY_SHORT = new Set(["Mon", "Tue", "Wed", "Thu", "Fri"]);

/** Available Mon–Fri 9:00 AM–4:59 PM WAT. Unavailable evenings and weekends. */
export const isServiceAvailable = (now = new Date()) => {
  const { hour, weekday } = getLagosParts(now);
  if (!WEEKDAY_SHORT.has(weekday)) return false;
  return hour >= 9 && hour < 17;
};

export const useServiceHours = () => {
  const [available, setAvailable] = useState(() => isServiceAvailable());

  useEffect(() => {
    const tick = () => setAvailable(isServiceAvailable());
    tick();
    const interval = window.setInterval(tick, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return available;
};

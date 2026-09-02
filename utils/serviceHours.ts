import { useEffect, useState } from "react";

export const SERVICE_TIMEZONE = "Africa/Lagos";
export const SERVICE_OPENS_AT = "8:00 AM";
export const SERVICE_CLOSES_AT = "5:00 PM";
export const AFTER_HOURS_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "hello@tandermis.com";

const getLagosHour = (now = new Date()) => {
  const hourPart = new Intl.DateTimeFormat("en-GB", {
    timeZone: SERVICE_TIMEZONE,
    hour: "numeric",
    hour12: false,
  })
    .formatToParts(now)
    .find((part) => part.type === "hour")?.value;

  const hour = Number(hourPart);
  return hour === 24 ? 0 : hour;
};

/** Available 8:00 AM–4:59 PM WAT. Unavailable 5:00 PM–7:59 AM. */
export const isServiceAvailable = (now = new Date()) => {
  const hour = getLagosHour(now);
  return hour >= 8 && hour < 17;
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

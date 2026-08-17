export const countryCodes = [
  { code: "234", label: "Nigeria (+234)" },
  { code: "233", label: "Ghana (+233)" },
  { code: "254", label: "Kenya (+254)" },
  { code: "27", label: "South Africa (+27)" },
  { code: "1", label: "United States (+1)" },
  { code: "44", label: "United Kingdom (+44)" },
];

export const countries = ["Nigeria", "Ghana", "Kenya", "South Africa"];

export const jobTitles = [
  "consultant",
  "senior registrar",
  "registrar",
  "house officer",
  "medical officer",
  "senior medical officer",
  "principal medical officer",
  "chief medical officer",
];

export const toTitleCase = (value: string) =>
  value
    .split(" ")
    .map((part) =>
      part.toLowerCase() === "fct"
        ? "FCT"
        : part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(" ");

export const formatPhoneForGateway = (
  phone?: string,
  countryCode = "234"
) => {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (countryCode === "234" && !digits.startsWith("0") && !digits.startsWith("234")) {
    return `0${digits}`;
  }
  return digits;
};

export const nigerianStates = [
  "abia",
  "adamawa",
  "akwa ibom",
  "anambra",
  "bauchi",
  "bayelsa",
  "benue",
  "borno",
  "cross river",
  "delta",
  "ebonyi",
  "edo",
  "ekiti",
  "enugu",
  "fct",
  "gombe",
  "imo",
  "jigawa",
  "kaduna",
  "kano",
  "katsina",
  "kebbi",
  "kogi",
  "kwara",
  "lagos",
  "nasarawa",
  "niger",
  "ogun",
  "ondo",
  "osun",
  "oyo",
  "plateau",
  "rivers",
  "sokoto",
  "taraba",
  "yobe",
  "zamfara",
];

export const stateOptions = nigerianStates.map((state) => {
  const label = toTitleCase(state);
  return { value: label, label };
});

export const normalizePhoneNumber = (phone: string, countryCode: string) => {
  let digits = phone.replace(/\D/g, "");
  if (countryCode === "234" && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return digits;
};

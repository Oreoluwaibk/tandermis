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

export const normalizePhoneNumber = (phone: string, countryCode: string) => {
  let digits = phone.replace(/\D/g, "");
  if (countryCode === "234" && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return digits;
};

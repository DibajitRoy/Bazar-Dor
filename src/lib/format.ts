const BN_DIGITS = "০১২৩৪৫৬৭৮৯";


export const parseNumber = (value: unknown): number | null => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;

  const latin = value.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));
  const cleaned = latin.replace(/[^0-9.\-]/g, "");
  if (!cleaned || cleaned === "-" || cleaned === ".") return null;

  const num = Number(cleaned);
  if (Number.isNaN(num)) return null;

  return value.includes("▼") ? -Math.abs(num) : num;
};


export const formatNumber = (n: number) =>
  n.toLocaleString("bn-BD", {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  });

export const formatTaka = (n: number) => `${formatNumber(n)} টাকা`;


export const formatPercent = (n: number) =>
  `${Math.abs(n).toLocaleString("bn-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;

export const getBanglaDate = () =>
  new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });
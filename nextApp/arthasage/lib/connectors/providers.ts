export const BANK_PROVIDERS = {
  HDFC: () => import("@/data/banks/hdfc.json"),
  SBI: () => import("@/data/banks/sbi.json"),
  ICICI: () => import("@/data/banks/icici.json"),
  AXIS: () => import("@/data/banks/axis.json"),
};

export const DEMAT_PROVIDERS = {
  ZERODHA: () => import("@/data/demat/zerodha.json"),
  GROWW: () => import("@/data/demat/groww.json"),
  UPSTOX: () => import("@/data/demat/upstox.json"),
  ANGELONE: () => import("@/data/demat/angelone.json"),
};

export type Provider =
  | keyof typeof BANK_PROVIDERS
  | keyof typeof DEMAT_PROVIDERS;
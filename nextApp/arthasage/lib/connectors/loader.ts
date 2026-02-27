import { BANK_PROVIDERS, DEMAT_PROVIDERS, Provider } from "./providers";

export async function loadProvider(provider: Provider) {
  if (provider in BANK_PROVIDERS) {
    const module =
      await BANK_PROVIDERS[provider as keyof typeof BANK_PROVIDERS]();

    return { type: "bank" as const, data: module.default };
  }

  if (provider in DEMAT_PROVIDERS) {
    const module =
      await DEMAT_PROVIDERS[provider as keyof typeof DEMAT_PROVIDERS]();

    return { type: "demat" as const, data: module.default };
  }

  throw new Error("Unknown provider");
}
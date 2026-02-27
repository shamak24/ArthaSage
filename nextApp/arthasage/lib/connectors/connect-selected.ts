import { connectProvider } from "./connect-provider";
import type { Provider } from "./providers";

export async function connectSelectedProviders(
  userId: string,
  providers: Provider[]
) {
  for (const provider of providers) {
    await connectProvider(userId, provider);
  }
}
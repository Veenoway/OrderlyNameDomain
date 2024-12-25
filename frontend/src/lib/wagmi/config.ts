import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createConfig, http } from "wagmi";
import { baseSepolia, mainnet, sepolia } from "wagmi/chains";
import { cookieStorage, createStorage } from "wagmi/storage";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

export const networks = [mainnet, sepolia];

// Configuration Wagmi v2
export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http("https://sepolia.base.org"),
  },
  storage: createStorage({
    storage: cookieStorage,
  }),
});

export const wagmiAdapter = new WagmiAdapter({
  wagmiConfig,
  ssr: true,
  projectId,
  networks,
});

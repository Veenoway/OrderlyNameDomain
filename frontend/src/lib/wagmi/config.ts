/* eslint-disable @typescript-eslint/no-explicit-any */
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { cookieStorage, createStorage } from "wagmi";
import { baseSepolia } from "wagmi/chains";

export const projectId = "71cb70b160a3c0bdf69a9b358d250c4c";

if (!projectId) throw new Error("Project ID is not defined");

export const networks = [baseSepolia];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }) as unknown as any,
  ssr: true,
  networks,
  projectId,
});

export const config = wagmiAdapter.wagmiConfig;

import injectedModule from "@web3-onboard/injected-wallets";
import { init } from "@web3-onboard/react";
import { http } from "viem";
import { baseSepolia } from "viem/chains";
import { createConfig } from "wagmi";

export const web3Onboard = init({
  wallets: [injectedModule()],
  chains: [
    {
      id: baseSepolia.id,
      token: "ETH",
      label: "Base Sepolia",
      rpcUrl: "https://sepolia.base.org",
    },
  ],
  appMetadata: {
    name: "Orderly Name Service",
    description: "Register your .orderly domain",
  },
});

export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http("https://sepolia.base.org"),
  },
});

"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Web3OnboardProvider } from "@web3-onboard/react";
import { FC, PropsWithChildren } from "react";
import { WagmiProvider } from "wagmi";
import { wagmiConfig, web3Onboard } from "./config";

const queryClient = new QueryClient();

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Web3OnboardProvider web3Onboard={web3Onboard}>
          {children}
        </Web3OnboardProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

"use client";

import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { mainnet } from "wagmi/chains";
import { cookieToInitialState } from "wagmi/storage";
import { wagmiAdapter, wagmiConfig } from "./config";

const queryClient = new QueryClient();

const metadata = {
  name: "Name Service dApp",
  description: "Application avec Name Service",
  url: "https://votreapp.com",
  icons: ["https://votre-icone.com/icon.png"],
};

export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId: "lorjfoeprgjporf",
  networks: [mainnet],
  defaultNetwork: mainnet,
  metadata,
  features: {
    analytics: true,
  },
});

function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(wagmiConfig, cookies);

  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;

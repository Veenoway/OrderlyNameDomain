"use client";

import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { wagmiAdapter } from "./config";

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
  networks: [baseSepolia],
  defaultNetwork: baseSepolia,
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
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies);

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;

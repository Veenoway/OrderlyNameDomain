"use client";

import { useNameService } from "@/hooks/useNameService";
import { useAppKit } from "@reown/appkit/react";
import { useEffect, useState } from "react";
import { baseSepolia } from "viem/chains";
import { useAccount, useChainId, useSwitchChain } from "wagmi";

export function WalletConnection() {
  const { open } = useAppKit();
  const { address, isConnecting } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { mainDomain } = useNameService("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (address) {
      setIsInitialLoading(false);
    }
  }, [address, mainDomain]);

  const getDisplayText = () => {
    if (isConnecting || isInitialLoading) return "Loading...";
    return (mainDomain as string[])?.[1]
      ? (mainDomain as string[])[1] + ".orderly"
      : `${address?.slice(0, 6)}...${address?.slice(-4)}`;
  };

  const isWrongNetwork = chainId !== baseSepolia.id;

  const handleSwitchNetwork = async () => {
    try {
      await switchChainAsync({
        chainId: baseSepolia.id,
      });
    } catch (err) {
      console.error("Failed to switch network:", err);
    }
  };

  const handleConnect = async () => {
    try {
      await open();
    } catch (err) {
      console.error("Failed to connect:", err);
    }
  };

  const handleDisconnect = async () => {
    try {
      await open(); // AppKit gère la déconnexion dans le modal
    } catch (err) {
      console.error("Failed to disconnect:", err);
    }
  };

  if (address && isWrongNetwork) {
    return (
      <button
        onClick={handleSwitchNetwork}
        className="bg-[url('/assets/orderly-gradient.png')] bg-center hover:bg-top bg-no-repeat bg-cover
          flex items-center rounded-full w-fit h-[50px] border border-borderColor px-8 py-5
          text-lg text-white font-medium transition-all duration-300 ease-in-out
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Switch to Base Sepolia
      </button>
    );
  }

  return (
    <div>
      {!address && (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className={`bg-[url('/assets/orderly-gradient.png')] bg-center hover:bg-top bg-no-repeat bg-cover
             flex items-center rounded-full mx-auto w-fit h-[50px] border border-borderColor px-8 py-5
             text-lg text-white font-medium transition-all duration-300 ease-in-out
             ${isConnecting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Connect Wallet
        </button>
      )}

      {address && !isWrongNetwork && (
        <div className="flex items-center gap-4">
          <button
            onClick={handleDisconnect}
            className={`bg-[url('/assets/orderly-gradient.png')] bg-center hover:bg-top bg-no-repeat bg-cover
                flex items-center rounded-full mx-auto w-fit h-[50px] border border-borderColor px-8 py-5
                text-lg text-white font-semibold transition-all duration-300 ease-in-out
                ${isConnecting || isInitialLoading ? "animate-pulse" : ""}`}
          >
            {getDisplayText()}
          </button>
        </div>
      )}
    </div>
  );
}

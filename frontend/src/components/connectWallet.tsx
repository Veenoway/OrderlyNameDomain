"use client";
import { useNameService } from "@/hooks/useNameService";
import { useConnectWallet } from "@web3-onboard/react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export function WalletConnection() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const { address } = useAccount();
  const { mainDomain } = useNameService("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (wallet && mainDomain !== undefined) {
      setIsInitialLoading(false);
    }
  }, [wallet, mainDomain]);

  const getDisplayText = () => {
    if (connecting || isInitialLoading) return "Loading...";
    return (mainDomain as string[])?.[1]
      ? (mainDomain as string[])[1] + ".orderly"
      : `${address?.slice(0, 6)}...${address?.slice(-4)}`;
  };

  return (
    <div>
      {!wallet && (
        <button
          onClick={() => connect()}
          disabled={connecting}
          className={`bg-[url('/assets/orderly-gradient.png')] bg-center hover:bg-top bg-no-repeat bg-cover
             flex items-center rounded-full mx-auto w-fit h-[50px] border border-borderColor px-8 py-5
             text-lg text-white font-medium transition-all duration-300 ease-in-out
             ${connecting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Connect Wallet
        </button>
      )}

      {wallet && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => disconnect(wallet)}
            className={`bg-[url('/assets/orderly-gradient.png')] bg-center hover:bg-top bg-no-repeat bg-cover
                flex items-center rounded-full mx-auto w-fit h-[50px] border border-borderColor px-8 py-5
                text-lg text-white font-semibold transition-all duration-300 ease-in-out
                ${connecting || isInitialLoading ? "animate-pulse" : ""}`}
          >
            {getDisplayText()}
          </button>
        </div>
      )}
    </div>
  );
}

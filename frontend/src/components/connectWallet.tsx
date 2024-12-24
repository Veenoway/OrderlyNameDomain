"use client";
import { useNameService } from "@/hooks/useNameService";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import { useEffect, useState } from "react";
import { baseSepolia } from "viem/chains";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

export function WalletConnection() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [{ connectedChain }, setChain] = useSetChain();
  const { address } = useAccount();
  const { connectAsync: connectWagmi } = useConnect();
  const { mainDomain } = useNameService("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Synchroniser Web3-Onboard avec Wagmi
  useEffect(() => {
    if (wallet) {
      // Connecter Wagmi quand Web3-Onboard est connecté
      connectWagmi({
        connector: injected(),
      });
    }
  }, [wallet, connectWagmi]);

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

  const isWrongNetwork =
    connectedChain?.id !== `0x${baseSepolia.id.toString(16)}`;

  const handleSwitchNetwork = async () => {
    try {
      await setChain({ chainId: `0x${baseSepolia.id.toString(16)}` });
    } catch (err) {
      console.error("Failed to switch network:", err);
    }
  };

  if (wallet && isWrongNetwork) {
    return (
      <button
        onClick={handleSwitchNetwork}
        className="bg-[url('/assets/orderly-gradient.png')] bg-center hover:bg-top bg-no-repeat bg-cover
          flex items-center rounded-full w-fit h-[50px] border border-borderColor px-8 py-5
          text-lg text-white font-medium transition-all duration-300 ease-in-out"
      >
        Switch to Base Sepolia
      </button>
    );
  }

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

      {wallet && !isWrongNetwork && (
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

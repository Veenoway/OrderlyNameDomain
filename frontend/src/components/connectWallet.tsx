"use client";
import { useNameService } from "@/hooks/useNameService";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { metaMask } from "wagmi/connectors";

export function WalletConnection() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { mainDomain } = useNameService("");

  console.log("mainDomain", mainDomain);

  return (
    <div>
      {!isConnected ? (
        <button
          onClick={() => connect({ connector: metaMask() })}
          className={`bg-[url('/assets/orderly-gradient.png')] bg-center hover:bg-top bg-no-repeat bg-cover
             flex items-center rounded-full mx-auto w-fit h-[50px] border border-borderColor px-8 py-5
             text-lg text-white font-medium transition-all duration-300 ease-in-out`}
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <button
            onClick={() => disconnect()}
            className={`bg-[url('/assets/orderly-gradient.png')] bg-center hover:bg-top bg-no-repeat bg-cover
                flex items-center rounded-full mx-auto w-fit h-[50px] border border-borderColor px-8 py-5
                text-lg text-white font-semibold transition-all duration-300 ease-in-out`}
          >
            {(mainDomain as string[])?.[1]
              ? (mainDomain as string[])?.[1] + ".orderly"
              : `${address?.slice(0, 6)}...
            ${address?.slice(-4)}`}
          </button>
        </div>
      )}
    </div>
  );
}

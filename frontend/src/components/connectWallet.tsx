"use client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export function WalletConnection() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div>
      {!isConnected ? (
        <button
          onClick={() => connect({ connector: injected() })}
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
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </button>
        </div>
      )}
    </div>
  );
}

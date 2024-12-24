// hooks/useWalletConnection.ts
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import { useEffect, useState } from "react";
import { baseSepolia } from "viem/chains";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

export function useWalletConnection() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [{ connectedChain }, setChain] = useSetChain();
  const { address } = useAccount();
  const { connectAsync: connectWagmi } = useConnect();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (wallet) {
      connectWagmi({
        connector: injected(),
      });
    }
  }, [wallet, connectWagmi]);

  const isConnected = !!wallet;
  const isSepoliaBaseChain =
    connectedChain?.id === `0x${baseSepolia.id.toString(16)}`;

  const handleConnect = async () => {
    try {
      await connect();
    } catch (err) {
      console.error("Failed to connect:", err);
    }
  };

  const handleDisconnect = async () => {
    if (wallet) {
      await disconnect(wallet);
      setIsInitialLoading(true);
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      await setChain({ chainId: `0x${baseSepolia.id.toString(16)}` });
    } catch (err) {
      console.error("Failed to switch network:", err);
    }
  };

  return {
    isConnected,
    isSepoliaBaseChain,
    isConnecting: connecting,
    isInitialLoading,
    address,
    wallet,

    connect: handleConnect,
    disconnect: handleDisconnect,
    switchNetwork: handleSwitchNetwork,
  };
}

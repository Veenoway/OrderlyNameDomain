"use client";
import {
  ORDERLY_DOMAIN_ABI,
  ORDERLY_DOMAIN_ADDRESS,
} from "@/constants/contract";
import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

const pythConnection = new EvmPriceServiceConnection(
  "https://hermes.pyth.network/"
);

export function useNameService(name: string) {
  const { address } = useAccount();

  const { data: price } = useReadContract({
    address: ORDERLY_DOMAIN_ADDRESS,
    abi: ORDERLY_DOMAIN_ABI,
    functionName: "getRegistrationPriceETH",
  });

  const { data: isDomainAvailable, isLoading: isDomainLoading } =
    useReadContract({
      address: ORDERLY_DOMAIN_ADDRESS,
      abi: ORDERLY_DOMAIN_ABI,
      functionName: "isDomainAvailable",
      args: [name],
    });

  const { data: domainList } = useReadContract({
    address: ORDERLY_DOMAIN_ADDRESS,
    abi: ORDERLY_DOMAIN_ABI,
    functionName: "getDomainsByOwner",
    args: [address],
  });

  const { data: mainDomain } = useReadContract({
    address: ORDERLY_DOMAIN_ADDRESS,
    abi: ORDERLY_DOMAIN_ABI,
    functionName: "getPrimaryDomain",
    args: [address],
  });

  const {
    writeContract,
    data: hash,
    isPending: loader,
    error,
  } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  console.log("error", error, loader, hash, isSuccess);
  const registerDomain = async (years: number) => {
    console.log("Registration Details", [name, address, years, []]);

    try {
      const priceFeeds = await pythConnection.getPriceFeedsUpdateData([
        "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
      ]);

      console.log("priceFeeds", priceFeeds);

      const result = await writeContract({
        address: ORDERLY_DOMAIN_ADDRESS,
        abi: ORDERLY_DOMAIN_ABI,
        functionName: "registerDomain",
        args: [name, address, years],
        value: price,
      });

      console.log("Transaction Result:", result);
      return result;
    } catch (e) {
      console.error("Registration Error:", e);
      throw e;
    }
  };

  return {
    price,
    domainList,
    isDomainAvailable,
    isDomainLoading,
    registerDomain,
    mainDomain,
    isLoading,
    isSuccess,
  };
}

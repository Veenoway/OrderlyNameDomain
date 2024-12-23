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

  const { data: price, error: priceError } = useReadContract({
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

  const {
    isLoading,
    isSuccess,
    error: errorName,
  } = useWaitForTransactionReceipt({
    hash,
  });
  console.log("error", errorName, priceError);
  const registerDomain = async (years: number, isMainDomain: boolean) => {
    console.log("Registration Details", [name, address, years, isMainDomain]);

    try {
      const priceFeeds = await pythConnection.getPriceFeedsUpdateData([
        "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
      ]);

      // console.log("priceFeeds", priceFeeds);

      const domainName = name.toLowerCase();

      const result = await writeContract({
        address: ORDERLY_DOMAIN_ADDRESS,
        abi: ORDERLY_DOMAIN_ABI,
        functionName: "registerDomain",
        args: [domainName, address, years, isMainDomain],
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
    price: Number(price) / 10 ** 18,
    domainList,
    isDomainAvailable,
    isDomainLoading,
    registerDomain,
    mainDomain,
    isLoading,
    isSuccess,
  };
}

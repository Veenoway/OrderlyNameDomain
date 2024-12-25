"use client";
import {
  ORDERLY_DOMAIN_ABI,
  ORDERLY_DOMAIN_ADDRESS,
} from "@/constants/contract";
import { useAppKit } from "@reown/appkit/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export function useNameService(name: string) {
  const { address, isConnected } = useAccount();
  const queryClient = useQueryClient();
  const { open } = useAppKit();

  const { data: price } = useReadContract({
    address: ORDERLY_DOMAIN_ADDRESS,
    abi: ORDERLY_DOMAIN_ABI,
    functionName: "getRegistrationPriceETH",
    query: {
      enabled: isConnected,
    },
  });

  const { data: isDomainAvailable, isLoading: isDomainLoading } =
    useReadContract({
      address: ORDERLY_DOMAIN_ADDRESS,
      abi: ORDERLY_DOMAIN_ABI,
      functionName: "isDomainAvailable",
      args: [name],
      query: {
        enabled: isConnected && Boolean(name),
      },
    });

  const { data: domainList } = useReadContract({
    address: ORDERLY_DOMAIN_ADDRESS,
    abi: ORDERLY_DOMAIN_ABI,
    functionName: "getDomainsByOwner",
    args: [address],
    query: {
      enabled: isConnected && Boolean(address),
    },
  });

  const { data: mainDomain } = useReadContract({
    address: ORDERLY_DOMAIN_ADDRESS,
    abi: ORDERLY_DOMAIN_ABI,
    functionName: "getPrimaryDomain",
    args: [address],
    query: {
      enabled: isConnected && Boolean(address),
    },
  });

  const { writeContract, data: hash } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const registerDomain = async (years: number, isMainDomain: boolean) => {
    if (!isConnected || !address) {
      await open();
      return;
    }

    try {
      const domainName = name.toLowerCase();

      const result = await writeContract({
        address: ORDERLY_DOMAIN_ADDRESS,
        abi: ORDERLY_DOMAIN_ABI,
        functionName: "registerDomain",
        args: [domainName, address, years, isMainDomain],
        value: price as bigint,
      });

      console.log("Transaction Result:", result);
      return result;
    } catch (e) {
      console.error("Registration Error:", e);
      throw e;
    }
  };

  useEffect(() => {
    if (isSuccess) {
      // Invalidate queries after successful transaction
      const queries = [
        "getDomainsByOwner",
        "getPrimaryDomain",
        "isDomainAvailable",
      ].map((functionName) => ({
        queryKey: [
          "readContract",
          {
            address: ORDERLY_DOMAIN_ADDRESS,
            functionName,
          },
        ],
      }));

      queries.forEach((query) => queryClient.invalidateQueries(query));
    }
  }, [isSuccess, queryClient]);

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

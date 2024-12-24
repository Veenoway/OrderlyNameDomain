"use client";
import {
  ORDERLY_DOMAIN_ABI,
  ORDERLY_DOMAIN_ADDRESS,
} from "@/constants/contract";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

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

  const { writeContract, data: hash } = useWriteContract();

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

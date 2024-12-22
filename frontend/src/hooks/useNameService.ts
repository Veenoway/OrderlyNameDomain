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

  const { writeContract, data: hash } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const registerDomain = async () => {
    console.log("Registration Details", { address, name, price });

    try {
      const result = await writeContract({
        address: ORDERLY_DOMAIN_ADDRESS,
        abi: ORDERLY_DOMAIN_ABI,
        functionName: "registerDomain",
        args: [name, address, []],
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
    isLoading,
    isSuccess,
  };
}

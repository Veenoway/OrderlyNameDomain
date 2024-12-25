"use client";
import { useNameService } from "@/hooks/useNameService";
import { isAlphanumeric } from "@/utils/format";
import { useAppKit } from "@reown/appkit/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  FiArrowRight,
  FiCheck,
  FiMinus,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { PiXLogo } from "react-icons/pi";
import { baseSepolia } from "viem/chains";
import { useAccount, useChainId, useSwitchChain } from "wagmi";

enum DomainState {
  INITIAL = 0,
  REGISTER = 1,
  SUCCESS = 2,
}

export const Home = () => {
  const [domainName, setDomainName] = useState("");
  const [isMainDomain, setIsMainDomain] = useState(false);
  const [showBuyDomain, setShowBuyDomain] = useState(DomainState.INITIAL);
  const [registerForYears, setRegisterForYears] = useState(1);

  const { open } = useAppKit();
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const {
    price,
    registerDomain,
    isDomainAvailable,
    isLoading,
    isSuccess,
    isDomainLoading,
  } = useNameService(domainName);

  const handleSwitchNetwork = async () => {
    try {
      await switchChain({ chainId: baseSepolia.id });
    } catch (err) {
      console.error("Failed to switch network:", err);
    }
  };

  const handleDomainTransition = () => {
    if (isDomainAvailable && !isDomainLoading) {
      setShowBuyDomain(DomainState.REGISTER);
    }
  };

  const isWrongNetwork = chainId !== baseSepolia.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (address) {
      if (isWrongNetwork) {
        handleSwitchNetwork();
        return;
      }
      try {
        await registerDomain(registerForYears, isMainDomain);
      } catch (e) {
        console.log("e", e);
      }
    } else {
      await open();
    }
  };

  const incrementYears = () => {
    setRegisterForYears((prev) => {
      if (prev === 4) return prev;
      return prev + 1;
    });
  };

  const decreaseYears = () => {
    setRegisterForYears((prev) => {
      if (prev === 1) return prev;
      return prev - 1;
    });
  };

  const isValidFormat = useMemo(() => {
    return isAlphanumeric(domainName);
  }, [domainName]);

  return (
    <main
      className="h-screen w-screen flex flex-col items-center justify-center transition-all duration-1000 ease-in-out"
      style={{
        backgroundImage: `url('/layers/layer-3.svg'),url('/layers/layer-4.svg')`,
        backgroundPosition: showBuyDomain
          ? "center left, top right"
          : "center left, center right",
        backgroundSize: showBuyDomain ? "35%, 45%" : "30%, 40%",
        backgroundRepeat: "no-repeat, no-repeat",
        backgroundBlendMode: "overlay, overlay",
      }}
    >
      <div className={`max-w-[700px] w-[90%] overflow-hidden`}>
        <div className="flex w-full overflow-hidden">
          <div
            className={` ${
              showBuyDomain === DomainState.INITIAL
                ? "opacity-0 -translate-x-full"
                : "opacity-100 -translate-x-0"
            } pb-2 transition-all duration-500 ease-in-out min-w-[700px] w-[90%]`}
          >
            <div
              className={`bg-[url('/assets/orderly-gradient.png')] bg-no-repeat bg-cover flex items-center rounded-full mx-auto w-fit h-[90px] border border-borderColor px-8 py-5   `}
            >
              <img
                src="/assets/orderly-mascot.png"
                height={70}
                width={70}
                alt="Orderly mascot"
              />
              <p className="text-white font-bold text-4xl ml-5">
                {domainName}.orderly
              </p>
            </div>
            <div
              className={`${
                showBuyDomain === DomainState.SUCCESS
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 pointer-events-none scale-90 translate-y-10"
              } absolute left-0 right-0 transition-all duration-700 ease-in-out leading-tight w-full text-6xl text-white font-semibold text-center mt-[60px]`}
            >
              <p>
                Congrats {domainName}! <br />
                You just join the Order!
              </p>
              <button
                onClick={() => {}}
                className="text-2xl mt-10 text-white font-medium flex items-center justify-between mx-auto"
              >
                <Link href="">
                  <span className="flex items-center justify-center">
                    <PiXLogo className="mr-2.5" /> Share on X now!
                  </span>
                </Link>
              </button>
            </div>
            <div
              className={`rounded-2xl bg-secondary border border-borderColor shadow-sm shadow-brandColor p-10 
                mx-auto mt-[60px] transition-all duration-1000 ease-in-out ${
                  showBuyDomain === DomainState.SUCCESS
                    ? "opacity-0 translate-x-[101%] pointer-events-none"
                    : "opacity-100"
                } transition-all duration-300 ease-in-out w-[99%]`}
            >
              <div className="flex w-full gap-10 justify-around">
                <div className="">
                  <p className="text-slate-400 text-base font-semibold mb-3 uppercase">
                    Claim for
                  </p>
                  <div className="flex items-center gap-5">
                    <button
                      onClick={decreaseYears}
                      className="bg-terciary border h-[30px] w-[30px] flex items-center justify-center border-borderColor rounded-full text-xl text-white"
                    >
                      <FiMinus />
                    </button>
                    <p className="text-3xl text-white font-bold ">
                      {registerForYears} year
                    </p>
                    <button
                      onClick={incrementYears}
                      className="bg-terciary border h-[30px] w-[30px] flex items-center justify-center border-borderColor rounded-full text-xl text-white"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>
                <div className="">
                  <p className="text-slate-400 uppercase text-base font-semibold mb-3">
                    Amount
                  </p>
                  <div className="flex items-center gap-5">
                    <p className="text-3xl text-white font-bold">
                      {(price * registerForYears).toFixed(6)} ETH{" "}
                      <span className="text-xl text-slate-400 font-semibold">
                        {2 * registerForYears} USD
                      </span>
                    </p>
                  </div>
                </div>{" "}
              </div>
              <div className="flex items-center w-fit  mt-10 mb-5">
                <button
                  onClick={() => setIsMainDomain((prev) => !prev)}
                  className={`flex items-center`}
                >
                  <div className="h-5 w-5 flex items-center justify-center rounded bg-terciary border border-borderColor ">
                    {isMainDomain ? (
                      <FiCheck className="text-white text-sm" />
                    ) : null}{" "}
                  </div>
                  <p className="text-slate-300 ml-4 font-medium">
                    Set as Primary Name
                  </p>
                </button>
              </div>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !domainName}
                className="w-full bg-blue-500 h-[60px] text-white bg-[url('/assets/orderly-gradient.png')] 
                  bg-no-repeat bg-cover bg-center rounded-2xl py-2 px-4 hover:bg-top transition-all duration-300 ease-in-out
                  disabled:opacity-50 text-xl font-medium"
              >
                {!address
                  ? "Connect Wallet"
                  : isWrongNetwork
                  ? "Switch to Base Sepolia"
                  : isLoading
                  ? "Registering..."
                  : "Register Domain"}
              </button>
            </div>
          </div>
          <div
            className={`${
              showBuyDomain === DomainState.INITIAL
                ? "opacity-100 -translate-x-full"
                : "opacity-100 translate-x-0"
            }
               transition-all duration-500 ease-in-out min-w-[600px]`}
          >
            <label className="block mb-5 text-white font-bold text-2xl">
              Your Orderly identity starts here.
            </label>
            <div
              className={`bg-secondary w-full rounded-2xl border border-borderColor px-8 py-5 overflow-hidden ${
                domainName ? "h-fit" : "h-[90px]"
              }   `}
            >
              <div className="h-[70px] flex items-center w-full pb-5">
                <input
                  type="text"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  placeholder="Search for a name"
                  className="w-full  text-2xl text-white placeholder:text-slate-100 font-medium"
                  disabled={isLoading}
                />
                {domainName ? (
                  <button onClick={() => setDomainName("")}>
                    <IoClose className="text-3xl text-white ml-3 " />{" "}
                  </button>
                ) : (
                  <FiSearch className="text-3xl text-white ml-3 " />
                )}
              </div>
              <div className="bg-borderColor w-full h-0.5 mb-5" />
              {(!isValidFormat && domainName) ||
              domainName.length <= 2 ||
              domainName.length > 20 ? (
                <div className="h-[68px]  w-full">
                  <p className="text-sm text-white font-semibold uppercase">
                    Not Available
                  </p>
                  <p className="text-base text-white font-medium mt-3">
                    {domainName.length <= 2
                      ? "Name too short"
                      : domainName.length > 20
                      ? "Name too long"
                      : "Only letters and numbers are allowed"}
                  </p>
                </div>
              ) : isDomainLoading ? (
                <div className="flex h-[68px] items-center justify-center w-full">
                  <AiOutlineLoading3Quarters className="animate-spin text-white font-medium text-2xl" />
                </div>
              ) : (
                <>
                  <p className="text-sm text-white font-semibold uppercase">
                    {isDomainAvailable ? "Available" : "Not available"}
                  </p>
                  <button
                    onClick={handleDomainTransition}
                    className="flex items-center justify-between mt-3 pb-3 w-full"
                  >
                    <p className="text-base text-white font-medium">
                      {domainName.toLocaleLowerCase()}.orderly
                    </p>
                    {isDomainAvailable ? (
                      <FiArrowRight className="text-xl text-white mx-3" />
                    ) : (
                      <p className="text-base text-slate-300 font-semibold">
                        Already registered
                      </p>
                    )}
                  </button>{" "}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

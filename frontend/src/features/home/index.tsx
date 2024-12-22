"use client";
import { useNameService } from "@/hooks/useNameService";
import { useState } from "react";
import { FiArrowRight, FiMinus, FiPlus, FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

enum DomainState {
  INITIAL = 0,
  PREPARING_OUT = 1,
  PREPARING_IN = 2,
  BUY_DOMAIN = 3,
}

export const Home = () => {
  const [domainName, setDomainName] = useState("");
  const [showBuyDomain, setShowBuyDomain] = useState(DomainState.INITIAL);
  const [registerForYears, setRegisterForYears] = useState(1);
  const {
    price,
    registerDomain,
    domainList,
    isDomainAvailable,
    isLoading,
    isSuccess,
    isDomainLoading,
  } = useNameService(domainName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerDomain();
    setDomainName("");
  };

  const handleDomainTransition = () => {
    if (isDomainAvailable && !isDomainLoading) {
      setShowBuyDomain(DomainState.PREPARING_OUT);

      const buyDomainTimeout = setTimeout(() => {
        setShowBuyDomain(DomainState.BUY_DOMAIN);
      }, 1000);

      return () => {
        clearTimeout(buyDomainTimeout);
      };
    }
  };

  const incrementYears = () => {
    setRegisterForYears((prev) => {
      if (prev === 3) return prev;
      return prev + 1;
    });
  };

  const decreaseYears = () => {
    setRegisterForYears((prev) => {
      if (prev === 1) return prev;
      return prev - 1;
    });
  };

  return (
    <main
      className="h-screen w-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url('/layers/layer-3.svg'),url('/layers/layer-4.svg')`,
        backgroundPosition: "center left, center right",
        backgroundSize: "30%, 40%",
        backgroundRepeat: "no-repeat, no-repeat",
        backgroundBlendMode: "overlay, overlay",
      }}
    >
      <div className="w-[600px] overflow-hidden ">
        <div className="flex w-full overflow-hidden">
          <div
            className={` ${
              showBuyDomain === DomainState.PREPARING_OUT
                ? "opacity-100 -translate-x-0"
                : showBuyDomain === DomainState.BUY_DOMAIN
                ? "opacity-100 -translate-x-0"
                : "opacity-0 -translate-x-full"
            } pb-2 transition-all duration-500 ease-in-out min-w-[600px]`}
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
            <div className="rounded-2xl bg-secondary border border-borderColor shadow-sm shadow-brandColor p-10 w-[99%] mx-auto mt-[60px]">
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
                      {(Number(price) / 10 ** 18).toFixed(5)} ETH
                    </p>
                  </div>
                </div>{" "}
              </div>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !domainName}
                className="w-full bg-blue-500 mt-10 h-[60px] text-white bg-[url('/assets/orderly-gradient.png')] 
                bg-no-repeat bg-cover bg-center rounded-2xl py-2 px-4 hover:bg-top transition-all duration-300 ease-in-out
                 disabled:opacity-50 text-xl font-medium"
              >
                {isLoading ? "Registering..." : "Register Domain"}
              </button>
            </div>
          </div>{" "}
          <div
            className={`${
              showBuyDomain === DomainState.PREPARING_OUT
                ? "opacity-0 translate-x-0"
                : showBuyDomain === DomainState.INITIAL
                ? "opacity-100 -translate-x-full"
                : "opacity-100 translate-x-0"
            }
               transition-all duration-500 ease-in-out min-w-[600px]`}
          >
            <label className="block mb-5 text-white font-bold text-xl">
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
                  placeholder="SEARCH FOR A NAME"
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
              <p className="text-sm text-white font-semibold uppercase">
                {isDomainAvailable && !isDomainLoading
                  ? "Available"
                  : "Not available"}
              </p>
              <button
                onClick={handleDomainTransition}
                className="flex items-center justify-between mt-3 pb-3 w-full"
              >
                <p className="text-base text-white font-medium">
                  {domainName}.orderly
                </p>
                {isDomainAvailable && !isDomainLoading ? (
                  <FiArrowRight className="text-xl text-white mx-3" />
                ) : (
                  "Registered"
                )}
              </button>
            </div>
          </div>
        </div>
        {isSuccess && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
            Domain registered successfully!
          </div>
        )}
      </div>
    </main>
  );
};

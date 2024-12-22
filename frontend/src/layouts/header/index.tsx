import { WalletConnection } from "@/components/connectWallet";

export const Header = () => {
  return (
    <div className="h-[90px] fixed top-0 p-5 w-full flex items-center justify-between">
      <img src="/assets/orderly-logo-text.webp" width={300} />
      <WalletConnection />
    </div>
  );
};

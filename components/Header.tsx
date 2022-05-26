import Link from "next/link";
import { WalletMultiButton } from "./WalletConnect";

export const Header = () => {
  return (
    <header className="flex h-20 flex-col justify-center bg-black">
      <div className="mx-auto flex w-full max-w-screen-2xl justify-between px-4 sm:px-16 ">
        <Link href="/">
          <h1 className="flex cursor-pointer py-2 text-lg font-extrabold text-primary-500 sm:text-3xl">
            #BUYMEAPIZZA
          </h1>
        </Link>
        <WalletMultiButton />
      </div>
    </header>
  );
};

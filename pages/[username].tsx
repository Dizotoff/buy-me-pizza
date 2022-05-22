import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import DonationsPanel from "../components/DonationsPanel";

const UserPage: NextPage = () => {
  return (
    <div className="w-full bg-black text-white antialiased">
      <Head>
        <title>Buymeapizza</title>
        <meta
          name="description"
          content="SEAMLESS DONATIONS IN CRYPTO FOR FREE"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="flex h-20 flex-col justify-center bg-black">
        <div className="mx-auto flex w-full max-w-screen-2xl justify-between px-4 sm:px-16 ">
          <h1 className="flex py-2 text-lg font-extrabold text-primary-500 sm:text-3xl">
            #BUYMEAPIZZA
          </h1>
          <button className="rounded-sm bg-primary-500  px-2 py-1 text-sm font-bold text-white sm:py-3 sm:px-5 sm:text-base">
            CONNECT YOUR WALLET
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-screen-2xl px-4 sm:px-16">
        <div className="flex items-center justify-between py-6">
          <span className="flex w-fit items-center gap-6">
            <figure className="relative mx-auto h-28 w-28">
              <Image
                objectFit="cover"
                alt="avatar"
                layout="fill"
                src={"/images/pizza-toxic.png"}
              ></Image>
            </figure>
            <p className="text-xl font-extrabold text-primary-100">OG LOCK</p>
            <button className="rounded-sm bg-primary-500  px-3 py-2 text-sm font-bold text-white sm:py-3 sm:px-5 sm:text-base">
              UPDATE NAME
            </button>
          </span>
          <span className="flex items-center gap-6">
            <Image
              src="/icons/twitter.svg"
              alt="twitter"
              height={50}
              width={50}
            />
            <a className="cursor-pointer text-xl font-extrabold">
              SHARE ON TWITTER
            </a>
          </span>
        </div>

        <div className="grid min-h-screen grid-cols-2 pt-16">
          <DonationsPanel />
          <div className="flex max-h-96 items-center justify-center rounded-xl border border-neutral-700">
            <p className="text-xl font-extrabold text-primary-100">
              DONATION LEDGER
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserPage;

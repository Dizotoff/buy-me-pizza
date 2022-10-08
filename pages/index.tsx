import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import classNames from "classnames";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Button } from "../components/Button";
import DonationsPanel from "../components/DonationsPanel";
import { useGetUser, useSetUser } from "../context/AuthProvider";
import { supabase } from "../utils/supabaseClient";
import Lottie from "react-lottie";
import * as pizza1 from "../public/graphics/pizza-1.json";
import * as pizza2 from "../public/graphics/pizza-2.json";

const Home: NextPage = () => {
  const user = useGetUser();
  const setUser = useSetUser();
  const { setVisible } = useWalletModal();
  const router = useRouter();

  const [inputValue, setInputValue] = useState<string>("");

  const handleButtonClick = async () => {
    if (!user) {
      setVisible(true);
    } else if (inputValue !== "" && user) {
      const toastId = toast.loading("Claiming the username...");

      const { data, error } = await supabase
        .from("profiles")
        .update({ username: inputValue })
        .eq("id", user?.id)
        .single();

      if (error) {
        console.log("Failed to set username", error);
        toast.error("This username is already used");
      }

      toast.dismiss(toastId);

      if (data) {
        setUser({ ...user, username: data.username });
        router.push(`/${data.username}`);
      }
    }
  };

  const lottieAnimationPrimary = {
    loop: true,
    autoplay: true,
    //@ts-ignore
    animationData: pizza2.default,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const lottieAnimationSecondary = {
    loop: true,
    autoplay: true,
    //@ts-ignore
    animationData: pizza1.default,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      <Head>
        <title>Buy Me a Pizza</title>
        <meta
          name="description"
          content="SEAMLESS DONATIONS IN CRYPTO FOR FREE"
        />
      </Head>
      <Toaster />

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-16">
        {/*Accept donation in crypto... banner*/}
        <section className="grid grid-cols-1 items-center justify-between gap-20 py-12 sm:grid-cols-2  sm:gap-0 sm:py-52">
          <div>
            <h2 className="max-w-sm text-5xl font-extrabold text-white sm:max-w-2xl sm:text-6xl">
              ACCEPT DONATIONS IN CRYPTO ON YOUR WEBSITE{" "}
              <span className="text-primary-500">FOR FREE</span>
            </h2>
            <p className="pt-3 text-sm text-neutral-500 sm:text-base">
              Helping creators one pizza at a time
            </p>
            {!user?.username && (
              <div className="mt-16 box-content flex w-full flex-col items-center justify-center gap-4 align-middle sm:flex-row">
                <span
                  className={classNames(
                    "flex rounded-md border border-neutral-900 px-6 py-3"
                  )}
                >
                  <p className="pr-1 text-neutral-500">buymeapizza.xyz/</p>
                  <input
                    onChange={(event) => {
                      setInputValue(event.target.value);
                    }}
                    value={inputValue}
                    placeholder="yourname"
                    className="w-44 bg-black text-neutral-500 outline-none"
                  />
                </span>
                <Button onClick={() => handleButtonClick()}>
                  Claim Username
                </Button>
              </div>
            )}
          </div>
          <Lottie options={lottieAnimationPrimary} />
        </section>
        {/*How does this work... banner*/}
        <section className="flex flex-col items-center justify-between gap-40 sm:flex-row sm:gap-0">
          <div>
            <h2 className="text-3xl font-bold text-white">HOW DOES IT WORK?</h2>
            <ul className="list-inside list-disc text-neutral-300">
              <li className="pt-6 font-normal">Connect your wallet</li>
              <li className="pt-6">Claim your username</li>
              <li className="pt-6">
                Share your personal link so others can send you SOL or...
              </li>
              <li className="pt-6">
                Use our Javascript widget to handle donations right on your
                website (coming soon)
              </li>
            </ul>
            <p className="pt-6 font-bold text-primary-100">
              ...it&apos;s that easy!
            </p>
          </div>
          <DonationsPanel />
        </section>
        {/*Free forever... banner*/}
        <section className="grid grid-cols-2 items-center justify-between py-24 sm:py-52">
          <span>
            <h2 className="max-w-sm text-5xl font-extrabold text-white sm:max-w-2xl sm:text-6xl">
              FREE <span className="text-primary-500">FOREVER</span>
            </h2>
            <p className="pt-3 text-sm text-neutral-500 sm:text-base">
              0 % commission fees{" "}
            </p>
          </span>
          <Lottie options={lottieAnimationSecondary} />
        </section>
        {/*Meet the builders... banner*/}
        <section className="items-center justify-between pb-24 sm:pb-52">
          <h2 className="text-center text-7xl font-extrabold italic text-primary-100">
            MEET THE BUILDERS
          </h2>
          <div className="flex flex-col justify-center gap-36 pt-24 sm:flex-row">
            <article className="flex flex-col">
              <figure className="relative mx-auto h-60 w-60">
                <Image
                  objectFit="cover"
                  alt="pizza"
                  layout="fill"
                  src={"/images/maik.jpeg"}
                ></Image>
              </figure>
              <span className="flex justify-center gap-3 pt-4">
                <p className="text-xl font-medium">@MAIK</p>

                <a
                  target="_blank"
                  href="https://twitter.com/maikwithm"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/icons/twitter.svg"
                    alt="twitter"
                    height={30}
                    width={30}
                  />
                </a>
              </span>
            </article>
            <article className="flex flex-col">
              <figure className="relative mx-auto h-60 w-60">
                <Image
                  objectFit="cover"
                  alt="pizza"
                  layout="fill"
                  src={"/images/dmytro.png"}
                ></Image>
              </figure>
              <span className="flex justify-center gap-3 pt-4">
                <p className="text-xl font-medium">@DMYTRO</p>
                <a
                  target="_blank"
                  href="https://twitter.com/dmytro_eth"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/icons/twitter.svg"
                    alt="twitter"
                    height={30}
                    width={30}
                  />
                </a>
              </span>
            </article>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;

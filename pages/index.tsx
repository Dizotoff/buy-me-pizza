import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

const Home: NextPage = () => {
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
        {/*Accept donation in crypto... banner*/}
        <section className="flex items-center justify-between py-52">
          <div>
            <h2 className="max-w-sm text-5xl font-extrabold text-white sm:max-w-2xl sm:text-6xl">
              ACCEPT DONATIONS IN CRYPTO{" "}
              <span className="text-primary-500">FOR FREE</span>
            </h2>
            <p className="pt-3 text-sm text-neutral-500 sm:text-base">
              Helping creators one pizza at a time
            </p>
            <div className="mt-16 box-content flex w-full flex-col items-center justify-center gap-4 align-middle sm:flex-row">
              <span className="flex rounded-md border border-neutral-900 px-6  py-3">
                <p className="pr-1 text-neutral-500">buymeapizza.xyz/</p>
                <input
                  placeholder="yourname"
                  className="w-24 bg-black text-neutral-500 outline-none"
                />
              </span>
              <button className="rounded-sm bg-primary-500  px-3 py-2 text-sm font-bold text-white sm:py-3 sm:px-5 sm:text-base">
                CLAIM THIS USERNAME
              </button>
            </div>
          </div>
          <figure className="relative h-96 w-96">
            <Image
              objectFit="cover"
              alt="pizza"
              layout="fill"
              src={"/images/pizza-toxic.png"}
            ></Image>
          </figure>
        </section>
        {/*How does this work... banner*/}
        <section className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">HOW DOES IT WORK?</h2>
            <ul className="list-inside list-disc text-neutral-300">
              <li className="pt-6 font-normal">Connect your wallet</li>
              <li className="pt-6">Chose a flavor</li>
              <li className="pt-6">Press donate</li>
            </ul>
            <p className="pt-6 font-bold text-primary-100">
              ...it&apos;s that easy!
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">
              DONATE SOME PIZZAS TO JOHN
            </h2>
            <div>
              <article>
                <h3>$ 5</h3>
                <p className="text-neutral-700">(0.58 sol)</p>
                <figure className="relative h-20 w-20">
                  <Image
                    objectFit="cover"
                    alt="pizza"
                    layout="fill"
                    src={"/images/pizza-toxic.png"}
                  ></Image>
                </figure>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer></footer>
    </div>
  );
};

export default Home;

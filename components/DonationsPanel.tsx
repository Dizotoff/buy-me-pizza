import React from "react";
import Image from "next/image";

const DonationsPanel = ({}) => {
  return (
    <div className="max-w-xl">
      <h2 className="text-center text-3xl font-bold text-white">
        DONATE SOME PIZZAS TO JOHN
      </h2>
      <div className="grid grid-cols-4 gap-8 py-10">
        {[1, 2, 3, 4].map((index) => (
          <article
            key={index}
            className="cursor-pointer rounded-lg border-2 border-black px-2 py-3 hover:border-primary-500"
          >
            <h3 className="text-center">$ 5</h3>
            <p className="text-center text-neutral-700">(0.58 sol)</p>
            <figure className="relative mx-auto mt-5 h-14 w-14 sm:h-20 sm:w-20">
              <Image
                objectFit="cover"
                alt="pizza"
                layout="fill"
                src={"/images/pizza-toxic.png"}
              ></Image>
            </figure>
          </article>
        ))}
      </div>
      <div className="flex justify-around">
        <button className="rounded-sm border border-primary-500 px-3 py-2 text-sm font-bold text-white sm:py-3 sm:px-5 sm:text-base">
          ADD YOURS{" "}
        </button>
        <button className="rounded-sm bg-primary-500 px-3 py-2 text-sm font-bold text-white sm:py-3 sm:px-5 sm:text-base">
          DONATE{" "}
        </button>
      </div>
    </div>
  );
};

export default DonationsPanel;

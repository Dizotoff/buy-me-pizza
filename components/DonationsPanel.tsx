import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "./Button";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { SystemProgram, Transaction, PublicKey } from "@solana/web3.js";
import { useGetSolPrice, useGetUser } from "../context/AuthProvider";
import classNames from "classnames";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { supabase } from "../utils/supabaseClient";

const donationOptionsUSD = [1, 5, 10, 20];

const getSolFromUSD = (usdAmount: number, solPrice: number) => {
  const solAmount = ((1 * usdAmount) / solPrice).toFixed(2);
  return solAmount;
};

interface Donation {
  id: number;
  usdValue: number;
  solValue: number;
}

const DonationsPanel = ({
  name = "John",
  toWalletAddress,
  toUserId,
}: {
  name?: string;
  toWalletAddress?: string;
  toUserId?: string;
}) => {
  const [donationOptions, setDonationOptions] = useState<Donation[]>([]);
  const [selectedOption, setSelectedOption] = useState<Donation>();
  const { connection } = useConnection();
  const { setVisible, visible } = useWalletModal();
  const user = useGetUser();
  const { publicKey, sendTransaction } = useWallet();
  const solPrice = useGetSolPrice();

  const calculateDonationsOptions = useCallback(() => {
    const donationOptions = donationOptionsUSD.map(
      (donationValueUsd, index) => {
        return {
          id: index,
          usdValue: donationValueUsd,
          solValue: Number(getSolFromUSD(donationValueUsd, solPrice!)),
        };
      }
    );
    setDonationOptions(donationOptions);
  }, [solPrice]);

  const onDonateClick = useCallback(
    async (selectedOption: Donation) => {
      if (!publicKey || !user?.id) {
        setVisible(true);
      } else if (toWalletAddress && publicKey) {
        const toPublicKey = new PublicKey(toWalletAddress);
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: toPublicKey,
            lamports: 1000000000 * selectedOption.solValue,
          })
        );

        const signature = await sendTransaction(transaction, connection);

        if (signature) {
          await supabase.from("donations").insert({
            from_id: user?.id,
            to_id: toUserId!,
            amount: selectedOption.solValue,
          });
        }
      }
    },
    [publicKey, sendTransaction, connection, toWalletAddress]
  );

  useEffect(() => {
    if (solPrice) {
      calculateDonationsOptions();
    }
  }, [solPrice]);

  return (
    <div className="max-w-xl">
      <h2 className="text-center text-3xl font-bold text-white">
        DONATE SOME PIZZAS TO {name?.toUpperCase()}
      </h2>
      <div className="grid grid-cols-2 gap-6 py-10 xl:grid-cols-4">
        {donationOptions.map((item, index) => (
          <article
            key={index}
            className={classNames(
              "cursor-pointer rounded-lg border-2 py-6 transition-all hover:border-primary-500",
              { "border-black": item.id !== selectedOption?.id },
              { "border-primary-500": item.id === selectedOption?.id }
            )}
            onClick={() => setSelectedOption(item)}
          >
            <h3 className="text-center">{item.usdValue} USD</h3>
            <p className="text-center text-neutral-700">
              ({item.solValue} sol)
            </p>
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
        {selectedOption && (
          <Button
            onClick={() => {
              toWalletAddress && onDonateClick(selectedOption);
            }}
          >
            DONATE
          </Button>
        )}
      </div>
    </div>
  );
};

export default DonationsPanel;

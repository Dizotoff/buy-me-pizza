import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { UploadableImage } from "../components/UploadableImage";

import { Button } from "../components/Button";
import DonationsPanel from "../components/DonationsPanel";
import { Modal } from "../components/Modal";
import { useGetUser } from "../context/AuthProvider";
import { Profile } from "../models/profile";
import { supabase } from "../utils/supabaseClient";
import { v4 } from "uuid";
import { slugify, truncateWallet } from "../utils/helpers";

type ExtendedProfile = Profile & {
  users: { wallet_address: string };
  donations: any[];
};

const UserPage = ({ profile }: { profile: ExtendedProfile }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [usernameValue, setUsernameValue] = useState<string>("");
  const user = useGetUser();
  const router = useRouter();
  const isCurrentUserOwner =
    user?.walletAddress === profile.users.wallet_address;

  const handleUsernameSubmit = async () => {
    const toastId = toast.loading("Claiming the username...");

    const trimmedUsername = slugify(usernameValue.trim());

    if (trimmedUsername === "") {
      toast.error("This username is not valid");
      toast.dismiss(toastId);
      return;
    }

    const { data, error } = await supabase
      .from<Profile>("profiles")
      .update({ username: trimmedUsername })
      .match({ username: profile.username });

    toast.dismiss(toastId);

    if (error) {
      toast.error("This username is already used");
      console.log("Failed to update username");
    }

    if (data) {
      toast.success("Username was changed");

      router.push(`/${trimmedUsername}`);
      setIsModalOpen(false);
    }
  };

  const handleAvatarUpload = async (event: ChangeEvent) => {
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    //@ts-ignore
    const file = target?.files[0] as File;
    if (file) {
      if (profile.avatar_url) {
        const toRemoveItem = profile?.avatar_url
          ?.split("/")
          .slice(Math.max(profile?.avatar_url?.split("/").length - 3, 0))
          .join("/");
        const { data, error } = await supabase.storage
          .from("avatars")
          .remove([toRemoveItem]);
      }
      const toastId = toast.loading("Uploading avatar image...");
      const fileName = v4();
      const fileExtension = file?.type?.split("/")[1];
      const { data: image, error } = await supabase.storage
        .from("avatars")
        .upload(`${profile.id}/${fileName}.${fileExtension}`, file);

      if (error) {
        console.log(error);
        toast.dismiss(toastId);
        toast.error("Issue with setting new avatar");
        return;
      }
      if (image?.Key) {
        const key = image?.Key?.split("/").slice(-1).pop();
        const { publicURL, error } = await supabase.storage
          .from("avatars")
          .getPublicUrl(`${profile.id}/${key}`);

        if (error) {
          console.log(error);
          toast.dismiss(toastId);
          toast.error("Issue with setting new avatar");
          return;
        }

        if (publicURL) {
          const { data, error } = await supabase
            .from<Profile>("profiles")
            .update({ avatar_url: publicURL })
            .match({ id: profile.id });

          if (error) {
            console.log(error);
            toast.dismiss(toastId);
            toast.error("Issue with setting new avatar");
            return;
          }

          if (data) {
            toast.success("New avatar was set!");
            router.push(`/${profile.username}`);
          }
        }
      }
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="w-full bg-black text-white antialiased">
      <Head>
        <title>Buy Me a Pizza - {profile.username}</title>
        <meta
          name="description"
          content={`${profile.username} accepts donation in Solana here`}
        />
      </Head>
      <Toaster />

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <>
          <h1 className="text-center font-bold text-white">
            CHOOSE A NEW USERNAME
          </h1>
          <input
            className="rounded-md border border-neutral-900  bg-black py-2 pl-2 text-neutral-500 outline-none focus:border-primary-500 active:border-primary-500"
            value={usernameValue}
            onChange={(event) => {
              setUsernameValue(event.target.value);
            }}
          ></input>
          <Button
            onClick={() => {
              handleUsernameSubmit();
            }}
            disabled={usernameValue === ""}
          >
            Update
          </Button>
        </>
      </Modal>
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-16">
        <div className="flex flex-col items-center justify-between gap-20 py-6 sm:flex-row sm:gap-0">
          <span className="flex w-fit items-center gap-6">
            <UploadableImage
              src={profile.avatar_url}
              alt={"User avatar"}
              isUploadable={isCurrentUserOwner}
              onUpload={handleAvatarUpload}
            />

            <div className="flex flex-col">
              <p className="text-xl font-extrabold text-primary-100">
                {profile.username}
              </p>
              <p className="text-md  font-extrabold text-primary-100">
                {truncateWallet(profile.users.wallet_address)}
              </p>
            </div>
            {isCurrentUserOwner && (
              <Button
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                UPDATE NAME
              </Button>
            )}
          </span>
          <a
            target="_blank"
            rel="noreferrer"
            className="group flex cursor-pointer gap-4 text-xl font-extrabold transition-all hover:text-primary-100"
            href={`https://twitter.com/intent/tweet?text=Hey, you can buymea.pizza/${profile.username} with @Solana`}
          >
            <Image
              src="/icons/twitter.svg"
              alt="twitter"
              height={30}
              width={30}
            />
            <p>SHARE ON TWITTER</p>
          </a>
        </div>

        <div className="grid min-h-screen grid-cols-1 gap-20 pb-16 pt-16 sm:grid-cols-2">
          <DonationsPanel
            name={profile.username}
            toWalletAddress={profile.users.wallet_address}
            toUserId={profile.id}
          />
          <div className="flex max-h-96 flex-col items-center justify-start rounded-xl border border-neutral-900 py-6">
            <h1 className="text-xl font-extrabold text-primary-100">
              DONATION LEDGER
            </h1>
            <ul className="flex flex-col gap-4">
              {profile.donations?.map((donation) => (
                <li key={donation.id} className=" text-neutral-700">
                  {truncateWallet(donation.from_id.users.wallet_address)}{" "}
                  donated {donation.amount} SOL to {profile.username}
                </li>
              ))}
              {profile.donations.length === 0 && (
                <h2 className="pt-16 text-neutral-700 sm:pt-32">
                  No donations has been made yet...
                </h2>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({
  params,
}: GetServerSidePropsContext<{ username: string }>): Promise<
  GetServerSidePropsResult<{ profile: any }>
> => {
  const username = params?.username;

  /* Not Found */
  if (!username) {
    return {
      notFound: true,
    };
  }

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select(
      "*, users(wallet_address), donations!donations_to_id_fkey(*, from_id(*, users(*)))"
    )
    .eq("username", username);

  if (error) {
    console.log(`[Supabase]: Failed to fetch user data`, error);
  }

  if (profiles && profiles[0]) {
    return {
      props: { profile: profiles[0] },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

export default UserPage;

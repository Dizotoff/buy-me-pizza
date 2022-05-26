import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
} from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import DonationsPanel from "../components/DonationsPanel";
import { Modal } from "../components/Modal";
import { Profile } from "../models/profile";
import { supabase } from "../utils/supabaseClient";

const UserPage = ({ profile }: { profile: Profile }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [usernameValue, setUsernameValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUsernameAvaliable, setIsUsernameAvaliable] =
    useState<boolean>(false);
  const router = useRouter();

  const handleUsernameSubmit = async () => {
    const { data, error } = await supabase
      .from<Profile>("profiles")
      .update({ username: usernameValue })
      .match({ username: profile.username });

    if (error) {
      console.log("Failed to update username");
    }

    if (data) {
      router.push(`/${usernameValue}`);
      setIsModalOpen(false);
    }
  };

  const checkUsernameAvailability = async (username: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username);

    if (error) {
      console.log("Failed to check username availability");
    }

    if (data?.length === 0) {
      setIsUsernameAvaliable(true);
    } else {
      setIsUsernameAvaliable(false);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    setIsLoading(true);

    if (usernameValue !== "") {
      timer = setTimeout(() => {
        checkUsernameAvailability(usernameValue);
      }, 500);
    }
    setIsLoading(false);

    return () => clearInterval(timer);
  }, [usernameValue]);

  return (
    <div className="w-full bg-black text-white antialiased">
      <Head>
        <title>Buy Me a Pizza - {profile.username}</title>
        <meta
          name="description"
          content={`${profile.username} accepts donation in Solana here`}
        />
      </Head>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <>
          <input
            value={usernameValue}
            onChange={(event) => {
              setUsernameValue(event.target.value);
            }}
          ></input>
          <Button
            onClick={() => {
              handleUsernameSubmit();
            }}
            disabled={!isUsernameAvaliable}
          >
            Update
          </Button>
          {!isUsernameAvaliable && (
            <p className="text-xs text-primary-500">
              Username is not avaliable, try a different one
            </p>
          )}
        </>
      </Modal>
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-16">
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
            <p className="text-xl font-extrabold text-primary-100">
              {profile.username}
            </p>
            <Button
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              UPDATE NAME
            </Button>
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
          <DonationsPanel name={profile.username} />
          <div className="flex max-h-96 items-center justify-center rounded-xl border border-neutral-700">
            <p className="text-xl font-extrabold text-primary-100">
              DONATION LEDGER
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({
  params,
}: GetServerSidePropsContext<{ username: string }>): Promise<
  GetServerSidePropsResult<{ profile: Profile }>
> => {
  const username = params?.username;

  /* Not Found */
  if (!username) {
    return {
      notFound: true,
    };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    console.log(`[Supabase]: Failed to user data`, error.message);
  }

  if (profile) {
    return {
      props: { profile },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

export default UserPage;

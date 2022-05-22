import {
  createContext,
  useContext,
  useState,
  ReactElement,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import jwt from "jsonwebtoken";
import { sign } from "tweetnacl";
import { supabase } from "../utils/supabaseClient";
import { useCookies } from "react-cookie";

interface AuthProviderProps {
  children: ReactElement;
}

interface User {
  id: string;
  walletAddress: string;
  username?: string;
  avatar_url?: string;
  website?: string;
}

export const UserContext = createContext<User | undefined>(undefined);
export const SetUserContext = createContext<
  Dispatch<SetStateAction<User | undefined>>
>(() => {});

export const LogOutContext = createContext<() => void>(() => {});

const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const { publicKey, signMessage, disconnect } = useWallet();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const loadUserSession = async () => {
    const token = jwt.decode(cookies.token);
    //@ts-ignore
    const userId = token?.user_metadata?.id;

    const { data: userData, error } = await supabase
      .from("users")
      .select("*, profile:profiles_id_fkey!inner(*)")
      .eq("id", userId)
      .single();

    if (error || !userData) {
      console.log("Failed to fetch user data on user session load");
      removeCookie("token", {
        expires: new Date(Date.now() + 1 * 1000),
        path: "/",
      });
    }

    if (userData && cookies.token) {
      supabase.auth.setAuth(cookies.token);
      setUser({
        id: userData.id,
        walletAddress: userData?.wallet_address,
        username: userData.profile[0]?.username,
      });
    }
  };
  const authenticateWithNonce = async () => {
    try {
      if (!publicKey) throw new Error("Wallet not connected!");
      const walletAddress = publicKey?.toBase58();

      let response = await fetch("/api/nonce", {
        method: "POST",
        body: JSON.stringify({
          walletAddress,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { nonce } = await response.json();

      if (!nonce) throw new Error("API failed to fetch the nonce");

      if (!signMessage)
        throw new Error("Wallet does not support message signing!");
      // Encode anything as bytes
      const encodedNonce = new TextEncoder().encode(nonce);
      // Sign the bytes using the wallet
      const signature = await signMessage(encodedNonce);
      // Verify that the bytes were signed using the private key that matches the known public key
      if (!sign.detached.verify(encodedNonce, signature, publicKey.toBytes()))
        throw new Error("Invalid signature!");

      response = await fetch("/api/verify", {
        method: "POST",
        body: JSON.stringify({
          walletAddress,
          nonce: encodedNonce.toLocaleString(),
          signature: Array.from(signature).toLocaleString(),
          publicKey: Array.from(publicKey.toBytes()).toLocaleString(),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { user, token } = await response.json();

      if (!user) throw new Error("API failed to fetch the user");
      if (!token) throw new Error("API failed to fetch the token");

      supabase.auth.setAuth(token);
      setCookie("token", token, {
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 11 * 12, // Expiring in 6d<
        sameSite: "strict",
      });
      setUser({
        id: user.id,
        walletAddress: user?.wallet_address,
        username: user.profile[0]?.username,
      });
    } catch (error: any) {
      console.log(`Signing failed: ${error?.message}`);
    }
  };
  const logout = () => {
    removeCookie("token", {
      expires: new Date(Date.now() + 1 * 1000),
      path: "/",
    });
    disconnect();
    supabase.auth.setAuth("");
    setUser(undefined);
  };

  useEffect(() => {
    if (publicKey && !user && !cookies.token) {
      authenticateWithNonce();
    }
  }, [publicKey, user]);

  useEffect(() => {
    if (cookies.token && !user && publicKey) {
      loadUserSession();
    }
  }, [publicKey, user, publicKey]);

  return (
    <UserContext.Provider value={user}>
      <SetUserContext.Provider value={setUser}>
        <LogOutContext.Provider value={logout}>
          {children}
        </LogOutContext.Provider>
      </SetUserContext.Provider>
    </UserContext.Provider>
  );
};

export function useGetUser(): User | undefined {
  const userData = useContext(UserContext);
  return userData;
}

export function useSetUser() {
  const setUser = useContext(SetUserContext);
  return (user: User) => {
    setUser(user);
  };
}

export function useLogout() {
  const logout = useContext(LogOutContext);
  return logout;
}

export default AuthProvider;

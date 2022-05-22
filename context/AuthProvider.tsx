import {
  createContext,
  useContext,
  useState,
  ReactElement,
  useEffect,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { sign } from "tweetnacl";
import { supabase } from "../utils/supabaseClient";

interface AuthProviderProps {
  children: ReactElement;
}
interface User {}

export const UserContext = createContext<User | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const { publicKey, signMessage } = useWallet();

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
      setUser(user);
    } catch (error: any) {
      alert(`Signing failed: ${error?.message}`);
    }
  };

  useEffect(() => {
    if (publicKey && !user) {
      authenticateWithNonce();
    }
  }, [publicKey]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export function useUserData(): User | undefined {
  const userData = useContext(UserContext);
  return userData;
}

export default AuthProvider;

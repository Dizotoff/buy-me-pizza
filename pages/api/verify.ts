import { NextApiRequest, NextApiResponse } from "next";
import nacl from "tweetnacl";
import jwt, { Secret } from "jsonwebtoken";
import { supabaseAdmin } from "../../utils/supabaseAdminClient";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "POST":
      const { walletAddress, signature, nonce, publicKey } = req.body;

      if (!walletAddress || !signature || !nonce) {
        res.status(400).end(`publicKey, signature or nonce were not provided`);
      }

      const nonceUint8 = new Uint8Array(nonce.split(",").map(Number));
      const signatureUint8 = new Uint8Array(signature.split(",").map(Number));
      const publicKeyUint8 = new Uint8Array(publicKey.split(",").map(Number));

      const isVerified = nacl.sign.detached.verify(
        nonceUint8,
        signatureUint8,
        publicKeyUint8
      );

      if (!isVerified) {
        res.status(403).end(`Signature does not match`);
      }

      const { data: userData, error } = await supabaseAdmin
        .from("users")
        .select("*, profiles_id_fkey(*)")
        .eq("wallet_address", walletAddress)
        .eq("nonce", new TextDecoder().decode(nonceUint8))
        .single();

      if (!userData) {
        res.status(500).end(`No user associated with wallet / nonce found`);
      }

      if (error) {
        res.status(500).end(`Failed to fetch user data ${error.message}`);
      }

      if (!process.env.SUPABASE_JWT_SECRET) {
        res.status(500).end(`JWT Secret env variable wasn't provided`);
      }

      const token = jwt.sign(
        {
          aud: "authenticated",
          exp: Math.floor(Date.now() / 1000 + 60 * 60 * 12 * 12), // Expiring in 6d
          sub: userData?.id,
          user_metadata: {
            id: userData?.id,
          },
          role: "authenticated",
        },
        process.env.SUPABASE_JWT_SECRET as Secret
      );

      res.status(200).json({
        user: {
          ...userData,
        },
        token,
      });

      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;

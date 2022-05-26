import { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { supabaseAdmin } from "../../utils/supabaseAdminClient";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "POST":
      const { walletAddress } = req.body;

      if (!walletAddress) res.status(400).end(`walletAddress was not provided`);

      const { data, error } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("wallet_address", walletAddress);

      if (error) {
        res
          .status(500)
          .end(`Failed to check for user existence: ${error.message}`);
      }

      const nonce = `Hi! You know, for authentication 
      ${v4()}`;

      if (data && data?.length > 0) {
        const { error } = await supabaseAdmin
          .from("users")
          .update({ nonce })
          .match({ wallet_address: walletAddress });
        if (error) {
          res.status(500).end(`Failed to update the nonce: ${error.message}`);
        }
      } else {
        const { error } = await supabaseAdmin.from("users").insert({
          nonce,
          wallet_address: walletAddress,
        });

        if (error) {
          res.status(500).end(`Failed to create a new user: ${error.message}`);
        }
      }
      res.status(200).json({ nonce });
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;

import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

const fs = require("fs");
const path = require("path");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  const widgetPath = path.join(process.cwd(), "public", "widget.js");
  const widget = fs.readFileSync(widgetPath, "utf8");

  res.status(200).send(widget);
};

export default handler;

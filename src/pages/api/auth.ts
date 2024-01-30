// pages/api/auth.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import Cookies from "js-cookie";
import https from "https";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { ticket } = req.query;
  console.log(req.query);

  if (!ticket || typeof ticket !== "string") {
    console.log("No ticket provided");
    return res.status(401).json({ error: "No ticket provided" });
  }

  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    const validationResponse = await axios.get(
      `${
        process.env.NEXT_PUBLIC_CAS_SERVER_URL
      }/serviceValidate?service=${encodeURIComponent(
        process.env.NEXT_PUBLIC_APP_URL + ""
      )}&ticket=${ticket}`,
      { httpsAgent: agent }
    );

    if (validationResponse.data.success) {
      Cookies.set("authToken", validationResponse.data.token, { expires: 1 });
      res.redirect("/protected");
    } else {
      res.status(401).json({ error: "Invalid ticket" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

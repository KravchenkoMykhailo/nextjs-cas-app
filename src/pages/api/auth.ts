// pages/api/auth.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import Cookies from "js-cookie";
import https from "https";
import { parseStringPromise } from "xml2js";

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
    console.log(
      `${
        process.env.NEXT_PUBLIC_CAS_SERVER_URL
      }/serviceValidate?service=${encodeURIComponent(
        process.env.NEXT_PUBLIC_APP_URL + ""
      )}&ticket=${ticket}`
    );
    const validationResponse = await axios.get(
      `${
        process.env.NEXT_PUBLIC_CAS_SERVER_URL
      }/serviceValidate?service=${encodeURIComponent(
        process.env.NEXT_PUBLIC_APP_URL + ""
      )}&ticket=${ticket}`,
      { httpsAgent: agent }
    );
    console.log(validationResponse);

    const xml = validationResponse.data;

    const result = await parseStringPromise(xml);
    if (result["cas:serviceResponse"]["cas:authenticationSuccess"]) {
      const userDetails =
        result["cas:serviceResponse"]["cas:authenticationSuccess"][0];
      const user = {
        id: userDetails["cas:id"][0],
        lastName: userDetails["cas:last_name"][0],
        email: userDetails["cas:email"][0],
        username: userDetails["cas:username"][0],
        type: userDetails["cas:inceif_type"][0],
        status: userDetails["cas:inceif_status"][0],
      };

      // Now you have the user details in a JavaScript object
      // Proceed with your authentication logic
      // Cookies.set("authToken", "1231231021", { expires: 1 });
      res.setHeader(
        "Set-Cookie",
        `authToken=1231231021; Path=/; Max-Age=${60 * 60 * 24};`
      );
      res.redirect("/protected");
    } else {
      res.status(401).json({ error: "Invalid ticket" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

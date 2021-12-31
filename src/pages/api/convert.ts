import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type ConversionInfo = {
  CURRENCY_RATIO: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ConversionInfo>
) {
  const { method } = req;
  if (method === "POST") {
    const CONVERT_API_KEY = process.env.CONVERT_API_KEY!;
    console.log("API POST_REQUEST");
    const { FROM_CURRENCY_CODE, TO_CURRENCY_CODE } = req.body;
    const CURRENCY_PAIR = `${FROM_CURRENCY_CODE}_${TO_CURRENCY_CODE}`;
    console.log("currency pair");
    console.log(CURRENCY_PAIR);
    const API_CONVERT_BASE_URL = new URL(
      "https://free.currconv.com/api/v7/convert"
    );
    const queryParams = new URLSearchParams(API_CONVERT_BASE_URL.search);
    queryParams.set("q", CURRENCY_PAIR);
    queryParams.set("compact", "ultra");
    queryParams.set("apiKey", CONVERT_API_KEY);

    const response = await axios.get(`${API_CONVERT_BASE_URL}?${queryParams}`);
    const CURRENCY_RATIO = await response.data[CURRENCY_PAIR];
    console.log("CURRENCY_RATIO");
    console.log(CURRENCY_RATIO);
    res.status(200).json({
      CURRENCY_RATIO,
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}

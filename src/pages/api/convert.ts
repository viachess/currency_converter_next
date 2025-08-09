import type { NextApiRequest, NextApiResponse } from "next";
import { ConversionInfo } from "./_lib/types";
import { getConverterData } from "./_lib/get-converter-data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ConversionInfo>
) {
  const { method } = req;
  if (method === "POST") {
    const { FROM_CURRENCY_CODE, TO_CURRENCY_CODE } = req.body;
    try {
      const { latestRate, historyRate } = await getConverterData(
        FROM_CURRENCY_CODE,
        TO_CURRENCY_CODE
      );

      // Latest rate
      const latestValue = latestRate?.data?.[TO_CURRENCY_CODE];
      const REGULAR_RATE = Number(latestValue);
      const INVERSE_RATE = Number.isFinite(REGULAR_RATE) ? 1 / REGULAR_RATE : 1;

      // Multi-day history formatting for the chart (last 4 days, ascending)
      const entries = Object.entries(historyRate?.data ?? {});
      const HISTORY_DATA = entries
        .map(([dateStr, valueMap]) => {
          const value = (valueMap as Record<string, number>)[TO_CURRENCY_CODE];
          return {
            PointInTime: Date.parse(dateStr),
            InterbankRate: Number(value),
          };
        })
        .filter(
          (d) =>
            Number.isFinite(d.InterbankRate) && !Number.isNaN(d.PointInTime)
        )
        .sort((a, b) => a.PointInTime - b.PointInTime);

      res.status(200).json({
        REGULAR_RATE,
        INVERSE_RATE,
        HISTORY_DATA,
      });
    } catch (err) {
      console.error("API request failed");
      res.status(500).json({
        REGULAR_RATE: 1,
        INVERSE_RATE: 1,
        message: "Internal API issue, try again later",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}

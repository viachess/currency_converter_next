import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type ConversionInfo = {
  REGULAR_RATE: number;
  INVERSE_RATE?: number;
  HISTORY_DATA?: object;
  message?: string;
};

interface FreeQueryProps {
  CURRENCY_PAIR: string;
  withHistory: boolean;
}

function createFreeConverterQuery({
  CURRENCY_PAIR,
  withHistory = false,
}: FreeQueryProps) {
  const CONVERT_API_KEY = process.env.DEFAULT_CONVERTER_API_KEY!;
  const API_CONVERT_BASE_URL = new URL(process.env.DEFAULT_CONVERTER_URL!);

  const queryParams = new URLSearchParams(API_CONVERT_BASE_URL.search);
  queryParams.set("q", CURRENCY_PAIR);
  queryParams.set("compact", "ultra");
  queryParams.set("apiKey", CONVERT_API_KEY);
  if (withHistory) {
    // Maximum allowed period of time is 8 days on a free API plan
    // /api/v7/convert?q=USD_PHP,PHP_USD&compact=ultra&date=[yyyy-mm-dd]&endDate=[yyyy-mm-dd]&apiKey=[YOUR_API_KEY]
    const start = new Date();
    start.setDate(start.getDate() - 8);
    const end = new Date();
    const startDate = start.toISOString().split("T")[0];
    const endDate = end.toISOString().split("T")[0];
    queryParams.set("date", startDate);
    queryParams.set("endDate", endDate);
    return `${API_CONVERT_BASE_URL}?${queryParams}`;
  }
  return `${API_CONVERT_BASE_URL}?${queryParams}`;
}

async function getFreeConverterData({
  FROM_CURRENCY_CODE,
  TO_CURRENCY_CODE,
  withHistory = false,
}: {
  FROM_CURRENCY_CODE: string;
  TO_CURRENCY_CODE: string;
  withHistory: boolean;
}) {
  const CURRENCY_PAIR = `${FROM_CURRENCY_CODE}_${TO_CURRENCY_CODE}`;

  const query = createFreeConverterQuery({
    CURRENCY_PAIR,
    withHistory,
  });

  const response = await axios.get(query);

  if (withHistory) {
    const today = new Date().toISOString().split("T")[0];
    const currencyData = await response.data;
    const REGULAR_RATE = currencyData[CURRENCY_PAIR][today];
    const INVERSE_RATE = 1 / REGULAR_RATE;
    const HISTORY_DATA = currencyData[CURRENCY_PAIR];
    return {
      REGULAR_RATE,
      INVERSE_RATE,
      HISTORY_DATA,
    };
  }

  const REGULAR_RATE = await response.data[CURRENCY_PAIR];
  const INVERSE_RATE = 1 / REGULAR_RATE;
  return {
    REGULAR_RATE,
    INVERSE_RATE,
  };
}

enum TimePeriod {
  DAY = "day",
  MONTH = "month",
  HALF_YEAR = "6months",
  YEAR = "year",
}

async function getAltConverterData({
  FROM_CURRENCY_CODE,
  TO_CURRENCY_CODE,
  period,
}: {
  FROM_CURRENCY_CODE: string;
  TO_CURRENCY_CODE: string;
  period: TimePeriod;
}) {
  const ALT_API_URL = process.env.ALT_CONVERTER_URL!;
  const POST_PARAMS = {
    method: "spotRateHistory",
    data: {
      base: FROM_CURRENCY_CODE,
      term: TO_CURRENCY_CODE,
      period: period,
    },
  };

  const response = await axios.post(ALT_API_URL, POST_PARAMS);
  const data = await response.data;
  const REGULAR_RATE = data.CurrentInterbankRate;
  const INVERSE_RATE = data.CurrentInverseInterbankRate;
  const HISTORY_DATA = data.HistoricalPoints;
  return {
    REGULAR_RATE,
    INVERSE_RATE,
    HISTORY_DATA,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ConversionInfo>
) {
  const { method } = req;
  if (method === "POST") {
    if (process.env.VERCEL_ENV === "development") {
      // res.status(200).json({
      //   CURRENCY_RATIO: 230.1,
      // });
      // ALT_API mock data for USD_EUR pair
      console.log("dev request to api");
      const sample = {
        data: {
          CurrentInterbankRate: 0.877,
          CurrentInverseInterbankRate: 1.1403,
          Average: 0.8459,
          HistoricalPoints: [
            {
              PointInTime: 1609632000000,
              InterbankRate: 0.8241,
              InverseInterbankRate: 1.2135,
            },
            {
              PointInTime: 1609718400000,
              InterbankRate: 0.8158,
              InverseInterbankRate: 1.2258,
            },
            {
              PointInTime: 1609804800000,
              InterbankRate: 0.8134,
              InverseInterbankRate: 1.2294,
            },
            {
              PointInTime: 1609891200000,
              InterbankRate: 0.8137,
              InverseInterbankRate: 1.229,
            },
            {
              PointInTime: 1609977600000,
              InterbankRate: 0.8151,
              InverseInterbankRate: 1.2268,
            },
            {
              PointInTime: 1610064000000,
              InterbankRate: 0.816,
              InverseInterbankRate: 1.2255,
            },
            {
              PointInTime: 1610150400000,
              InterbankRate: 0.818,
              InverseInterbankRate: 1.2225,
            },
            {
              PointInTime: 1610236800000,
              InterbankRate: 0.818,
              InverseInterbankRate: 1.2225,
            },
            {
              PointInTime: 1610323200000,
              InterbankRate: 0.8218,
              InverseInterbankRate: 1.2169,
            },
          ],
          supportedByOfx: true,
          fetchTime: 1641203703810,
        },
      };
      const REGULAR_RATE = sample.data.CurrentInterbankRate;
      const INVERSE_RATE = sample.data.CurrentInverseInterbankRate;
      const HISTORY_DATA = sample.data.HistoricalPoints;
      res.status(200).json({
        REGULAR_RATE,
        INVERSE_RATE,
        HISTORY_DATA,
      });
      return;
    }
    const { FROM_CURRENCY_CODE, TO_CURRENCY_CODE, withHistory } = req.body;
    console.log("prod request to api");
    try {
      const { HISTORY_DATA, REGULAR_RATE, INVERSE_RATE } =
        await getAltConverterData({
          FROM_CURRENCY_CODE,
          TO_CURRENCY_CODE,
          period: TimePeriod.YEAR,
        });

      res.status(200).json({
        REGULAR_RATE,
        INVERSE_RATE,
        HISTORY_DATA,
      });
    } catch (err) {
      console.error(
        "Alt API request failed, attempting a default convert request..."
      );
      try {
        const { REGULAR_RATE, INVERSE_RATE, HISTORY_DATA } =
          await getFreeConverterData({
            FROM_CURRENCY_CODE,
            TO_CURRENCY_CODE,
            withHistory,
          });

        res.status(200).json({
          REGULAR_RATE,
          INVERSE_RATE,
          HISTORY_DATA,
        });
      } catch (err) {
        console.error("Both API requests failed, check URL validity.");
        res.status(500).json({
          REGULAR_RATE: 1,
          INVERSE_RATE: 1,
          message: "Internal API issue, try again later",
        });
      }
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}

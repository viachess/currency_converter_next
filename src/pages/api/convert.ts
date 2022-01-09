import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

interface HistoryPoint {
  PointInTime: number;
  InterbankRate: number;
  InverseInterbankRate?: number;
}

type ConversionInfo = {
  REGULAR_RATE: number;
  INVERSE_RATE?: number;
  HISTORY_DATA?: HistoryPoint[];
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
  ALT_API_URL,
}: {
  FROM_CURRENCY_CODE: string;
  TO_CURRENCY_CODE: string;
  period: TimePeriod;
  ALT_API_URL: string;
}) {
  const POST_PARAMS = {
    method: "spotRateHistory",
    data: {
      base: FROM_CURRENCY_CODE,
      term: TO_CURRENCY_CODE,
      period: period,
    },
  };

  const response = await axios.post(ALT_API_URL, POST_PARAMS);

  const data = await response.data.data;
  const REGULAR_RATE = data.CurrentInterbankRate;
  const INVERSE_RATE = 1 / REGULAR_RATE;
  const HISTORY_DATA = data.HistoricalPoints;
  // console.log(JSON.stringify(HISTORY_DATA));
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

      const sample = {
        data: {
          CurrentInterbankRate: 0.8851,
          HistoricalPoints: [
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
            {
              PointInTime: 1610409600000,
              InterbankRate: 0.8224,
              InverseInterbankRate: 1.216,
            },
            {
              PointInTime: 1610496000000,
              InterbankRate: 0.8225,
              InverseInterbankRate: 1.2158,
            },
            {
              PointInTime: 1610582400000,
              InterbankRate: 0.8227,
              InverseInterbankRate: 1.2155,
            },
            {
              PointInTime: 1610668800000,
              InterbankRate: 0.8267,
              InverseInterbankRate: 1.2096,
            },
            {
              PointInTime: 1610755200000,
              InterbankRate: 0.8278,
              InverseInterbankRate: 1.2079,
            },
            {
              PointInTime: 1610841600000,
              InterbankRate: 0.8278,
              InverseInterbankRate: 1.2079,
            },
            {
              PointInTime: 1610928000000,
              InterbankRate: 0.8279,
              InverseInterbankRate: 1.2079,
            },
            {
              PointInTime: 1611014400000,
              InterbankRate: 0.8248,
              InverseInterbankRate: 1.2125,
            },
            {
              PointInTime: 1611100800000,
              InterbankRate: 0.8257,
              InverseInterbankRate: 1.2111,
            },
            {
              PointInTime: 1611187200000,
              InterbankRate: 0.8238,
              InverseInterbankRate: 1.2139,
            },
            {
              PointInTime: 1611273600000,
              InterbankRate: 0.8211,
              InverseInterbankRate: 1.2179,
            },
            {
              PointInTime: 1611360000000,
              InterbankRate: 0.8214,
              InverseInterbankRate: 1.2174,
            },
            {
              PointInTime: 1611446400000,
              InterbankRate: 0.8214,
              InverseInterbankRate: 1.2174,
            },
            {
              PointInTime: 1611532800000,
              InterbankRate: 0.8241,
              InverseInterbankRate: 1.2135,
            },
            {
              PointInTime: 1611619200000,
              InterbankRate: 0.8226,
              InverseInterbankRate: 1.2157,
            },
            {
              PointInTime: 1611705600000,
              InterbankRate: 0.8262,
              InverseInterbankRate: 1.2104,
            },
            {
              PointInTime: 1611792000000,
              InterbankRate: 0.8249,
              InverseInterbankRate: 1.2122,
            },
            {
              PointInTime: 1611878400000,
              InterbankRate: 0.8238,
              InverseInterbankRate: 1.2139,
            },
            {
              PointInTime: 1611964800000,
              InterbankRate: 0.8239,
              InverseInterbankRate: 1.2137,
            },
            {
              PointInTime: 1612051200000,
              InterbankRate: 0.8239,
              InverseInterbankRate: 1.2137,
            },
            {
              PointInTime: 1612137600000,
              InterbankRate: 0.8281,
              InverseInterbankRate: 1.2076,
            },
            {
              PointInTime: 1612224000000,
              InterbankRate: 0.8318,
              InverseInterbankRate: 1.2022,
            },
            {
              PointInTime: 1612310400000,
              InterbankRate: 0.8316,
              InverseInterbankRate: 1.2025,
            },
            {
              PointInTime: 1612396800000,
              InterbankRate: 0.8351,
              InverseInterbankRate: 1.1974,
            },
            {
              PointInTime: 1612483200000,
              InterbankRate: 0.8309,
              InverseInterbankRate: 1.2036,
            },
            {
              PointInTime: 1612569600000,
              InterbankRate: 0.8299,
              InverseInterbankRate: 1.2049,
            },
            {
              PointInTime: 1612656000000,
              InterbankRate: 0.8299,
              InverseInterbankRate: 1.2049,
            },
            {
              PointInTime: 1612742400000,
              InterbankRate: 0.8302,
              InverseInterbankRate: 1.2046,
            },
            {
              PointInTime: 1612828800000,
              InterbankRate: 0.8262,
              InverseInterbankRate: 1.2103,
            },
            {
              PointInTime: 1612915200000,
              InterbankRate: 0.8242,
              InverseInterbankRate: 1.2133,
            },
            {
              PointInTime: 1613001600000,
              InterbankRate: 0.8247,
              InverseInterbankRate: 1.2126,
            },
            {
              PointInTime: 1613088000000,
              InterbankRate: 0.8246,
              InverseInterbankRate: 1.2127,
            },
            {
              PointInTime: 1613174400000,
              InterbankRate: 0.825,
              InverseInterbankRate: 1.212,
            },
            {
              PointInTime: 1613260800000,
              InterbankRate: 0.825,
              InverseInterbankRate: 1.212,
            },
            {
              PointInTime: 1613347200000,
              InterbankRate: 0.824,
              InverseInterbankRate: 1.2136,
            },
            {
              PointInTime: 1613433600000,
              InterbankRate: 0.8259,
              InverseInterbankRate: 1.2108,
            },
            {
              PointInTime: 1613520000000,
              InterbankRate: 0.8306,
              InverseInterbankRate: 1.204,
            },
            {
              PointInTime: 1613606400000,
              InterbankRate: 0.8279,
              InverseInterbankRate: 1.2079,
            },
            {
              PointInTime: 1613692800000,
              InterbankRate: 0.8241,
              InverseInterbankRate: 1.2134,
            },
            {
              PointInTime: 1613779200000,
              InterbankRate: 0.8252,
              InverseInterbankRate: 1.2118,
            },
            {
              PointInTime: 1613865600000,
              InterbankRate: 0.8252,
              InverseInterbankRate: 1.2118,
            },
            {
              PointInTime: 1613952000000,
              InterbankRate: 0.8231,
              InverseInterbankRate: 1.215,
            },
            {
              PointInTime: 1614038400000,
              InterbankRate: 0.8231,
              InverseInterbankRate: 1.215,
            },
            {
              PointInTime: 1614124800000,
              InterbankRate: 0.824,
              InverseInterbankRate: 1.2136,
            },
            {
              PointInTime: 1614211200000,
              InterbankRate: 0.8182,
              InverseInterbankRate: 1.2221,
            },
            {
              PointInTime: 1614297600000,
              InterbankRate: 0.8266,
              InverseInterbankRate: 1.2098,
            },
            {
              PointInTime: 1614384000000,
              InterbankRate: 0.8284,
              InverseInterbankRate: 1.2072,
            },
            {
              PointInTime: 1614470400000,
              InterbankRate: 0.8284,
              InverseInterbankRate: 1.2072,
            },
            {
              PointInTime: 1614556800000,
              InterbankRate: 0.8296,
              InverseInterbankRate: 1.2053,
            },
            {
              PointInTime: 1614643200000,
              InterbankRate: 0.8281,
              InverseInterbankRate: 1.2076,
            },
            {
              PointInTime: 1614729600000,
              InterbankRate: 0.8282,
              InverseInterbankRate: 1.2074,
            },
            {
              PointInTime: 1614816000000,
              InterbankRate: 0.8301,
              InverseInterbankRate: 1.2047,
            },
            {
              PointInTime: 1614902400000,
              InterbankRate: 0.8397,
              InverseInterbankRate: 1.1909,
            },
            {
              PointInTime: 1614988800000,
              InterbankRate: 0.8392,
              InverseInterbankRate: 1.1916,
            },
            {
              PointInTime: 1615075200000,
              InterbankRate: 0.8392,
              InverseInterbankRate: 1.1916,
            },
            {
              PointInTime: 1615161600000,
              InterbankRate: 0.844,
              InverseInterbankRate: 1.1848,
            },
            {
              PointInTime: 1615248000000,
              InterbankRate: 0.8411,
              InverseInterbankRate: 1.1889,
            },
            {
              PointInTime: 1615334400000,
              InterbankRate: 0.8406,
              InverseInterbankRate: 1.1897,
            },
            {
              PointInTime: 1615420800000,
              InterbankRate: 0.835,
              InverseInterbankRate: 1.1976,
            },
            {
              PointInTime: 1615507200000,
              InterbankRate: 0.8365,
              InverseInterbankRate: 1.1955,
            },
            {
              PointInTime: 1615593600000,
              InterbankRate: 0.8366,
              InverseInterbankRate: 1.1953,
            },
            {
              PointInTime: 1615680000000,
              InterbankRate: 0.8366,
              InverseInterbankRate: 1.1953,
            },
            {
              PointInTime: 1615766400000,
              InterbankRate: 0.8385,
              InverseInterbankRate: 1.1926,
            },
            {
              PointInTime: 1615852800000,
              InterbankRate: 0.8407,
              InverseInterbankRate: 1.1895,
            },
            {
              PointInTime: 1615939200000,
              InterbankRate: 0.8401,
              InverseInterbankRate: 1.1903,
            },
            {
              PointInTime: 1616025600000,
              InterbankRate: 0.8386,
              InverseInterbankRate: 1.1925,
            },
            {
              PointInTime: 1616112000000,
              InterbankRate: 0.8399,
              InverseInterbankRate: 1.1906,
            },
            {
              PointInTime: 1616198400000,
              InterbankRate: 0.8369,
              InverseInterbankRate: 1.1948,
            },
            {
              PointInTime: 1616284800000,
              InterbankRate: 0.8369,
              InverseInterbankRate: 1.1948,
            },
            {
              PointInTime: 1616371200000,
              InterbankRate: 0.8377,
              InverseInterbankRate: 1.1937,
            },
            {
              PointInTime: 1616457600000,
              InterbankRate: 0.8429,
              InverseInterbankRate: 1.1864,
            },
            {
              PointInTime: 1616544000000,
              InterbankRate: 0.8456,
              InverseInterbankRate: 1.1825,
            },
            {
              PointInTime: 1616630400000,
              InterbankRate: 0.8497,
              InverseInterbankRate: 1.1768,
            },
            {
              PointInTime: 1616716800000,
              InterbankRate: 0.8477,
              InverseInterbankRate: 1.1797,
            },
            {
              PointInTime: 1616803200000,
              InterbankRate: 0.8457,
              InverseInterbankRate: 1.1824,
            },
            {
              PointInTime: 1616889600000,
              InterbankRate: 0.8457,
              InverseInterbankRate: 1.1824,
            },
            {
              PointInTime: 1616976000000,
              InterbankRate: 0.8493,
              InverseInterbankRate: 1.1774,
            },
            {
              PointInTime: 1617062400000,
              InterbankRate: 0.8532,
              InverseInterbankRate: 1.172,
            },
            {
              PointInTime: 1617148800000,
              InterbankRate: 0.8512,
              InverseInterbankRate: 1.1747,
            },
            {
              PointInTime: 1617235200000,
              InterbankRate: 0.8494,
              InverseInterbankRate: 1.1773,
            },
            {
              PointInTime: 1617321600000,
              InterbankRate: 0.8503,
              InverseInterbankRate: 1.1761,
            },
            {
              PointInTime: 1617494400000,
              InterbankRate: 0.8504,
              InverseInterbankRate: 1.1759,
            },
            {
              PointInTime: 1617580800000,
              InterbankRate: 0.8463,
              InverseInterbankRate: 1.1816,
            },
            {
              PointInTime: 1617667200000,
              InterbankRate: 0.8436,
              InverseInterbankRate: 1.1854,
            },
            {
              PointInTime: 1617753600000,
              InterbankRate: 0.8413,
              InverseInterbankRate: 1.1886,
            },
            {
              PointInTime: 1617840000000,
              InterbankRate: 0.8386,
              InverseInterbankRate: 1.1925,
            },
            {
              PointInTime: 1617926400000,
              InterbankRate: 0.8403,
              InverseInterbankRate: 1.1901,
            },
            {
              PointInTime: 1618012800000,
              InterbankRate: 0.8403,
              InverseInterbankRate: 1.1901,
            },
            {
              PointInTime: 1618099200000,
              InterbankRate: 0.8403,
              InverseInterbankRate: 1.1901,
            },
            {
              PointInTime: 1618185600000,
              InterbankRate: 0.8392,
              InverseInterbankRate: 1.1916,
            },
            {
              PointInTime: 1618272000000,
              InterbankRate: 0.8376,
              InverseInterbankRate: 1.1939,
            },
            {
              PointInTime: 1618358400000,
              InterbankRate: 0.8343,
              InverseInterbankRate: 1.1986,
            },
            {
              PointInTime: 1618444800000,
              InterbankRate: 0.8355,
              InverseInterbankRate: 1.1969,
            },
            {
              PointInTime: 1618531200000,
              InterbankRate: 0.8349,
              InverseInterbankRate: 1.1977,
            },
            {
              PointInTime: 1618617600000,
              InterbankRate: 0.8346,
              InverseInterbankRate: 1.1982,
            },
            {
              PointInTime: 1618704000000,
              InterbankRate: 0.8346,
              InverseInterbankRate: 1.1982,
            },
            {
              PointInTime: 1618790400000,
              InterbankRate: 0.8308,
              InverseInterbankRate: 1.2036,
            },
            {
              PointInTime: 1618876800000,
              InterbankRate: 0.8314,
              InverseInterbankRate: 1.2028,
            },
            {
              PointInTime: 1618963200000,
              InterbankRate: 0.831,
              InverseInterbankRate: 1.2033,
            },
            {
              PointInTime: 1619049600000,
              InterbankRate: 0.8327,
              InverseInterbankRate: 1.2009,
            },
            {
              PointInTime: 1619136000000,
              InterbankRate: 0.8279,
              InverseInterbankRate: 1.2078,
            },
            {
              PointInTime: 1619222400000,
              InterbankRate: 0.8266,
              InverseInterbankRate: 1.2097,
            },
            {
              PointInTime: 1619308800000,
              InterbankRate: 0.8266,
              InverseInterbankRate: 1.2097,
            },
            {
              PointInTime: 1619395200000,
              InterbankRate: 0.8272,
              InverseInterbankRate: 1.2089,
            },
            {
              PointInTime: 1619481600000,
              InterbankRate: 0.8285,
              InverseInterbankRate: 1.207,
            },
            {
              PointInTime: 1619568000000,
              InterbankRate: 0.8271,
              InverseInterbankRate: 1.2091,
            },
            {
              PointInTime: 1619654400000,
              InterbankRate: 0.8252,
              InverseInterbankRate: 1.2119,
            },
            {
              PointInTime: 1619740800000,
              InterbankRate: 0.8311,
              InverseInterbankRate: 1.2032,
            },
            {
              PointInTime: 1619827200000,
              InterbankRate: 0.832,
              InverseInterbankRate: 1.202,
            },
            {
              PointInTime: 1619913600000,
              InterbankRate: 0.832,
              InverseInterbankRate: 1.202,
            },
            {
              PointInTime: 1620000000000,
              InterbankRate: 0.8293,
              InverseInterbankRate: 1.2058,
            },
            {
              PointInTime: 1620086400000,
              InterbankRate: 0.832,
              InverseInterbankRate: 1.2019,
            },
            {
              PointInTime: 1620172800000,
              InterbankRate: 0.8336,
              InverseInterbankRate: 1.1997,
            },
            {
              PointInTime: 1620259200000,
              InterbankRate: 0.83,
              InverseInterbankRate: 1.2048,
            },
            {
              PointInTime: 1620345600000,
              InterbankRate: 0.8235,
              InverseInterbankRate: 1.2143,
            },
            {
              PointInTime: 1620432000000,
              InterbankRate: 0.8221,
              InverseInterbankRate: 1.2163,
            },
            {
              PointInTime: 1620518400000,
              InterbankRate: 0.8221,
              InverseInterbankRate: 1.2163,
            },
            {
              PointInTime: 1620604800000,
              InterbankRate: 0.8224,
              InverseInterbankRate: 1.216,
            },
            {
              PointInTime: 1620691200000,
              InterbankRate: 0.8221,
              InverseInterbankRate: 1.2164,
            },
            {
              PointInTime: 1620777600000,
              InterbankRate: 0.8286,
              InverseInterbankRate: 1.2069,
            },
            {
              PointInTime: 1620864000000,
              InterbankRate: 0.8272,
              InverseInterbankRate: 1.2089,
            },
            {
              PointInTime: 1620950400000,
              InterbankRate: 0.8239,
              InverseInterbankRate: 1.2137,
            },
            {
              PointInTime: 1621036800000,
              InterbankRate: 0.8233,
              InverseInterbankRate: 1.2146,
            },
            {
              PointInTime: 1621123200000,
              InterbankRate: 0.8233,
              InverseInterbankRate: 1.2146,
            },
            {
              PointInTime: 1621209600000,
              InterbankRate: 0.8225,
              InverseInterbankRate: 1.2158,
            },
            {
              PointInTime: 1621296000000,
              InterbankRate: 0.8186,
              InverseInterbankRate: 1.2216,
            },
            {
              PointInTime: 1621382400000,
              InterbankRate: 0.8188,
              InverseInterbankRate: 1.2212,
            },
            {
              PointInTime: 1621468800000,
              InterbankRate: 0.8184,
              InverseInterbankRate: 1.2219,
            },
            {
              PointInTime: 1621555200000,
              InterbankRate: 0.8215,
              InverseInterbankRate: 1.2172,
            },
            {
              PointInTime: 1621641600000,
              InterbankRate: 0.8209,
              InverseInterbankRate: 1.2181,
            },
            {
              PointInTime: 1621728000000,
              InterbankRate: 0.8209,
              InverseInterbankRate: 1.2181,
            },
            {
              PointInTime: 1621814400000,
              InterbankRate: 0.8188,
              InverseInterbankRate: 1.2213,
            },
            {
              PointInTime: 1621900800000,
              InterbankRate: 0.8172,
              InverseInterbankRate: 1.2237,
            },
            {
              PointInTime: 1621987200000,
              InterbankRate: 0.8195,
              InverseInterbankRate: 1.2203,
            },
            {
              PointInTime: 1622073600000,
              InterbankRate: 0.8204,
              InverseInterbankRate: 1.2189,
            },
            {
              PointInTime: 1622160000000,
              InterbankRate: 0.8195,
              InverseInterbankRate: 1.2203,
            },
            {
              PointInTime: 1622246400000,
              InterbankRate: 0.8202,
              InverseInterbankRate: 1.2193,
            },
            {
              PointInTime: 1622332800000,
              InterbankRate: 0.8202,
              InverseInterbankRate: 1.2193,
            },
            {
              PointInTime: 1622419200000,
              InterbankRate: 0.8178,
              InverseInterbankRate: 1.2229,
            },
            {
              PointInTime: 1622505600000,
              InterbankRate: 0.8173,
              InverseInterbankRate: 1.2235,
            },
            {
              PointInTime: 1622592000000,
              InterbankRate: 0.8188,
              InverseInterbankRate: 1.2212,
            },
            {
              PointInTime: 1622678400000,
              InterbankRate: 0.8248,
              InverseInterbankRate: 1.2124,
            },
            {
              PointInTime: 1622764800000,
              InterbankRate: 0.8221,
              InverseInterbankRate: 1.2164,
            },
            {
              PointInTime: 1622851200000,
              InterbankRate: 0.8219,
              InverseInterbankRate: 1.2167,
            },
            {
              PointInTime: 1622937600000,
              InterbankRate: 0.8219,
              InverseInterbankRate: 1.2167,
            },
            {
              PointInTime: 1623024000000,
              InterbankRate: 0.8199,
              InverseInterbankRate: 1.2196,
            },
            {
              PointInTime: 1623110400000,
              InterbankRate: 0.821,
              InverseInterbankRate: 1.218,
            },
            {
              PointInTime: 1623196800000,
              InterbankRate: 0.8213,
              InverseInterbankRate: 1.2176,
            },
            {
              PointInTime: 1623283200000,
              InterbankRate: 0.8212,
              InverseInterbankRate: 1.2177,
            },
            {
              PointInTime: 1623369600000,
              InterbankRate: 0.8265,
              InverseInterbankRate: 1.2099,
            },
            {
              PointInTime: 1623456000000,
              InterbankRate: 0.8258,
              InverseInterbankRate: 1.2109,
            },
            {
              PointInTime: 1623542400000,
              InterbankRate: 0.8258,
              InverseInterbankRate: 1.2109,
            },
            {
              PointInTime: 1623628800000,
              InterbankRate: 0.825,
              InverseInterbankRate: 1.212,
            },
            {
              PointInTime: 1623715200000,
              InterbankRate: 0.8246,
              InverseInterbankRate: 1.2127,
            },
            {
              PointInTime: 1623801600000,
              InterbankRate: 0.8255,
              InverseInterbankRate: 1.2114,
            },
            {
              PointInTime: 1623888000000,
              InterbankRate: 0.8405,
              InverseInterbankRate: 1.1898,
            },
            {
              PointInTime: 1623974400000,
              InterbankRate: 0.8422,
              InverseInterbankRate: 1.1874,
            },
            {
              PointInTime: 1624060800000,
              InterbankRate: 0.8429,
              InverseInterbankRate: 1.1864,
            },
            {
              PointInTime: 1624147200000,
              InterbankRate: 0.8429,
              InverseInterbankRate: 1.1864,
            },
            {
              PointInTime: 1624233600000,
              InterbankRate: 0.839,
              InverseInterbankRate: 1.1919,
            },
            {
              PointInTime: 1624320000000,
              InterbankRate: 0.8379,
              InverseInterbankRate: 1.1935,
            },
            {
              PointInTime: 1624406400000,
              InterbankRate: 0.8377,
              InverseInterbankRate: 1.1937,
            },
            {
              PointInTime: 1624492800000,
              InterbankRate: 0.8382,
              InverseInterbankRate: 1.193,
            },
            {
              PointInTime: 1624579200000,
              InterbankRate: 0.8378,
              InverseInterbankRate: 1.1936,
            },
            {
              PointInTime: 1624665600000,
              InterbankRate: 0.8378,
              InverseInterbankRate: 1.1936,
            },
            {
              PointInTime: 1624752000000,
              InterbankRate: 0.8378,
              InverseInterbankRate: 1.1936,
            },
            {
              PointInTime: 1624838400000,
              InterbankRate: 0.8388,
              InverseInterbankRate: 1.1922,
            },
            {
              PointInTime: 1624924800000,
              InterbankRate: 0.8405,
              InverseInterbankRate: 1.1898,
            },
            {
              PointInTime: 1625011200000,
              InterbankRate: 0.8438,
              InverseInterbankRate: 1.1851,
            },
            {
              PointInTime: 1625097600000,
              InterbankRate: 0.8441,
              InverseInterbankRate: 1.1847,
            },
            {
              PointInTime: 1625184000000,
              InterbankRate: 0.8445,
              InverseInterbankRate: 1.1841,
            },
            {
              PointInTime: 1625270400000,
              InterbankRate: 0.8428,
              InverseInterbankRate: 1.1865,
            },
            {
              PointInTime: 1625356800000,
              InterbankRate: 0.8428,
              InverseInterbankRate: 1.1865,
            },
            {
              PointInTime: 1625443200000,
              InterbankRate: 0.8426,
              InverseInterbankRate: 1.1867,
            },
            {
              PointInTime: 1625529600000,
              InterbankRate: 0.8465,
              InverseInterbankRate: 1.1814,
            },
            {
              PointInTime: 1625616000000,
              InterbankRate: 0.8474,
              InverseInterbankRate: 1.1801,
            },
            {
              PointInTime: 1625702400000,
              InterbankRate: 0.8443,
              InverseInterbankRate: 1.1844,
            },
            {
              PointInTime: 1625788800000,
              InterbankRate: 0.8426,
              InverseInterbankRate: 1.1868,
            },
            {
              PointInTime: 1625875200000,
              InterbankRate: 0.842,
              InverseInterbankRate: 1.1877,
            },
            {
              PointInTime: 1625961600000,
              InterbankRate: 0.842,
              InverseInterbankRate: 1.1877,
            },
            {
              PointInTime: 1626048000000,
              InterbankRate: 0.8434,
              InverseInterbankRate: 1.1857,
            },
            {
              PointInTime: 1626134400000,
              InterbankRate: 0.8471,
              InverseInterbankRate: 1.1805,
            },
            {
              PointInTime: 1626220800000,
              InterbankRate: 0.845,
              InverseInterbankRate: 1.1834,
            },
            {
              PointInTime: 1626307200000,
              InterbankRate: 0.8474,
              InverseInterbankRate: 1.1801,
            },
            {
              PointInTime: 1626393600000,
              InterbankRate: 0.8469,
              InverseInterbankRate: 1.1807,
            },
            {
              PointInTime: 1626480000000,
              InterbankRate: 0.8471,
              InverseInterbankRate: 1.1805,
            },
            {
              PointInTime: 1626566400000,
              InterbankRate: 0.8471,
              InverseInterbankRate: 1.1805,
            },
            {
              PointInTime: 1626652800000,
              InterbankRate: 0.8474,
              InverseInterbankRate: 1.1801,
            },
            {
              PointInTime: 1626739200000,
              InterbankRate: 0.8494,
              InverseInterbankRate: 1.1774,
            },
            {
              PointInTime: 1626825600000,
              InterbankRate: 0.8479,
              InverseInterbankRate: 1.1793,
            },
            {
              PointInTime: 1626912000000,
              InterbankRate: 0.8502,
              InverseInterbankRate: 1.1762,
            },
            {
              PointInTime: 1626998400000,
              InterbankRate: 0.8499,
              InverseInterbankRate: 1.1767,
            },
            {
              PointInTime: 1627084800000,
              InterbankRate: 0.8495,
              InverseInterbankRate: 1.1771,
            },
            {
              PointInTime: 1627171200000,
              InterbankRate: 0.8495,
              InverseInterbankRate: 1.1771,
            },
            {
              PointInTime: 1627257600000,
              InterbankRate: 0.8467,
              InverseInterbankRate: 1.1811,
            },
            {
              PointInTime: 1627344000000,
              InterbankRate: 0.845,
              InverseInterbankRate: 1.1834,
            },
            {
              PointInTime: 1627430400000,
              InterbankRate: 0.8464,
              InverseInterbankRate: 1.1814,
            },
            {
              PointInTime: 1627516800000,
              InterbankRate: 0.8417,
              InverseInterbankRate: 1.188,
            },
            {
              PointInTime: 1627603200000,
              InterbankRate: 0.8432,
              InverseInterbankRate: 1.186,
            },
            {
              PointInTime: 1627689600000,
              InterbankRate: 0.8427,
              InverseInterbankRate: 1.1867,
            },
            {
              PointInTime: 1627776000000,
              InterbankRate: 0.8427,
              InverseInterbankRate: 1.1867,
            },
            {
              PointInTime: 1627862400000,
              InterbankRate: 0.8424,
              InverseInterbankRate: 1.1871,
            },
            {
              PointInTime: 1627948800000,
              InterbankRate: 0.8426,
              InverseInterbankRate: 1.1867,
            },
            {
              PointInTime: 1628035200000,
              InterbankRate: 0.8446,
              InverseInterbankRate: 1.184,
            },
            {
              PointInTime: 1628121600000,
              InterbankRate: 0.8447,
              InverseInterbankRate: 1.1838,
            },
            {
              PointInTime: 1628208000000,
              InterbankRate: 0.8506,
              InverseInterbankRate: 1.1756,
            },
            {
              PointInTime: 1628294400000,
              InterbankRate: 0.8501,
              InverseInterbankRate: 1.1763,
            },
            {
              PointInTime: 1628380800000,
              InterbankRate: 0.8501,
              InverseInterbankRate: 1.1763,
            },
            {
              PointInTime: 1628467200000,
              InterbankRate: 0.8516,
              InverseInterbankRate: 1.1743,
            },
            {
              PointInTime: 1628553600000,
              InterbankRate: 0.8534,
              InverseInterbankRate: 1.1718,
            },
            {
              PointInTime: 1628640000000,
              InterbankRate: 0.8515,
              InverseInterbankRate: 1.1744,
            },
            {
              PointInTime: 1628726400000,
              InterbankRate: 0.8518,
              InverseInterbankRate: 1.174,
            },
            {
              PointInTime: 1628812800000,
              InterbankRate: 0.8474,
              InverseInterbankRate: 1.1801,
            },
            {
              PointInTime: 1628899200000,
              InterbankRate: 0.8477,
              InverseInterbankRate: 1.1796,
            },
            {
              PointInTime: 1628985600000,
              InterbankRate: 0.8477,
              InverseInterbankRate: 1.1796,
            },
            {
              PointInTime: 1629072000000,
              InterbankRate: 0.8491,
              InverseInterbankRate: 1.1777,
            },
            {
              PointInTime: 1629158400000,
              InterbankRate: 0.8538,
              InverseInterbankRate: 1.1712,
            },
            {
              PointInTime: 1629244800000,
              InterbankRate: 0.8545,
              InverseInterbankRate: 1.1702,
            },
            {
              PointInTime: 1629331200000,
              InterbankRate: 0.8555,
              InverseInterbankRate: 1.1688,
            },
            {
              PointInTime: 1629417600000,
              InterbankRate: 0.8544,
              InverseInterbankRate: 1.1703,
            },
            {
              PointInTime: 1629504000000,
              InterbankRate: 0.8549,
              InverseInterbankRate: 1.1697,
            },
            {
              PointInTime: 1629590400000,
              InterbankRate: 0.8549,
              InverseInterbankRate: 1.1697,
            },
            {
              PointInTime: 1629676800000,
              InterbankRate: 0.852,
              InverseInterbankRate: 1.1737,
            },
            {
              PointInTime: 1629763200000,
              InterbankRate: 0.8514,
              InverseInterbankRate: 1.1745,
            },
            {
              PointInTime: 1629849600000,
              InterbankRate: 0.8503,
              InverseInterbankRate: 1.1761,
            },
            {
              PointInTime: 1629936000000,
              InterbankRate: 0.8505,
              InverseInterbankRate: 1.1758,
            },
            {
              PointInTime: 1630022400000,
              InterbankRate: 0.8474,
              InverseInterbankRate: 1.1801,
            },
            {
              PointInTime: 1630108800000,
              InterbankRate: 0.8478,
              InverseInterbankRate: 1.1795,
            },
            {
              PointInTime: 1630195200000,
              InterbankRate: 0.8478,
              InverseInterbankRate: 1.1795,
            },
            {
              PointInTime: 1630281600000,
              InterbankRate: 0.8477,
              InverseInterbankRate: 1.1796,
            },
            {
              PointInTime: 1630368000000,
              InterbankRate: 0.847,
              InverseInterbankRate: 1.1807,
            },
            {
              PointInTime: 1630454400000,
              InterbankRate: 0.844,
              InverseInterbankRate: 1.1848,
            },
            {
              PointInTime: 1630540800000,
              InterbankRate: 0.8429,
              InverseInterbankRate: 1.1864,
            },
            {
              PointInTime: 1630627200000,
              InterbankRate: 0.8412,
              InverseInterbankRate: 1.1888,
            },
            {
              PointInTime: 1630713600000,
              InterbankRate: 0.8415,
              InverseInterbankRate: 1.1883,
            },
            {
              PointInTime: 1630800000000,
              InterbankRate: 0.8415,
              InverseInterbankRate: 1.1883,
            },
            {
              PointInTime: 1630886400000,
              InterbankRate: 0.8424,
              InverseInterbankRate: 1.187,
            },
            {
              PointInTime: 1630972800000,
              InterbankRate: 0.8442,
              InverseInterbankRate: 1.1846,
            },
            {
              PointInTime: 1631059200000,
              InterbankRate: 0.8459,
              InverseInterbankRate: 1.1822,
            },
            {
              PointInTime: 1631145600000,
              InterbankRate: 0.8451,
              InverseInterbankRate: 1.1832,
            },
            {
              PointInTime: 1631232000000,
              InterbankRate: 0.8461,
              InverseInterbankRate: 1.1819,
            },
            {
              PointInTime: 1631318400000,
              InterbankRate: 0.8464,
              InverseInterbankRate: 1.1815,
            },
            {
              PointInTime: 1631404800000,
              InterbankRate: 0.8464,
              InverseInterbankRate: 1.1815,
            },
            {
              PointInTime: 1631491200000,
              InterbankRate: 0.8469,
              InverseInterbankRate: 1.1808,
            },
            {
              PointInTime: 1631577600000,
              InterbankRate: 0.8459,
              InverseInterbankRate: 1.1821,
            },
            {
              PointInTime: 1631664000000,
              InterbankRate: 0.8471,
              InverseInterbankRate: 1.1805,
            },
            {
              PointInTime: 1631750400000,
              InterbankRate: 0.8502,
              InverseInterbankRate: 1.1762,
            },
            {
              PointInTime: 1631836800000,
              InterbankRate: 0.8528,
              InverseInterbankRate: 1.1726,
            },
            {
              PointInTime: 1631923200000,
              InterbankRate: 0.8528,
              InverseInterbankRate: 1.1726,
            },
            {
              PointInTime: 1632009600000,
              InterbankRate: 0.8528,
              InverseInterbankRate: 1.1726,
            },
            {
              PointInTime: 1632096000000,
              InterbankRate: 0.8528,
              InverseInterbankRate: 1.1726,
            },
            {
              PointInTime: 1632182400000,
              InterbankRate: 0.8528,
              InverseInterbankRate: 1.1727,
            },
            {
              PointInTime: 1632268800000,
              InterbankRate: 0.852,
              InverseInterbankRate: 1.1736,
            },
            {
              PointInTime: 1632355200000,
              InterbankRate: 0.8517,
              InverseInterbankRate: 1.1741,
            },
            {
              PointInTime: 1632441600000,
              InterbankRate: 0.8535,
              InverseInterbankRate: 1.1716,
            },
            {
              PointInTime: 1632528000000,
              InterbankRate: 0.8532,
              InverseInterbankRate: 1.172,
            },
            {
              PointInTime: 1632614400000,
              InterbankRate: 0.8532,
              InverseInterbankRate: 1.172,
            },
            {
              PointInTime: 1632700800000,
              InterbankRate: 0.8545,
              InverseInterbankRate: 1.1703,
            },
            {
              PointInTime: 1632787200000,
              InterbankRate: 0.8559,
              InverseInterbankRate: 1.1683,
            },
            {
              PointInTime: 1632873600000,
              InterbankRate: 0.8619,
              InverseInterbankRate: 1.1602,
            },
            {
              PointInTime: 1632960000000,
              InterbankRate: 0.864,
              InverseInterbankRate: 1.1573,
            },
            {
              PointInTime: 1633046400000,
              InterbankRate: 0.8621,
              InverseInterbankRate: 1.16,
            },
            {
              PointInTime: 1633132800000,
              InterbankRate: 0.8624,
              InverseInterbankRate: 1.1596,
            },
            {
              PointInTime: 1633219200000,
              InterbankRate: 0.8624,
              InverseInterbankRate: 1.1596,
            },
            {
              PointInTime: 1633305600000,
              InterbankRate: 0.8605,
              InverseInterbankRate: 1.1621,
            },
            {
              PointInTime: 1633392000000,
              InterbankRate: 0.8617,
              InverseInterbankRate: 1.1605,
            },
            {
              PointInTime: 1633478400000,
              InterbankRate: 0.8663,
              InverseInterbankRate: 1.1543,
            },
            {
              PointInTime: 1633564800000,
              InterbankRate: 0.8655,
              InverseInterbankRate: 1.1554,
            },
            {
              PointInTime: 1633651200000,
              InterbankRate: 0.8646,
              InverseInterbankRate: 1.1566,
            },
            {
              PointInTime: 1633737600000,
              InterbankRate: 0.8639,
              InverseInterbankRate: 1.1575,
            },
            {
              PointInTime: 1633824000000,
              InterbankRate: 0.8639,
              InverseInterbankRate: 1.1575,
            },
            {
              PointInTime: 1633910400000,
              InterbankRate: 0.8649,
              InverseInterbankRate: 1.1562,
            },
            {
              PointInTime: 1633996800000,
              InterbankRate: 0.8673,
              InverseInterbankRate: 1.153,
            },
            {
              PointInTime: 1634083200000,
              InterbankRate: 0.8638,
              InverseInterbankRate: 1.1577,
            },
            {
              PointInTime: 1634169600000,
              InterbankRate: 0.8631,
              InverseInterbankRate: 1.1586,
            },
            {
              PointInTime: 1634256000000,
              InterbankRate: 0.8623,
              InverseInterbankRate: 1.1597,
            },
            {
              PointInTime: 1634342400000,
              InterbankRate: 0.8621,
              InverseInterbankRate: 1.1599,
            },
            {
              PointInTime: 1634428800000,
              InterbankRate: 0.8621,
              InverseInterbankRate: 1.1599,
            },
            {
              PointInTime: 1634515200000,
              InterbankRate: 0.8606,
              InverseInterbankRate: 1.162,
            },
            {
              PointInTime: 1634601600000,
              InterbankRate: 0.8595,
              InverseInterbankRate: 1.1635,
            },
            {
              PointInTime: 1634688000000,
              InterbankRate: 0.8579,
              InverseInterbankRate: 1.1656,
            },
            {
              PointInTime: 1634774400000,
              InterbankRate: 0.8592,
              InverseInterbankRate: 1.1639,
            },
            {
              PointInTime: 1634860800000,
              InterbankRate: 0.8596,
              InverseInterbankRate: 1.1634,
            },
            {
              PointInTime: 1634947200000,
              InterbankRate: 0.8586,
              InverseInterbankRate: 1.1647,
            },
            {
              PointInTime: 1635033600000,
              InterbankRate: 0.8586,
              InverseInterbankRate: 1.1647,
            },
            {
              PointInTime: 1635120000000,
              InterbankRate: 0.8616,
              InverseInterbankRate: 1.1607,
            },
            {
              PointInTime: 1635206400000,
              InterbankRate: 0.8631,
              InverseInterbankRate: 1.1586,
            },
            {
              PointInTime: 1635292800000,
              InterbankRate: 0.8616,
              InverseInterbankRate: 1.1607,
            },
            {
              PointInTime: 1635379200000,
              InterbankRate: 0.8559,
              InverseInterbankRate: 1.1683,
            },
            {
              PointInTime: 1635465600000,
              InterbankRate: 0.8665,
              InverseInterbankRate: 1.154,
            },
            {
              PointInTime: 1635552000000,
              InterbankRate: 0.865,
              InverseInterbankRate: 1.1561,
            },
            {
              PointInTime: 1635638400000,
              InterbankRate: 0.865,
              InverseInterbankRate: 1.1561,
            },
            {
              PointInTime: 1635724800000,
              InterbankRate: 0.8627,
              InverseInterbankRate: 1.1592,
            },
            {
              PointInTime: 1635811200000,
              InterbankRate: 0.8637,
              InverseInterbankRate: 1.1578,
            },
            {
              PointInTime: 1635897600000,
              InterbankRate: 0.8635,
              InverseInterbankRate: 1.1581,
            },
            {
              PointInTime: 1635984000000,
              InterbankRate: 0.8665,
              InverseInterbankRate: 1.1541,
            },
            {
              PointInTime: 1636070400000,
              InterbankRate: 0.8647,
              InverseInterbankRate: 1.1564,
            },
            {
              PointInTime: 1636329600000,
              InterbankRate: 0.8627,
              InverseInterbankRate: 1.1591,
            },
            {
              PointInTime: 1636416000000,
              InterbankRate: 0.8632,
              InverseInterbankRate: 1.1585,
            },
            {
              PointInTime: 1636502400000,
              InterbankRate: 0.868,
              InverseInterbankRate: 1.152,
            },
            {
              PointInTime: 1636588800000,
              InterbankRate: 0.872,
              InverseInterbankRate: 1.1467,
            },
            {
              PointInTime: 1636675200000,
              InterbankRate: 0.8736,
              InverseInterbankRate: 1.1447,
            },
            {
              PointInTime: 1636761600000,
              InterbankRate: 0.8739,
              InverseInterbankRate: 1.1443,
            },
            {
              PointInTime: 1636848000000,
              InterbankRate: 0.8739,
              InverseInterbankRate: 1.1443,
            },
            {
              PointInTime: 1636934400000,
              InterbankRate: 0.8758,
              InverseInterbankRate: 1.1418,
            },
            {
              PointInTime: 1637020800000,
              InterbankRate: 0.8821,
              InverseInterbankRate: 1.1337,
            },
            {
              PointInTime: 1637107200000,
              InterbankRate: 0.8839,
              InverseInterbankRate: 1.1313,
            },
            {
              PointInTime: 1637193600000,
              InterbankRate: 0.8805,
              InverseInterbankRate: 1.1357,
            },
            {
              PointInTime: 1637280000000,
              InterbankRate: 0.8838,
              InverseInterbankRate: 1.1315,
            },
            {
              PointInTime: 1637366400000,
              InterbankRate: 0.8865,
              InverseInterbankRate: 1.128,
            },
            {
              PointInTime: 1637452800000,
              InterbankRate: 0.8865,
              InverseInterbankRate: 1.128,
            },
            {
              PointInTime: 1637539200000,
              InterbankRate: 0.8882,
              InverseInterbankRate: 1.1259,
            },
            {
              PointInTime: 1637625600000,
              InterbankRate: 0.8878,
              InverseInterbankRate: 1.1264,
            },
            {
              PointInTime: 1637712000000,
              InterbankRate: 0.8931,
              InverseInterbankRate: 1.1197,
            },
            {
              PointInTime: 1637798400000,
              InterbankRate: 0.8917,
              InverseInterbankRate: 1.1215,
            },
            {
              PointInTime: 1637884800000,
              InterbankRate: 0.8843,
              InverseInterbankRate: 1.1308,
            },
            {
              PointInTime: 1637971200000,
              InterbankRate: 0.8835,
              InverseInterbankRate: 1.1319,
            },
            {
              PointInTime: 1638057600000,
              InterbankRate: 0.8835,
              InverseInterbankRate: 1.1319,
            },
            {
              PointInTime: 1638144000000,
              InterbankRate: 0.8878,
              InverseInterbankRate: 1.1263,
            },
            {
              PointInTime: 1638230400000,
              InterbankRate: 0.8862,
              InverseInterbankRate: 1.1284,
            },
            {
              PointInTime: 1638316800000,
              InterbankRate: 0.8832,
              InverseInterbankRate: 1.1323,
            },
            {
              PointInTime: 1638403200000,
              InterbankRate: 0.8839,
              InverseInterbankRate: 1.1313,
            },
            {
              PointInTime: 1638489600000,
              InterbankRate: 0.8843,
              InverseInterbankRate: 1.1309,
            },
            {
              PointInTime: 1638576000000,
              InterbankRate: 0.8839,
              InverseInterbankRate: 1.1313,
            },
            {
              PointInTime: 1638662400000,
              InterbankRate: 0.8839,
              InverseInterbankRate: 1.1313,
            },
            {
              PointInTime: 1638748800000,
              InterbankRate: 0.8862,
              InverseInterbankRate: 1.1284,
            },
            {
              PointInTime: 1638835200000,
              InterbankRate: 0.889,
              InverseInterbankRate: 1.1249,
            },
            {
              PointInTime: 1638921600000,
              InterbankRate: 0.8826,
              InverseInterbankRate: 1.133,
            },
            {
              PointInTime: 1639008000000,
              InterbankRate: 0.8862,
              InverseInterbankRate: 1.1284,
            },
            {
              PointInTime: 1639094400000,
              InterbankRate: 0.8835,
              InverseInterbankRate: 1.1319,
            },
            {
              PointInTime: 1639180800000,
              InterbankRate: 0.8836,
              InverseInterbankRate: 1.1317,
            },
            {
              PointInTime: 1639267200000,
              InterbankRate: 0.8836,
              InverseInterbankRate: 1.1317,
            },
            {
              PointInTime: 1639353600000,
              InterbankRate: 0.8853,
              InverseInterbankRate: 1.1296,
            },
            {
              PointInTime: 1639440000000,
              InterbankRate: 0.8875,
              InverseInterbankRate: 1.1268,
            },
            {
              PointInTime: 1639526400000,
              InterbankRate: 0.8881,
              InverseInterbankRate: 1.126,
            },
            {
              PointInTime: 1639612800000,
              InterbankRate: 0.8841,
              InverseInterbankRate: 1.131,
            },
            {
              PointInTime: 1639699200000,
              InterbankRate: 0.8872,
              InverseInterbankRate: 1.1272,
            },
            {
              PointInTime: 1639785600000,
              InterbankRate: 0.8898,
              InverseInterbankRate: 1.1238,
            },
            {
              PointInTime: 1639872000000,
              InterbankRate: 0.8898,
              InverseInterbankRate: 1.1238,
            },
            {
              PointInTime: 1639958400000,
              InterbankRate: 0.8855,
              InverseInterbankRate: 1.1292,
            },
            {
              PointInTime: 1640044800000,
              InterbankRate: 0.8878,
              InverseInterbankRate: 1.1264,
            },
            {
              PointInTime: 1640131200000,
              InterbankRate: 0.8834,
              InverseInterbankRate: 1.132,
            },
            {
              PointInTime: 1640217600000,
              InterbankRate: 0.8834,
              InverseInterbankRate: 1.132,
            },
            {
              PointInTime: 1640304000000,
              InterbankRate: 0.8841,
              InverseInterbankRate: 1.1311,
            },
            {
              PointInTime: 1640390400000,
              InterbankRate: 0.8818,
              InverseInterbankRate: 1.134,
            },
            {
              PointInTime: 1640476800000,
              InterbankRate: 0.8818,
              InverseInterbankRate: 1.134,
            },
            {
              PointInTime: 1640563200000,
              InterbankRate: 0.8826,
              InverseInterbankRate: 1.1331,
            },
            {
              PointInTime: 1640649600000,
              InterbankRate: 0.8838,
              InverseInterbankRate: 1.1314,
            },
            {
              PointInTime: 1640736000000,
              InterbankRate: 0.8817,
              InverseInterbankRate: 1.1342,
            },
            {
              PointInTime: 1640822400000,
              InterbankRate: 0.8835,
              InverseInterbankRate: 1.1319,
            },
            {
              PointInTime: 1640908800000,
              InterbankRate: 0.879,
              InverseInterbankRate: 1.1377,
            },
            {
              PointInTime: 1640995200000,
              InterbankRate: 0.8794,
              InverseInterbankRate: 1.1371,
            },
            {
              PointInTime: 1641081600000,
              InterbankRate: 0.8794,
              InverseInterbankRate: 1.1371,
            },
            {
              PointInTime: 1641168000000,
              InterbankRate: 0.8861,
              InverseInterbankRate: 1.1285,
            },
            {
              PointInTime: 1641254400000,
              InterbankRate: 0.8856,
              InverseInterbankRate: 1.1291,
            },
            {
              PointInTime: 1641340800000,
              InterbankRate: 0.8825,
              InverseInterbankRate: 1.1331,
            },
            {
              PointInTime: 1641427200000,
              InterbankRate: 0.8845,
              InverseInterbankRate: 1.1306,
            },
          ],
        },
      };
      const REGULAR_RATE = sample.data.CurrentInterbankRate;
      const INVERSE_RATE = 1 / REGULAR_RATE;
      const HISTORY_DATA = sample.data.HistoricalPoints;
      res.status(200).json({
        REGULAR_RATE,
        INVERSE_RATE,
        HISTORY_DATA,
      });
      return;
    }

    const { FROM_CURRENCY_CODE, TO_CURRENCY_CODE, withHistory } = req.body;
    try {
      const ALT_API_URL = process.env.ALT_CONVERTER_URL!;

      const { HISTORY_DATA, REGULAR_RATE, INVERSE_RATE } =
        await getAltConverterData({
          FROM_CURRENCY_CODE,
          TO_CURRENCY_CODE,
          period: TimePeriod.YEAR,
          ALT_API_URL,
        });
      console.log(REGULAR_RATE);

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
        const formattedHistoryData = Object.entries(HISTORY_DATA).map(
          (historyItem) => {
            const [date, value] = historyItem;
            const unixMillisecondsDate = Date.parse(date);
            return {
              PointInTime: unixMillisecondsDate,
              InterbankRate: Number(value),
            };
          }
        );
        res.status(200).json({
          REGULAR_RATE,
          INVERSE_RATE,
          HISTORY_DATA: formattedHistoryData,
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

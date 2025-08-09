import axios from "axios";

type LatestRateResponse = {
  // data.[currency] e.g. data.EUR
  data: Record<string, number>;
};

type HistoryRateResponse = {
  // data.[date].[currency]. e.g. data.2025-08-09.EUR
  data: Record<string, Record<string, number>>;
};

export async function getConverterData(
  fromCurrencyCode: string,
  toCurrencyCode: string
): Promise<{
  latestRate: LatestRateResponse;
  historyRate: HistoryRateResponse;
  formattedDate: string;
}> {
  // Use yesterday's date in UTC to satisfy "date must be before or equal to now" constraint
  const now = new Date();
  const utcYear = now.getUTCFullYear();
  const utcMonth = now.getUTCMonth();
  const utcDay = now.getUTCDate();
  const yesterdayUtc = new Date(Date.UTC(utcYear, utcMonth, utcDay - 1));
  const yyyy = yesterdayUtc.getUTCFullYear();
  const mm = String(yesterdayUtc.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(yesterdayUtc.getUTCDate()).padStart(2, "0");
  const formattedDate = `${yyyy}-${mm}-${dd}`;

  const latestRateUrl = new URL(`${process.env.CONVERTER_BASE_URL!}/latest`);
  latestRateUrl.searchParams.set("apikey", process.env.CONVERTER_API_KEY!);
  latestRateUrl.searchParams.set("base_currency", fromCurrencyCode);
  latestRateUrl.searchParams.set("currencies", toCurrencyCode);

  const latestRateResponse = await axios.get(latestRateUrl.toString());
  const latestRate = latestRateResponse.data;

  // Sequentially request 4 past days: yesterday, -2, -3, -4 (UTC)
  const historyDataAggregate: Record<string, Record<string, number>> = {};
  for (let offset = 1; offset <= 4; offset += 1) {
    const d = new Date(Date.UTC(utcYear, utcMonth, utcDay - offset));
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${day}`;

    const historyRateUrl = new URL(
      `${process.env.CONVERTER_BASE_URL!}/historical`
    );
    historyRateUrl.searchParams.set("apikey", process.env.CONVERTER_API_KEY!);
    historyRateUrl.searchParams.set("date", dateStr);
    historyRateUrl.searchParams.set("base_currency", fromCurrencyCode);
    historyRateUrl.searchParams.set("currencies", toCurrencyCode);

    try {
      const historyRateResponse = await axios.get(historyRateUrl.toString());
      const respData = historyRateResponse.data?.data as Record<
        string,
        Record<string, number>
      >;
      if (respData && respData[dateStr]) {
        historyDataAggregate[dateStr] = respData[dateStr];
      }
    } catch (err) {
      console.error("Historical request failed for", dateStr, err);
    }
  }

  const historyRate: HistoryRateResponse = { data: historyDataAggregate };
  return { latestRate, historyRate, formattedDate };
}

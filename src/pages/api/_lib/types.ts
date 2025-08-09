export enum TimePeriod {
  DAY = "day",
  MONTH = "month",
  HALF_YEAR = "6months",
  YEAR = "year",
}

export interface FreeQueryProps {
  currencyPair: string;
  withHistory: boolean;
}

export interface HistoryPoint {
  PointInTime: number;
  InterbankRate: number;
  InverseInterbankRate?: number;
}

export type ConversionInfo = {
  REGULAR_RATE: number;
  INVERSE_RATE?: number;
  HISTORY_DATA?: HistoryPoint[];
  message?: string;
};

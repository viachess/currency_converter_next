import * as d3 from "d3";
import { HistoryDataContainer, HistoryObject } from "./types";

export const formatHistoryData = (data: any): HistoryDataContainer => {
  const regular: HistoryObject[] = [];
  const inverse: HistoryObject[] = [];

  data.forEach((currencyObject: any) => {
    const { PointInTime, InterbankRate } = currencyObject;
    const parsedUnixDate = d3.timeParse("%Q")(PointInTime);
    const inverseRate = 1 / InterbankRate;

    regular.push({
      date: parsedUnixDate!,
      value: InterbankRate,
    });
    inverse.push({
      date: parsedUnixDate!,
      value: inverseRate,
    });
  });

  return {
    regular,
    inverse,
  };
};

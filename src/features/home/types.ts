export enum CurrentRateMode {
  regular = "regular",
  inverse = "inverse",
}

export interface CurrencyRateState {
  regular: number;
  inverse: number;
}

export interface HistoryObject {
  date: Date;
  value: number;
}

export interface HistoryDataContainer {
  regular: HistoryObject[];
  inverse: HistoryObject[];
}

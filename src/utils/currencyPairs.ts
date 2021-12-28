type CurrencyDescription = string;
type CurrencyCode = string;

export interface CurrencyHashTable {
  readonly [code: CurrencyCode]: CurrencyDescription;
}

// export const currencyPairs: Record<string, string> = {
export const currencyPairs: CurrencyHashTable = {
  AED: "United Arab Emirates Dirham",
  ARS: "Argentine Peso",
  AUD: "Australian Dollar",
  AZN: "Azerbaijani Manat",
  BGN: "Bulgarian Lev",
  BHD: "Bahraini Dinar",
  BND: "Brunei Dollar",
  BRL: "Brazilian Real",
  CAD: "Canadian Dollar",
  CHF: "Swiss Franc",
  CLP: "Chilean Peso",
  CNY: "Chinese Yuan",
  CZK: "Czech Koruna",
  DKK: "Danish Krone",
  EGP: "Egyptian Pound",
  EUR: "Euro",
  FJD: "Fiji Dollar",
  GBP: "Pound Sterling",
  HKD: "Hong Kong Dollar",
  HUF: "Hungarian Forint",
  IDR: "Indonesian rRpiah",
  ILS: "Israeli New Shekel",
  INR: "Indian Rupee",
  JPY: "Japanese Yen",
  KRW: "South Korean Won",
  KWD: "Kuwaiti Dinar",
  LKR: "Sri Lankan Rupee",
  MAD: "Moroccan Dirham",
  MGA: "Malagasy Ariary",
  MXN: "Mexican Peso",
  MYR: "Malaysian Ringgit",
  NOK: "Norwegian Krone",
  NZD: "New Zealand Dollar",
  OMR: "Omani Rial",
  PEN: "Peruvian Sol",
  PGK: "Papua New Guinean Kina",
  PHP: "Philippine Peso",
  PKR: "Pakistani Rupee",
  PLN: "Polish Złoty",
  RUB: "Russian Ruble",
  SAR: "Saudi Riyal",
  SBD: "Solomon Islands Dollar",
  SCR: "Seychelles Rupee",
  SEK: "Swedish Krona/Kronor",
  SGD: "Singapore Dollar",
  THB: "Thai Baht",
  TOP: "Tongan pPaʻanga",
  TRY: "Turkish Lira",
  TWD: "New Taiwan Dollar",
  TZS: "Tanzanian Shilling",
  USD: "United States Dollar",
  VEF: "Venezuelan Bolívar",
  VND: "Vietnamese Dồng",
  VUV: "Vanuatu Vatu",
  WST: "Samoan Tala",
  XOF: "CFA Franc BCEAO",
  ZAR: "South African Rand",
};

export interface CurrencySelectOption {
  value: CurrencyCode;
  label: string;
}

export const getSelectOptions = (pairsObject: CurrencyHashTable) => {
  const formattedSelectOptions: CurrencySelectOption[] = Object.entries(
    pairsObject
  ).map((entry) => {
    const [currencyCode, currencyDescription] = entry;
    return {
      value: currencyCode,
      label: `${currencyCode} - ${currencyDescription}`,
    };
  });
  return formattedSelectOptions;
};
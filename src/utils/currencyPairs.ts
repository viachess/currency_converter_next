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
  VND: "Vietnamese Dồng",
  VUV: "Vanuatu Vatu",
  WST: "Samoan Tala",
  XOF: "CFA Franc BCEAO",
  ZAR: "South African Rand",
};

export interface CurrencySelectOption {
  label: string;
  value: CurrencyCode;
}

export const getSelectOptions = (pairsObject: CurrencyHashTable) => {
  const formattedSelectOptions: CurrencySelectOption[] = Object.entries(
    pairsObject
  ).map((entry) => {
    const [currencyCode, currencyDescription] = entry;
    return {
      label: `${currencyCode} - ${currencyDescription}`,
      value: currencyCode,
    };
  });
  return formattedSelectOptions;
};

export interface FlagObject {
  readonly [code: string]: string;
}

export const flagPathObject: FlagObject = {
  USD: "/flag_images/USD.svg",
  EUR: "/flag_images/EUR.svg",
  JPY: "/flag_images/JPY.svg",
  GBP: "/flag_images/GBP.svg",
  AUD: "/flag_images/AUD.svg",
  CAD: "/flag_images/CAD.svg",
  CHF: "/flag_images/CHF.svg",
  CNY: "/flag_images/CNY.svg",
  HKD: "/flag_images/HKD.svg",
  NZD: "/flag_images/NZD.svg",
  SEK: "/flag_images/SEK.svg",
  KRW: "/flag_images/KRW.svg",
  SGD: "/flag_images/SGD.svg",
  NOK: "/flag_images/NOK.svg",
  MXN: "/flag_images/MXN.svg",
  INR: "/flag_images/INR.svg",
  RUB: "/flag_images/RUB.svg",
  ZAR: "/flag_images/ZAR.svg",
  TRY: "/flag_images/TRY.svg",
  BRL: "/flag_images/BRL.svg",
  TWD: "/flag_images/TWD.svg",
  DKK: "/flag_images/DKK.svg",
  PLN: "/flag_images/PLN.svg",
  THB: "/flag_images/THB.svg",
  IDR: "/flag_images/IDR.svg",
  HUF: "/flag_images/HUF.svg",
  CZK: "/flag_images/CZK.svg",
  ILS: "/flag_images/ILS.svg",
  CLP: "/flag_images/CLP.svg",
  PHP: "/flag_images/PHP.svg",
  AED: "/flag_images/AED.svg",
  SAR: "/flag_images/SAR.svg",
  MYR: "/flag_images/MYR.svg",
  RON: "/flag_images/RON.svg",
  VND: "/flag_images/VND.svg",
  TZS: "/flag_images/TZS.svg",
  ARS: "/flag_images/ARS.svg",
  AZN: "/flag_images/AZN.svg",
  BGN: "/flag_images/BGN.svg",
  BHD: "/flag_images/BHD.svg",
  BND: "/flag_images/BND.svg",
  EGP: "/flag_images/EGP.svg",
  FJD: "/flag_images/FJD.svg",
  KWD: "/flag_images/KWD.svg",
  LKR: "/flag_images/LKR.svg",
  MAD: "/flag_images/MAD.svg",
  MGA: "/flag_images/MGA.svg",
  TOP: "/flag_images/TOP.svg",
  OMR: "/flag_images/OMR.svg",
  PEN: "/flag_images/PEN.svg",
  PGK: "/flag_images/PGK.svg",
  PKR: "/flag_images/PKR.svg",
  SCR: "/flag_images/SCR.svg",
  SBD: "/flag_images/SBD.svg",
  VUV: "/flag_images/VUV.svg",
  WST: "/flag_images/WST.svg",
  XOF: "/flag_images/XOF.svg",
};

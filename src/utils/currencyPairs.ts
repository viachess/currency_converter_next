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

export interface FlagObject {
  readonly [code: string]: string;
}

export const flagObject: FlagObject = {
  USD: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/23px-Flag_of_the_United_States.svg.png",
  EUR: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/23px-Flag_of_Europe.svg.png",
  JPY: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Flag_of_Japan.svg/23px-Flag_of_Japan.svg.png",
  GBP: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/23px-Flag_of_the_United_Kingdom.svg.png",
  AUD: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Flag_of_Australia_%28converted%29.svg/23px-Flag_of_Australia_%28converted%29.svg.png",
  CAD: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/23px-Flag_of_Canada_%28Pantone%29.svg.png",
  CHF: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Switzerland.svg/16px-Flag_of_Switzerland.svg.png",
  CNY: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/23px-Flag_of_the_People%27s_Republic_of_China.svg.png",
  HKD: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Flag_of_Hong_Kong.svg/23px-Flag_of_Hong_Kong.svg.png",
  NZD: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Flag_of_New_Zealand.svg/23px-Flag_of_New_Zealand.svg.png",
  SEK: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Flag_of_Sweden.svg/23px-Flag_of_Sweden.svg.png",
  KRW: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/23px-Flag_of_South_Korea.svg.png",
  SGD: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_of_Singapore.svg/23px-Flag_of_Singapore.svg.png",
  NOK: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Norway.svg/21px-Flag_of_Norway.svg.png",
  MXN: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Flag_of_Mexico.svg/23px-Flag_of_Mexico.svg.png",
  INR: "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/23px-Flag_of_India.svg.png",
  RUB: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/Flag_of_Russia.svg/23px-Flag_of_Russia.svg.png",
  ZAR: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Flag_of_South_Africa.svg/23px-Flag_of_South_Africa.svg.png",
  TRY: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/23px-Flag_of_Turkey.svg.png",
  BRL: "https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/22px-Flag_of_Brazil.svg.png",
  TWD: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Flag_of_the_Republic_of_China.svg/23px-Flag_of_the_Republic_of_China.svg.png",
  DKK: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Flag_of_Denmark.svg/20px-Flag_of_Denmark.svg.png",
  PLN: "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Flag_of_Poland.svg/23px-Flag_of_Poland.svg.png",
  THB: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_Thailand.svg/23px-Flag_of_Thailand.svg.png",
  IDR: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Indonesia.svg/23px-Flag_of_Indonesia.svg.png",
  HUF: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/23px-Flag_of_Hungary.svg.png",
  CZK: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_Czech_Republic.svg/23px-Flag_of_the_Czech_Republic.svg.png",
  ILS: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Flag_of_Israel.svg/21px-Flag_of_Israel.svg.png",
  CLP: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Flag_of_Chile.svg/23px-Flag_of_Chile.svg.png",
  PHP: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Flag_of_the_Philippines.svg/23px-Flag_of_the_Philippines.svg.png",
  AED: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_United_Arab_Emirates.svg/23px-Flag_of_the_United_Arab_Emirates.svg.png",
  COP: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Colombia.svg/23px-Flag_of_Colombia.svg.png",
  SAR: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Flag_of_Saudi_Arabia.svg/23px-Flag_of_Saudi_Arabia.svg.png",
  MYR: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Flag_of_Malaysia.svg/23px-Flag_of_Malaysia.svg.png",
  RON: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flag_of_Romania.svg/23px-Flag_of_Romania.svg.png",
  VND: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/23px-Flag_of_Vietnam.svg.png",
  TZS: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flag_of_Tanzania.svg/23px-Flag_of_Tanzania.svg.png",
  ARS: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_Argentina.svg/23px-Flag_of_Argentina.svg.png",
  AZN: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_the_Azerbaijan_Democratic_Republic.jpg",
  BGN: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Bulgaria.svg/23px-Flag_of_Bulgaria.svg.png",
  BHD: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flag_of_Bahrain.svg/23px-Flag_of_Bahrain.svg.png",
  BND: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Flag_of_Brunei.svg/23px-Flag_of_Brunei.svg.png",
  EGP: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Egypt.svg/23px-Flag_of_Egypt.svg.png",
  FJD: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Fiji.svg/23px-Flag_of_Fiji.svg.png",
  KWD: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Flag_of_Kuwait.svg/23px-Flag_of_Kuwait.svg.png",
  LKR: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Flag_of_Sri_Lanka.svg/23px-Flag_of_Sri_Lanka.svg.png",
  MAD: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flag_of_Morocco.svg/23px-Flag_of_Morocco.svg.png",
  MGA: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Madagascar.svg/23px-Flag_of_Madagascar.svg.png",
  TOP: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Tonga.svg/23px-Flag_of_Tonga.svg.png",
  OMR: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Flag_of_Oman.svg/23px-Flag_of_Oman.svg.png",
  PEN: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Flag_of_Peru.svg/23px-Flag_of_Peru.svg.png",
  PGK: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Flag_of_Papua_New_Guinea.svg/23px-Flag_of_Papua_New_Guinea.svg.png",
  PKR: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Flag_of_Pakistan.svg/23px-Flag_of_Pakistan.svg.png",
  SCR: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Flag_of_Seychelles.svg/23px-Flag_of_Seychelles.svg.png",
  SBD: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Flag_of_the_Solomon_Islands.svg/23px-Flag_of_the_Solomon_Islands.svg.png",
  VEF: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Venezuela.svg/23px-Flag_of_Venezuela.svg.png",
  VUV: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Flag_of_Vanuatu_%28official%29.svg/23px-Flag_of_Vanuatu_%28official%29.svg.png",
  WST: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Flag_of_Samoa.svg/23px-Flag_of_Samoa.svg.png",
  XOF: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flag_of_West_Africa.png/23px-Flag_of_West_Africa.png",
};

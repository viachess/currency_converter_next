import React from "react";

import { areEqual } from "../../utils";

interface ExchangeDetailsProps {
  fromCurrencyValue: number;
  fromCurrencyCode: string;
  toCurrencyCode: string;
  currencyRatio: number;
}

export const ExchangeDetails = ({
  fromCurrencyValue,
  fromCurrencyCode,
  toCurrencyCode,
  currencyRatio,
}: ExchangeDetailsProps) => {
  const areCodesEqual = areEqual(fromCurrencyCode, toCurrencyCode);

  const DisplaySameValues = (): JSX.Element => {
    return (
      <>
        {1} {fromCurrencyCode} = {1} {fromCurrencyCode}
      </>
    );
  };

  const DisplayExchangeDetails = (): JSX.Element => {
    const toValue = fromCurrencyValue * currencyRatio;
    let displayNum;
    if (toValue % 1 === 0) {
      displayNum = toValue;
    } else if (toValue % 1 > 0) {
      displayNum = Number(toValue.toFixed(2));
    }

    return (
      <>
        {fromCurrencyValue} {fromCurrencyCode} = {displayNum} {toCurrencyCode}
      </>
    );
  };

  return (
    <h3 translate="no">
      {areCodesEqual ? <DisplaySameValues /> : <DisplayExchangeDetails />}
    </h3>
  );
};

export default ExchangeDetails;

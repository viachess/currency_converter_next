import React from "react";

import { areEqual } from "../../utils";

export const ExchangeDetails = (props: any) => {
  const { fromCurrencyCode, fromCurrencyValue } = props.fromCurrencyDetails;
  const { toCurrencyCode, toCurrencyValue } = props.toCurrencyDetails;
  const { currencyRatio } = props;
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
    // const isInteger = Number.isInteger(toValue);
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
    <h3>
      {areCodesEqual ? <DisplaySameValues /> : <DisplayExchangeDetails />}
    </h3>
  );
};

export default ExchangeDetails;

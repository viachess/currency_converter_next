import React from "react";

import { areEqual } from "../utils";

export const ExchangeDetails = (props: any) => {
  const { firstCurrencyCode, firstCurrencyValue } = props.firstCurrencyDetails;
  const { secondCurrencyCode, secondCurrencyValue } =
    props.secondCurrencyDetails;
  const { currencyRatio } = props;
  const areCodesEqual = areEqual(firstCurrencyCode, secondCurrencyCode);

  const DisplaySameValues = (): JSX.Element => {
    return (
      <>
        {1} {firstCurrencyCode} = {1} {firstCurrencyCode}
      </>
    );
  };

  const DisplayExchangeDetails = (): JSX.Element => {
    return (
      <>
        {1} {firstCurrencyCode} = {1 * currencyRatio} {secondCurrencyCode}
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

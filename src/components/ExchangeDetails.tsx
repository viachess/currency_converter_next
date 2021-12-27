import React from "react";

import { areEqual } from "../utils";

export const ExchangeDetails = (props: any) => {
  const { firstCurrencyCode, firstCurrencyValue } = props.firstCurrencyDetails;
  const { secondCurrencyCode, secondCurrencyValue } =
    props.secondCurrencyDetails;
  const areCodesEqual = areEqual(firstCurrencyCode, secondCurrencyCode);

  const DisplaySameValues = (): JSX.Element => {
    return (
      <>
        {firstCurrencyValue} {firstCurrencyCode} = {firstCurrencyValue}{" "}
        {firstCurrencyCode}
      </>
    );
  };

  const DisplayExchangeDetails = (): JSX.Element => {
    return (
      <>
        {firstCurrencyValue} {firstCurrencyCode} = {secondCurrencyValue}{" "}
        {secondCurrencyCode}
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

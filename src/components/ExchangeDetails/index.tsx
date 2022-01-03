import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { flagPathObject } from "@/utils/currencyPairs";
import styles from "@/components/ExchangeDetails/ExchangeDetails.module.css";

interface ExchangeDetailsProps {
  readonly fromCurrencyValue: number;
  readonly fromCurrencyCode: string;
  readonly toCurrencyCode: string;
  readonly currencyRatio: number;
}
interface CurrencyInfoProps {
  value: number;
  currencyCode: string;
}

function FlagImage({ currencyCode }: { currencyCode: string }) {
  return (
    <Image
      alt={`${currencyCode} flag`}
      src={flagPathObject[currencyCode]}
      width={40}
      height={25}
    />
  );
}
const MemoizedFlagImage = React.memo(FlagImage);
function CurrencyCode({ currencyCode }: { currencyCode: string }) {
  return <>{currencyCode}</>;
}
const MemoizedCurrencyCode = React.memo(CurrencyCode);

export const ExchangeDetails: React.FC<ExchangeDetailsProps> = ({
  fromCurrencyValue,
  fromCurrencyCode,
  toCurrencyCode,
  currencyRatio,
}) => {
  const toValue = fromCurrencyValue * currencyRatio;
  let toCurrencyValue = 1;
  if (toValue % 1 === 0) {
    toCurrencyValue = toValue;
  } else if (toValue % 1 > 0) {
    toCurrencyValue = Number(toValue.toFixed(2));
  }

  const CurrencyInfo: React.FC<CurrencyInfoProps> = ({
    value,
    currencyCode,
  }) => {
    return (
      <div className={styles.currencyInfo}>
        <MemoizedFlagImage currencyCode={currencyCode} />
        <h4 className={styles.currencyValue}>
          {value} <MemoizedCurrencyCode currencyCode={currencyCode} />
        </h4>
      </div>
    );
  };

  return (
    <div translate="no" className={styles.exchangeDetailsContainer}>
      <CurrencyInfo value={fromCurrencyValue} currencyCode={fromCurrencyCode} />
      <p>=</p>
      <CurrencyInfo value={toCurrencyValue} currencyCode={toCurrencyCode} />
    </div>
  );
};

export default ExchangeDetails;

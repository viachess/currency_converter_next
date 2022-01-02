import React, { useMemo } from "react";
import Image from "next/image";
import { flagObject } from "@/utils/currencyPairs";
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
        <Image
          alt={`${currencyCode} flag`}
          src={flagObject[currencyCode]}
          width={23}
          height={12}
          // className={styles.infoImage}
        />
        <h4>
          {value} {currencyCode}
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

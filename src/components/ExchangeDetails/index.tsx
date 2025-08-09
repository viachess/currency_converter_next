import React, { FC } from "react";
import Image from "next/image";
import { flagPathObject } from "@/utils/currencyPairs";
import styles from "@/components/ExchangeDetails/ExchangeDetails.module.css";
import { CurrentRateMode } from "@/features/home/types";

interface ExchangeDetailsProps {
  readonly fromCurrencyValue: number;
  readonly fromCurrencyCode: string;
  readonly toCurrencyCode: string;
  readonly currentRateMode: CurrentRateMode.regular | CurrentRateMode.inverse;
  readonly currencyRateState: {
    regular: number;
    inverse: number;
  };
  readonly isLoading: boolean;
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
      width={32}
      height={24}
      className={styles.flagImage}
    />
  );
}
const MemoizedFlagImage = React.memo(FlagImage);

function CurrencyCode({ currencyCode }: { currencyCode: string }) {
  return <>{currencyCode}</>;
}
const MemoizedCurrencyCode = React.memo(CurrencyCode);

export const ExchangeDetails: FC<ExchangeDetailsProps> = ({
  fromCurrencyValue,
  fromCurrencyCode,
  toCurrencyCode,
  currentRateMode,
  currencyRateState,
  isLoading,
}) => {
  let toCurrencyValue: number = 1;
  const currentRate = currencyRateState && currencyRateState[currentRateMode];

  if (!Number.isNaN(Number(currentRate))) {
    const newValue = fromCurrencyValue * currentRate;
    if (newValue % 1 > 0) {
      toCurrencyValue = Number(newValue.toFixed(2));
    } else {
      toCurrencyValue = Number(newValue);
    }
  }

  const CurrencyInfo: FC<CurrencyInfoProps> = ({ value, currencyCode }) => {
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
      {isLoading ? (
        <h4>Loading...</h4>
      ) : (
        <>
          <CurrencyInfo
            value={fromCurrencyValue}
            currencyCode={fromCurrencyCode}
          />
          <p>=</p>
          <CurrencyInfo value={toCurrencyValue} currencyCode={toCurrencyCode} />
        </>
      )}
    </div>
  );
};

export default ExchangeDetails;

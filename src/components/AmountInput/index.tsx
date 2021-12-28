import React, { FormEvent, useEffect, useRef } from "react";
import styles from "@/styles/Home.module.css";
import { currencyPairs } from "@/utils/currencyPairs";

const AmountInput = ({
  id,
  currencyRatio,
  firstCurrencyValue,
  setFirstCurrencyValue,
  readonly,
}: {
  id: string;
  currencyRatio: number;
  firstCurrencyValue: number;
  setFirstCurrencyValue: React.Dispatch<React.SetStateAction<number>>;
  readonly: boolean;
}) => {
  const MAX_ALLOWED_NUMBER = 1000000000;
  const inputHandler = (e: FormEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    const isNumber = !Number.isNaN(Number(value));
    console.log("input handler working");
    console.log(value);
    console.log(isNumber);
    if (isNumber) {
      const isInteger = Number.isInteger(value);
      if (isInteger) {
        console.log(isInteger);
        setFirstCurrencyValue(Number(value));
      }
    }
  };

  // let inputValue = firstCurrencyValue * currencyRatio;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && readonly) {
      inputRef.current.value = (firstCurrencyValue * currencyRatio).toString();
    }
    return () => {};
  }, [firstCurrencyValue, currencyRatio, readonly]);
  return (
    <label htmlFor={id} className={styles.amountInput}>
      <input
        type="text"
        name={id}
        onInput={inputHandler}
        readOnly={readonly}
        ref={inputRef}
      />
    </label>
  );
};

export default AmountInput;

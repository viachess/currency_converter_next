import React, { FormEvent, useEffect, useRef } from "react";
import styles from "@/styles/Home.module.css";

const AmountInput = ({
  id,
  currencyRatio,
  firstCurrencyValue,
  setFirstCurrencyValue,
  readonly,
}: {
  id: string;
  currencyRatio: number;
  firstCurrencyValue: number | null;
  setFirstCurrencyValue: React.Dispatch<React.SetStateAction<number | null>>;
  readonly: boolean;
}) => {
  const MAX_ALLOWED_NUMBER = 1000000000;
  const inputHandler = (e: FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    const isEmpty = value.trim().length === 0;
    const isNumber = !Number.isNaN(Number(value));
    if (!isEmpty && isNumber && !readonly) {
      const isInteger = Number.isInteger(Number(value));
      if (isInteger) {
        setFirstCurrencyValue(Number(value));
      } else {
        const numberSplit = value.split(".");
        const floatingPart = numberSplit[1];
        if (floatingPart.length > 2) {
          const fixedFloatNumber = Number(Number.parseFloat(value).toFixed(2));
          target.value = fixedFloatNumber.toString();
          setFirstCurrencyValue(fixedFloatNumber);
        } else {
          setFirstCurrencyValue(Number(value));
        }
      }
    }
  };

  const changeHandler = (e: FormEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    const isEmpty = value.trim().length === 0;
    if (isEmpty) {
      setFirstCurrencyValue(null);
    }
  };

  const onKeydownHandler = (e: FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    // const keyRegexp = new RegExp();
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && readonly) {
      inputRef.current.value = firstCurrencyValue
        ? (firstCurrencyValue * currencyRatio).toString()
        : "";
    }
    return () => {};
  }, [firstCurrencyValue, currencyRatio, readonly]);

  return (
    <label htmlFor={id} className={styles.amountInput}>
      <input
        type="text"
        name={id}
        onInput={inputHandler}
        onChange={changeHandler}
        readOnly={readonly}
        ref={inputRef}
      />
    </label>
  );
};

export default AmountInput;

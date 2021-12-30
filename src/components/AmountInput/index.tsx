import React, { FormEvent, useEffect, useRef, useState } from "react";
// import styles from "@/styles/Home.module.css";
import styles from "./AmountInput.module.css";

const AmountInput = ({
  id,
  setFromCurrencyValue,
}: {
  id: string;
  setFromCurrencyValue: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const [errors, setErrors] = useState({
    notANumber: {
      message: "Invalid input, please enter a number",
      status: false,
    },
    tooLong: {
      message: "Entered number must be less than 10 symbols long",
      status: false,
    },
  });

  const MAX_ALLOWED_NUMBER = 1000000000;
  const inputHandler = (e: FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    const isEmpty = value.trim().length === 0;
    const isNumber = !Number.isNaN(Number(value));
    console.log(value);
    if (!isEmpty && isNumber) {
      console.log("not empty & is number if");
      setErrors({
        ...errors,
        tooLong: {
          ...errors.tooLong,
          status: false,
        },
        notANumber: {
          ...errors.notANumber,
          status: false,
        },
      });

      if (Number(value) >= MAX_ALLOWED_NUMBER) {
        setErrors({
          ...errors,
          tooLong: {
            ...errors.tooLong,
            status: true,
          },
        });
        return;
      }
      const isInteger = Number.isInteger(Number(value));
      if (isInteger) {
        setFromCurrencyValue(Number(value));
      } else {
        const numberSplit = value.split(".");
        const floatingPart = numberSplit[1];
        if (floatingPart.length > 2) {
          const fixedFloatNumber = Number(Number.parseFloat(value).toFixed(2));
          target.value = fixedFloatNumber.toString();
          setFromCurrencyValue(fixedFloatNumber);
        } else {
          setFromCurrencyValue(Number(value));
        }
      }
    } else if (!isEmpty && !isNumber) {
      console.log("not empty, not a number");
      setErrors({
        ...errors,
        tooLong: {
          ...errors.tooLong,
          status: false,
        },
        notANumber: {
          ...errors.notANumber,
          status: true,
        },
      });
      return;
    }
  };

  const changeHandler = (e: FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const isEmpty = target.value.trim().length === 0;
    if (isEmpty) {
      setErrors({
        ...errors,
        tooLong: {
          ...errors.tooLong,
          status: false,
        },
        notANumber: {
          ...errors.notANumber,
          status: false,
        },
      });
      setFromCurrencyValue(1);
    }
  };

  const onKeydownHandler = (e: FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const event = e as FormEvent<HTMLInputElement>;
    // console.log(e.key);
    // console.log(e.key.length);
  };

  return (
    <div className={styles.amountInputContainer}>
      <div className={styles.errorContainer}>
        {Object.entries(errors).map((entry, index) => {
          const [errorName, errorValue] = entry;
          if (errorValue.status) {
            return (
              <small key={index} className={styles.error}>
                {errorValue.message}
              </small>
            );
          }
        })}
      </div>
      <label htmlFor={id} className={styles.amountInput}>
        <input
          type="text"
          name={id}
          onKeyDown={onKeydownHandler}
          onInput={inputHandler}
          onChange={changeHandler}
        />
      </label>
    </div>
  );
};

export default AmountInput;

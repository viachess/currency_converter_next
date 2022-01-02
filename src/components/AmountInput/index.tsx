import React, { FormEvent, useState } from "react";
import styles from "./AmountInput.module.css";

interface AmountInputProps {
  id: string;
  setFromCurrencyValue: React.Dispatch<React.SetStateAction<number>>;
}

const AmountInput: React.FC<AmountInputProps> = ({
  id,
  setFromCurrencyValue,
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
    const trimmedValue = target.value.trim();
    const isEmpty = trimmedValue.length === 0;
    const isNumber = !Number.isNaN(Number(trimmedValue));
    if (!isEmpty && isNumber) {
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

      if (Number(trimmedValue) >= MAX_ALLOWED_NUMBER) {
        setErrors({
          ...errors,
          tooLong: {
            ...errors.tooLong,
            status: true,
          },
        });
        return;
      }
      const isInteger = Number.isInteger(Number(trimmedValue));
      if (isInteger) {
        setFromCurrencyValue(Number(trimmedValue));
      } else {
        const numberSplit = trimmedValue.split(".");
        const floatingPart = numberSplit[1];
        if (floatingPart.length > 2) {
          const fixedFloatNumber = Number(
            Number.parseFloat(trimmedValue).toFixed(2)
          );
          target.value = fixedFloatNumber.toString();
          setFromCurrencyValue(fixedFloatNumber);
        } else {
          setFromCurrencyValue(Number(trimmedValue));
        }
      }
    } else if (!isEmpty && !isNumber) {
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
          onInput={inputHandler}
          onChange={changeHandler}
        />
      </label>
    </div>
  );
};

export default AmountInput;

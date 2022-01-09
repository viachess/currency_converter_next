import React, { FormEvent, useState, useReducer } from "react";
import styles from "./AmountInput.module.css";
import errorReducer, { errorMessages } from "./errorStore";

interface AmountInputProps {
  id: string;
  setFromCurrencyValue: React.Dispatch<React.SetStateAction<number>>;
}

const AmountInput: React.FC<AmountInputProps> = ({
  id,
  setFromCurrencyValue,
}) => {
  const initialErrorState = {
    notANumber: false,
    tooLong: false,
  };
  const [errors, dispatchErrorsAction] = useReducer(
    errorReducer,
    initialErrorState
  );

  const MAX_ALLOWED_NUMBER = 1000000000;
  const inputHandler = (e: FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const trimmedValue = target.value.trim();
    const isEmpty = trimmedValue.length === 0;
    const isNumber = !Number.isNaN(Number(trimmedValue));
    if (!isEmpty && isNumber) {
      dispatchErrorsAction({
        type: "hideAllErrors",
      });

      if (Number(trimmedValue) >= MAX_ALLOWED_NUMBER) {
        dispatchErrorsAction({ type: "showLengthError" });
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
      dispatchErrorsAction({
        type: "hideLengthError",
      });

      dispatchErrorsAction({
        type: "showNanError",
      });
      return;
    }
  };

  const changeHandler = (e: FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const isEmpty = target.value.trim().length === 0;
    if (isEmpty) {
      dispatchErrorsAction({
        type: "hideAllErrors",
      });
      setFromCurrencyValue(1);
    }
  };

  return (
    <div className={styles.amountInputContainer}>
      <div className={styles.errorContainer}>
        {Object.entries(errors).map((entry, index) => {
          const [errorName, errorValue] = entry;
          if (errorValue) {
            const errorMessage = errorMessages[errorName];
            return (
              <small key={index} className={styles.error}>
                {errorMessage}
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

// import { CurrencyHashTable } from "../utils/currencyPairs";
import React from "react";
import { currencyPairs } from "../utils/currencyPairs";

const CurrencySelector = ({
  id,
  setCurrencyCode,
  currencyCode,
}): JSX.Element => {
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrencyCode = e.target.value;
    setCurrencyCode(newCurrencyCode);
  };
  return (
    <select id={id} onChange={handleCurrencyChange} value={currencyCode}>
      {Object.entries(currencyPairs).map((entry, index) => {
        const [currencyCode, currencyDescription] = entry;
        return (
          <option key={index} value={currencyCode}>
            {currencyCode} - {currencyDescription}
          </option>
        );
      })}
    </select>
  );
};

export default CurrencySelector;

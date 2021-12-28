// import { CurrencyHashTable } from "../utils/currencyPairs";
import React, { memo, useMemo } from "react";
import styles from "./CurrencySelector.module.css";
import {
  currencyPairs,
  getSelectOptions,
  CurrencySelectOption,
} from "../../utils/currencyPairs";

import Select, { ActionMeta, StylesConfig } from "react-select";

interface SelectorProps {
  readonly id: string;
  readonly setCurrencyCode: React.Dispatch<React.SetStateAction<string>>;
  readonly currencyCode: string;
}

const CurrencySelector = ({
  id,
  setCurrencyCode,
  currencyCode,
}: SelectorProps): JSX.Element => {
  const memoizedSelectOptions = useMemo(() => {
    return getSelectOptions(currencyPairs);
  }, []);

  const defaultSelectValue = memoizedSelectOptions.filter(
    (item) => item.value === currencyCode
  );

  const handleSelectChange = (
    option: CurrencySelectOption | null,
    actionMeta: ActionMeta<CurrencySelectOption>
  ) => {
    const newValue = option?.value;
    newValue ? setCurrencyCode(newValue) : null;
  };

  const selectorStyles = {
    control: (styles: any) => {
      return {
        ...styles,
        backgroundColor: "white",
        borderColor: "violet",
        "&:hover": {
          borderColor: "violet",
        },
      };
    },
    option: (styles: any, { isSelected, isFocused }: any) => {
      const violet = "rgb(238,130,238)";
      const fadedViolet = "rgba(238,130,238,0.2)";
      return {
        ...styles,
        color: isSelected ? "#ffffff" : "rgb(7, 0, 0)",
        backgroundColor: isSelected
          ? violet
          : isFocused
          ? fadedViolet
          : "white",
        ":active": {
          ...styles[":active"],
          backgroundColor: isSelected ? violet : undefined,
        },
      };
    },
  };

  return (
    <Select
      options={memoizedSelectOptions}
      defaultValue={defaultSelectValue}
      instanceId={id}
      onChange={handleSelectChange}
      className={styles.selectContainer}
      styles={selectorStyles}
    />
  );
};

export default CurrencySelector;

import React, { memo, useEffect, useMemo, useRef } from "react";
import styles from "./CurrencySelector.module.css";
import {
  currencyPairs,
  getSelectOptions,
  CurrencySelectOption,
  flagObject,
} from "../../utils/currencyPairs";

import Select, { ActionMeta } from "react-select";

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
  const currentSelectValue = useRef<CurrencySelectOption>();
  useEffect(() => {
    currentSelectValue.current = memoizedSelectOptions.filter(
      (item) => item.value === currencyCode
    )[0];
  }, [currencyCode, memoizedSelectOptions]);

  const handleSelectChange = (
    option: CurrencySelectOption | null,
    actionMeta: ActionMeta<CurrencySelectOption>
  ) => {
    const newValue = option?.value;
    newValue ? setCurrencyCode(newValue) : null;
  };

  const flag = (value: string) => {
    return {
      alignItems: "center",
      display: "flex",
      ":before": {
        backgroundImage: `url('${flagObject[value]}')`,
        backgroundPosition: "center",
        backgroundSize: "100%",
        content: '" "',
        display: "block",
        marginRight: 8,
        height: 12,
        width: 23,
      },
    };
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
    option: (styles: any, { isSelected, isFocused, data }: any) => {
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
        ...flag(data.value),
        ":active": {
          ...styles[":active"],
          backgroundColor: isSelected ? violet : undefined,
        },
      };
    },
    input: (styles: any) => ({ ...styles }),
    placeholder: (styles: any, { data }: any) => ({
      ...styles,
      ...flag(data?.value),
    }),
    singleValue: (styles: any, { data }: any) => {
      return { ...styles, ...flag(data.value) };
    },
  };

  return (
    <Select
      options={memoizedSelectOptions}
      value={currentSelectValue.current}
      instanceId={id}
      onChange={handleSelectChange}
      className={styles.selectContainer}
      styles={selectorStyles}
    />
  );
};

export default CurrencySelector;

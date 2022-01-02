import React, { memo, useState, useEffect, useMemo, useRef } from "react";
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

function throttle(cb: Function, timeout: number) {
  let wait = false;
  return function () {
    if (!wait) {
      cb.call(null, arguments);
      wait = true;
      setTimeout(() => {
        wait = false;
      }, timeout);
    }
  };
}

const CurrencySelector: React.FC<SelectorProps> = ({
  id,
  setCurrencyCode,
  currencyCode,
}) => {
  const memoizedSelectOptions = useMemo(() => {
    return getSelectOptions(currencyPairs);
  }, []);
  const [selectOptions, setSelectOptions] = useState<CurrencySelectOption[]>();
  const [currentSelectValue, setCurrentSelectValue] =
    useState<CurrencySelectOption>();
  const [isSearchable, setIsSearchable] = useState<boolean>(true);

  useEffect(() => {
    function updateSearchableState() {
      const width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      width > 450 ? setIsSearchable(true) : setIsSearchable(false);
    }
    const throttledUpdateSearchable = throttle(updateSearchableState, 100);
    updateSearchableState();
    setSelectOptions(memoizedSelectOptions);
    const newSelectValue = selectOptions?.filter(
      (item) => item.value === currencyCode
    )[0];
    setCurrentSelectValue(newSelectValue);
    window.addEventListener("resize", throttledUpdateSearchable);
    return () => {
      window.removeEventListener("resize", throttledUpdateSearchable);
    };
  }, [currencyCode, memoizedSelectOptions, selectOptions, isSearchable]);

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
    // Select box styling
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
    // Styling of options in the dropdown
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
        "@media (max-width: 450px)": {
          fontSize: "16px",
        },
      };
    },
    // Selected value styling
    singleValue: (styles: any, { data }: any) => {
      return {
        ...styles,
        "@media (max-width: 450px)": {
          fontSize: "16px",
        },
      };
    },
    input: (styles: any) => ({ ...styles }),
    placeholder: (styles: any, { data }: any) => ({
      ...styles,
    }),
  };

  return (
    <Select
      options={selectOptions}
      value={currentSelectValue}
      instanceId={id}
      isSearchable={isSearchable}
      onChange={handleSelectChange}
      className={styles.selectContainer}
      styles={selectorStyles}
    />
  );
};

export default CurrencySelector;

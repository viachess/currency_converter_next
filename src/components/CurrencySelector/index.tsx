import React, { memo, useState, useEffect, useMemo, useRef, FC } from "react";
import styles from "./CurrencySelector.module.css";
import {
  currencyPairs,
  getSelectOptions,
  CurrencySelectOption,
  flagPathObject,
} from "../../utils/currencyPairs";

import Select, { ActionMeta } from "react-select";

interface SelectorProps {
  readonly id: string;
  readonly setCurrencyCode: React.Dispatch<React.SetStateAction<string>>;
  readonly currencyCode: string;
  readonly selectOptions: CurrencySelectOption[];
  readonly setSwapCount: React.Dispatch<React.SetStateAction<number>>;
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

const CurrencySelector: FC<SelectorProps> = ({
  id,
  setCurrencyCode,
  currencyCode,
  selectOptions,
  setSwapCount,
}) => {
  const selectValue = useMemo(() => {
    return selectOptions.filter((selectOption) => {
      return selectOption.value === currencyCode;
    })[0];
  }, [currencyCode, selectOptions]);

  const [isSearchable, setIsSearchable] = useState<boolean>(true);

  useEffect(() => {
    function updateSearchableState() {
      const width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      width > 450 ? setIsSearchable(true) : setIsSearchable(false);
    }
    updateSearchableState();

    const throttledUpdateSearchable = throttle(updateSearchableState, 100);
    window.addEventListener("resize", throttledUpdateSearchable);

    return () => {
      window.removeEventListener("resize", throttledUpdateSearchable);
    };
  }, [currencyCode, isSearchable]);

  const updateSwapCount = (
    option: CurrencySelectOption | null,
    actionMeta: ActionMeta<CurrencySelectOption>
  ) => {
    const newValue = option?.value;
    newValue ? setCurrencyCode(newValue) : null;
    setSwapCount(0);
  };

  const flag = (value: string) => {
    return {
      alignItems: "center",
      display: "flex",
      ":before": {
        backgroundImage: `url('${flagPathObject[value]}')`,
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
    // input: (styles: any) => ({ ...styles }),
    // placeholder: (styles: any, { data }: any) => ({
    //   ...styles,
    // }),
  };

  return (
    <Select
      options={selectOptions}
      instanceId={id}
      value={selectValue}
      // defaultValue={defaultSelectValue}
      isSearchable={isSearchable}
      onChange={updateSwapCount}
      className={styles.selectContainer}
      styles={selectorStyles}
    />
  );
};

export default CurrencySelector;

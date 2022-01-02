import type { NextPage } from "next";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import ExchangeDetails from "@/components/ExchangeDetails";
import CurrencySelector from "@/components/CurrencySelector";
import { areEqual } from "@/utils";
import AmountInput from "@/components/AmountInput";

const SwapIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.swapIcon}
    >
      <g data-name="Layer 2">
        <g data-name="swap">
          <path d="M4 9h13l-1.6 1.2a1 1 0 0 0-.2 1.4 1 1 0 0 0 .8.4 1 1 0 0 0 .6-.2l4-3a1 1 0 0 0 0-1.59l-3.86-3a1 1 0 0 0-1.23 1.58L17.08 7H4a1 1 0 0 0 0 2z" />
          <path d="M20 16H7l1.6-1.2a1 1 0 0 0-1.2-1.6l-4 3a1 1 0 0 0 0 1.59l3.86 3a1 1 0 0 0 .61.21 1 1 0 0 0 .79-.39 1 1 0 0 0-.17-1.4L6.92 18H20a1 1 0 0 0 0-2z" />
        </g>
      </g>
    </svg>
  );
};

const CONVERT_CURRENCY_URL = `/api/convert`;

const Home: NextPage = () => {
  const [fromCurrencyCode, setFromCurrencyCode] = useState<string>("USD");
  const [toCurrencyCode, setToCurrencyCode] = useState<string>("RUB");
  const [fromCurrencyValue, setFromCurrencyValue] = useState<number>(1);
  const [currencyRatio, setCurrencyRatio] = useState<number>(1);

  const currenciesAreEqual = areEqual(fromCurrencyCode, toCurrencyCode);

  useEffect(() => {
    if (currenciesAreEqual) {
      setToCurrencyCode(fromCurrencyCode);
      setCurrencyRatio(1);
    } else {
      axios
        .post(CONVERT_CURRENCY_URL, {
          FROM_CURRENCY_CODE: fromCurrencyCode,
          TO_CURRENCY_CODE: toCurrencyCode,
        })
        .then((response) => {
          const { CURRENCY_RATIO } = response.data;
          setCurrencyRatio(Number(CURRENCY_RATIO));
        })
        .catch((err) => {
          console.log("PROXY SERVER REQUEST ERROR");
          console.error(err);
        });
    }
    return () => {
      // cleanup
    };
  }, [fromCurrencyCode, toCurrencyCode, currenciesAreEqual]);

  const swapCurrencies = () => {
    let tmp = fromCurrencyCode;
    setFromCurrencyCode(toCurrencyCode);
    setToCurrencyCode(tmp);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Currency Converter</title>
        <meta name="description" content="Currency converter project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Currency converter</h1>
        <ExchangeDetails
          fromCurrencyValue={fromCurrencyValue!}
          fromCurrencyCode={fromCurrencyCode}
          toCurrencyCode={toCurrencyCode}
          currencyRatio={currencyRatio}
        />
        <div className={styles.comparisonContainer}>
          <AmountInput
            id={"amount-input-1"}
            setFromCurrencyValue={setFromCurrencyValue}
          />
          <div className={styles.selectorContainer}>
            <CurrencySelector
              id="from-currency-selector"
              currencyCode={fromCurrencyCode}
              setCurrencyCode={setFromCurrencyCode}
            />
            <button
              type="button"
              className={styles.swapBtn}
              onClick={swapCurrencies}
            >
              <SwapIcon />
            </button>
            <CurrencySelector
              id="to-currency-selector"
              currencyCode={toCurrencyCode}
              setCurrencyCode={setToCurrencyCode}
            />
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://github.com/viachess" target="_blank" rel="noreferrer">
          Github
        </a>
      </footer>
    </div>
  );
};

export default Home;

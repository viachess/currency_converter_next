import type { NextPage } from "next";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import ExchangeDetails from "@/components/ExchangeDetails";
import CurrencySelector from "@/components/CurrencySelector";
import { areEqual } from "@/utils";
import AmountInput from "@/components/AmountInput";

const PROXY_URL = "http://localhost:4400";
const CONVERT_CURRENCY_URL = `${PROXY_URL}/convert`;

const Home: NextPage = () => {
  const [fromCurrencyCode, setFromCurrencyCode] = useState<string>("USD");
  const [toCurrencyCode, setToCurrencyCode] = useState<string>("RUB");
  const [fromCurrencyValue, setFromCurrencyValue] = useState<number | null>(1);
  const [toCurrencyValue, setToCurrencyValue] = useState<number | null>(null);
  const [currencyRatio, setCurrencyRatio] = useState<number>(1);

  // On amount input, perform validation. If the input is valid

  const currenciesAreEqual = areEqual(fromCurrencyCode, toCurrencyCode);

  useEffect(() => {
    if (currenciesAreEqual) {
      setToCurrencyCode(fromCurrencyCode);
      setToCurrencyValue(1);
      setCurrencyRatio(1);
    } else {
      axios
        .post(CONVERT_CURRENCY_URL, {
          FROM_CURRENCY_CODE: fromCurrencyCode,
          TO_CURRENCY_CODE: toCurrencyCode,
        })
        .then((response) => {
          const { CURRENCY_RATIO } = response.data;
          setToCurrencyValue(Number(CURRENCY_RATIO));
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
          currencyRatio={currencyRatio}
          fromCurrencyDetails={{
            fromCurrencyCode,
            fromCurrencyValue,
          }}
          toCurrencyDetails={{
            toCurrencyCode,
            toCurrencyValue,
          }}
        />
        <div className={styles.comparisonContainer}>
          <AmountInput
            id={"amount-input-1"}
            setFromCurrencyValue={setFromCurrencyValue}
          />
          <div className={styles.selectorContainer}>
            <CurrencySelector
              id="currency-select-1"
              currencyCode={fromCurrencyCode}
              setCurrencyCode={setFromCurrencyCode}
            />
            <CurrencySelector
              id="currency-select-2"
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

import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import React, { useState, useEffect } from "react";
// USD - United States Dollars
import { currencyPairs } from "../utils/currencyPairs";
import axios from "axios";

import CurrencySelector from "../components/CurrencySelector";

const PROXY_URL = "http://localhost:4400";
const CONVERT_CURRENCY_URL = `${PROXY_URL}/convert`;

const Home: NextPage = () => {
  const [firstCurrencyCode, setFirstCurrencyCode] = useState("USD");
  const [secondCurrencyCode, setSecondCurrencyCode] = useState("RUB");
  const [secondCurrencyValue, setSecondCurrencyValue] = useState(null);

  useEffect(() => {
    axios
      .post(CONVERT_CURRENCY_URL, {
        FIRST_CURRENCY_CODE: firstCurrencyCode,
        SECOND_CURRENCY_CODE: secondCurrencyCode,
      })
      .then((response) => {
        const { SECOND_CURRENCY_VALUE } = response.data;
        setSecondCurrencyValue(SECOND_CURRENCY_VALUE);
      });
    return () => {
      // cleanup
    };
  }, [firstCurrencyCode, secondCurrencyCode]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Currency Converter</title>
        <meta name="description" content="Currency converter project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Currency converter</h1>
        <h3>
          1 {firstCurrencyCode} ={" "}
          {secondCurrencyValue ? secondCurrencyValue : "Loading..."}{" "}
          {secondCurrencyCode}
        </h3>
        <div className={styles.comparisonContainer}>
          <div className="input-container" id="input-container-1">
            <label htmlFor="amount-input-1">
              Amount: {"  "}
              <input type="text" name="amount-input-1" />
            </label>
            <CurrencySelector
              id="currency-select-1"
              currencyCode={firstCurrencyCode}
              setCurrencyCode={setFirstCurrencyCode}
            />
          </div>
          <div className="input-container" id="input-container-2">
            <label htmlFor="amount-input-2">
              Amount: {"  "}
              <input type="text" name="amount-input-2" />
            </label>
            <CurrencySelector
              id="currency-select-2"
              currencyCode={secondCurrencyCode}
              setCurrencyCode={setSecondCurrencyCode}
            />
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        {/* <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a> */}
      </footer>
    </div>
  );
};

export default Home;

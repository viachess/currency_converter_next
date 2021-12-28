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
  const [firstCurrencyCode, setFirstCurrencyCode] = useState<string>("USD");
  const [secondCurrencyCode, setSecondCurrencyCode] = useState<string>("RUB");
  const [firstCurrencyValue, setFirstCurrencyValue] = useState<number>(1);
  const [secondCurrencyValue, setSecondCurrencyValue] = useState<number>(1);
  const [currencyRatio, setCurrencyRatio] = useState<number>(1);

  // On amount input, perform validation. If the input is valid

  const currenciesAreEqual = areEqual(firstCurrencyCode, secondCurrencyCode);

  useEffect(() => {
    if (currenciesAreEqual) {
      setSecondCurrencyCode(firstCurrencyCode);
      setSecondCurrencyValue(1);
      setCurrencyRatio(1);
    } else {
      axios
        .post(CONVERT_CURRENCY_URL, {
          FIRST_CURRENCY_CODE: firstCurrencyCode,
          SECOND_CURRENCY_CODE: secondCurrencyCode,
        })
        .then((response) => {
          const { CURRENCY_RATIO } = response.data;
          setSecondCurrencyValue(Number(CURRENCY_RATIO));
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
  }, [firstCurrencyCode, secondCurrencyCode, currenciesAreEqual]);

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
          firstCurrencyDetails={{
            firstCurrencyCode,
            firstCurrencyValue,
          }}
          secondCurrencyDetails={{
            secondCurrencyCode,
            secondCurrencyValue,
          }}
        />
        <div className={styles.comparisonContainer}>
          <div className={styles.inputContainer} id="input-container-1">
            <AmountInput
              id={"amount-input-1"}
              currencyRatio={currencyRatio}
              firstCurrencyValue={firstCurrencyValue}
              setFirstCurrencyValue={setFirstCurrencyValue}
              readonly={false}
            />
            <CurrencySelector
              id="currency-select-1"
              currencyCode={firstCurrencyCode}
              setCurrencyCode={setFirstCurrencyCode}
            />
          </div>
          <div className={styles.inputContainer} id="input-container-2">
            <AmountInput
              id={"amount-input-2"}
              currencyRatio={currencyRatio}
              firstCurrencyValue={firstCurrencyValue}
              setFirstCurrencyValue={setFirstCurrencyValue}
              readonly={true}
            />
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

import type { NextPage } from "next";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import * as d3 from "d3";

import ExchangeDetails from "@/components/ExchangeDetails";
import CurrencySelector from "@/components/CurrencySelector";
import { areEqual } from "@/utils";
import AmountInput from "@/components/AmountInput";
import HistoryGraph from "@/components/HistoryGraph";

import { GetStaticProps } from "next";
import { InferGetStaticPropsType } from "next";
import {
  currencyPairs,
  CurrencySelectOption,
  getSelectOptions,
} from "@/utils/currencyPairs";

export const getStaticProps: GetStaticProps = async (context) => {
  const selectOptions: CurrencySelectOption[] = getSelectOptions(currencyPairs);

  return {
    props: {
      selectOptions,
    },
  };
};

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

export enum CurrentRateMode {
  regular = "regular",
  inverse = "inverse",
}

interface CurrencyRateState {
  regular: number;
  inverse: number;
}

interface HistoryObject {
  date: Date;
  value: number;
}
// interface HistoryObject {
//   date: string;
//   value: string;
// }

interface HistoryDataContainer {
  regular: HistoryObject[];
  inverse: HistoryObject[];
}

const formatHistoryData = (data: any): HistoryDataContainer => {
  const regular: HistoryObject[] = [];
  const inverse: HistoryObject[] = [];

  data.forEach((currencyObject: any) => {
    const { PointInTime, InterbankRate } = currencyObject;
    const parsedUnixDate = d3.timeParse("%Q")(PointInTime);
    const inverseRate = 1 / InterbankRate;

    regular.push({
      date: parsedUnixDate,
      value: InterbankRate,
    });
    inverse.push({
      date: parsedUnixDate,
      value: inverseRate,
    });
  });

  return {
    regular,
    inverse,
  };
};

function Home({
  selectOptions,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [fromCurrencyCode, setFromCurrencyCode] = useState<string>("USD");
  const [toCurrencyCode, setToCurrencyCode] = useState<string>("EUR");
  const [fromCurrencyValue, setFromCurrencyValue] = useState<number>(1);
  const [currencyRateState, setCurrencyRateState] =
    useState<CurrencyRateState>();

  const [historyData, setHistoryData] = useState<HistoryDataContainer>();
  const [swapCount, setSwapCount] = useState<number>(0);
  const currenciesAreEqual = areEqual(fromCurrencyCode, toCurrencyCode);

  const [currentRate, setCurrentRate] = useState<CurrentRateMode>(
    CurrentRateMode.regular
  );

  const [isLoading, setIsLoading] = useState(true);

  const historyChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currenciesAreEqual) {
      setToCurrencyCode(fromCurrencyCode);
      setCurrencyRateState({
        regular: 1,
        inverse: 1,
      });
      setSwapCount(0);
    } else if (swapCount > 0 && swapCount % 2 !== 0) {
      setCurrentRate(CurrentRateMode.inverse);
    } else if (swapCount > 0 && swapCount % 2 === 0) {
      setCurrentRate(CurrentRateMode.regular);
    } else if (swapCount === 0) {
      axios
        .post(CONVERT_CURRENCY_URL, {
          FROM_CURRENCY_CODE: fromCurrencyCode,
          TO_CURRENCY_CODE: toCurrencyCode,
          withHistory: true,
        })
        .then((response) => {
          const { REGULAR_RATE, INVERSE_RATE, HISTORY_DATA } = response.data;

          const formattedHistoryData = formatHistoryData(HISTORY_DATA);
          setHistoryData(formatHistoryData);

          setCurrencyRateState({
            regular: REGULAR_RATE,
            inverse: INVERSE_RATE,
          });

          setCurrentRate(CurrentRateMode.regular);
        })
        .catch((err) => {
          console.log("PROXY SERVER REQUEST ERROR");
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    return () => {
      // cleanup
    };
  }, [fromCurrencyCode, toCurrencyCode, swapCount, currenciesAreEqual]);

  useEffect(() => {
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
      width = 600 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    // .select("#my-dataviz")
    const svg = d3
      .select(historyChartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const displayChart = (data: HistoryObject[]) => {
      const x = d3
        .scaleTime()

        .domain(
          d3.extent(data, function (d) {
            return d.date;
          })
        )
        .range([0, width]);
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

      // Add Y axis
      const y = d3
        .scaleLinear()
        .domain([
          d3.min(data, function (d) {
            return +d.value - +d.value * 0.02;
          }) as number,
          d3.max(data, function (d) {
            return +d.value;
          }) as number,
        ])
        .range([height, 0]);
      svg.append("g").call(d3.axisLeft(y));

      // Add the line
      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              return x(d.date);
            })
            .y(function (d) {
              return y(d.value);
            })
        );
    };
    if (historyData) {
      displayChart(historyData[currentRate]);
    }
  }, [historyData, currentRate]);

  const swapCurrencies = () => {
    setSwapCount((prevState) => (prevState += 1));
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
          currencyRateState={currencyRateState!}
          currentRateMode={currentRate}
          isLoading={isLoading}
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
              selectOptions={selectOptions}
              setSwapCount={setSwapCount}
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
              selectOptions={selectOptions}
              setSwapCount={setSwapCount}
            />
          </div>
        </div>
        <div ref={historyChartRef}></div>
        {/* <HistoryGraph data={historyData} /> */}
      </main>

      <footer className={styles.footer}>
        <a href="https://github.com/viachess" target="_blank" rel="noreferrer">
          Github
        </a>
      </footer>
    </div>
  );
}

export default Home;

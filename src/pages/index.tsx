import styles from "@/styles/Home.module.css";
import axios from "axios";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import AmountInput from "@/components/AmountInput";
import CurrencySelector from "@/components/CurrencySelector";
import ExchangeDetails from "@/components/ExchangeDetails";
import SwapIcon from "@/components/SwapIcon";
import { areEqual } from "@/utils";
import {
  currencyPairs,
  CurrencySelectOption,
  getSelectOptions,
} from "@/utils/currencyPairs";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import {
  CONVERT_CURRENCY_URL,
  chartDimensions,
} from "@/features/home/constants";
import { formatHistoryData } from "@/features/home/utils";
import {
  CurrentRateMode,
  CurrencyRateState,
  HistoryDataContainer,
  HistoryObject,
} from "@/features/home/types";

export const getStaticProps: GetStaticProps = async () => {
  const selectOptions: CurrencySelectOption[] = getSelectOptions(currencyPairs);
  return {
    props: {
      selectOptions,
    },
  };
};

function HomePage({
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

  const margin = chartDimensions.margin,
    width = chartDimensions.width - margin.left - margin.right,
    height = chartDimensions.height - margin.top - margin.bottom;

  const historyChartElementRef = useRef<HTMLDivElement>(null);
  const chartSVGRef =
    useRef<d3.Selection<SVGGElement, unknown, null, undefined>>();
  useEffect(() => {
    const svg = d3
      // select a pre-created div element. Might be a decent option to pre-create an svg
      // and update it with following 'attr' methods.
      .select(historyChartElementRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    chartSVGRef.current = svg;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          setHistoryData(formattedHistoryData);

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
  }, [fromCurrencyCode, toCurrencyCode, swapCount, currenciesAreEqual]);

  useEffect(() => {
    const displayChart = (
      currencyValueHistory: HistoryObject[],
      svg: d3.Selection<SVGGElement, unknown, null, undefined>
    ) => {
      svg.html("");

      const hasSinglePoint = currencyValueHistory.length === 1;
      let xDomain: [Date, Date];
      if (hasSinglePoint) {
        const only = currencyValueHistory[0];
        const start = new Date(only.date.getTime() - 12 * 60 * 60 * 1000);
        const end = new Date(only.date.getTime() + 12 * 60 * 60 * 1000);
        xDomain = [start, end];
      } else {
        xDomain = d3.extent(currencyValueHistory, (d) => d.date) as [
          Date,
          Date
        ];
      }

      const x = d3.scaleTime().domain(xDomain).range([0, width]);
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

      const minY = d3.min(currencyValueHistory, (d) => d.value) as number;
      const maxY = d3.max(currencyValueHistory, (d) => d.value) as number;
      const padding = (maxY || 1) * 0.01;
      const y = d3
        .scaleLinear()
        .domain([Math.max(0, minY - padding), maxY + padding])
        .range([height, 0]);
      svg.append("g").call(d3.axisLeft(y));

      if (!hasSinglePoint) {
        const lineGenerator = d3
          .line<HistoryObject>()
          .x((d) => x(d.date))
          .y((d) => y(d.value));
        svg
          .append("path")
          .datum(currencyValueHistory)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 1.5)
          .attr("d", lineGenerator);
      } else {
        const only = currencyValueHistory[0];
        svg
          .append("circle")
          .attr("cx", x(only.date))
          .attr("cy", y(only.value))
          .attr("r", 3)
          .attr("fill", "steelblue");
      }
    };
    if (historyData) {
      displayChart(historyData[currentRate], chartSVGRef.current!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyData?.regular, historyData?.inverse, currentRate]);

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
        <div className={styles.chartContainer}>
          <div ref={historyChartElementRef}></div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://github.com/viachess" target="_blank" rel="noreferrer">
          Github
        </a>
      </footer>
    </div>
  );
}

export default HomePage;

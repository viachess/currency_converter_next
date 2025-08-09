import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { logger } from "@/services/logger";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // window-level unhandled errors
    function onError(event: ErrorEvent) {
      logger.error("window.onerror", event.error ?? event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    }
    // unhandled promise rejections
    function onRejection(event: PromiseRejectionEvent) {
      logger.error("unhandledrejection", event.reason);
    }

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default MyApp;

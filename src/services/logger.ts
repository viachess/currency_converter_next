type LogLevel = "debug" | "info" | "warn" | "error";

export type LogPayload = {
  level: LogLevel;
  message: string;
  timestamp: string;
  stack?: string;
  url?: string;
  userAgent?: string;
  context?: Record<string, unknown>;
};

function buildPayload(
  level: LogLevel,
  message: string,
  error?: unknown,
  context?: Record<string, unknown>
): LogPayload {
  const isError = error instanceof Error;
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    stack: isError ? error.stack : undefined,
    url: typeof window !== "undefined" ? window.location.href : undefined,
    userAgent:
      typeof window !== "undefined" ? window.navigator.userAgent : undefined,
    context,
  };
}

async function sendToServer(payload: LogPayload) {
  try {
    if (typeof window === "undefined") {
      // server: just log
      const toConsole = `[${
        payload.timestamp
      }] ${payload.level.toUpperCase()} - ${payload.message}`;
      if (payload.level === "error") {
        // eslint-disable-next-line no-console
        console.error(toConsole, { payload });
      } else if (payload.level === "warn") {
        // eslint-disable-next-line no-console
        console.warn(toConsole, { payload });
      } else if (payload.level === "info") {
        // eslint-disable-next-line no-console
        console.info(toConsole, { payload });
      } else {
        // eslint-disable-next-line no-console
        console.debug(toConsole, { payload });
      }
      return;
    }
    await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // no-op
  }
}

export const logger = {
  debug(message: string, context?: Record<string, unknown>) {
    const payload = buildPayload("debug", message, undefined, context);
    // eslint-disable-next-line no-console
    console.debug(payload.message, { payload });
    void sendToServer(payload);
  },
  info(message: string, context?: Record<string, unknown>) {
    const payload = buildPayload("info", message, undefined, context);
    // eslint-disable-next-line no-console
    console.info(payload.message, { payload });
    void sendToServer(payload);
  },
  warn(message: string, error?: unknown, context?: Record<string, unknown>) {
    const payload = buildPayload("warn", message, error, context);
    // eslint-disable-next-line no-console
    console.warn(payload.message, { payload });
    void sendToServer(payload);
  },
  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    const payload = buildPayload("error", message, error, context);
    // eslint-disable-next-line no-console
    console.error(payload.message, { payload });
    void sendToServer(payload);
  },
};

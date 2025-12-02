import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";

let LOCAL_SENTRY_DSN = null;
try {
  const env = require("./env");
  LOCAL_SENTRY_DSN = env && env.SENTRY_DSN;
} catch (e) {
}

const getDsn = () => {
  if (LOCAL_SENTRY_DSN) return LOCAL_SENTRY_DSN;
  const extras = (Constants && (Constants.manifest?.extra || Constants.expoConfig?.extra)) || {};
  if (extras.SENTRY_DSN) return extras.SENTRY_DSN;
  if (process && process.env && process.env.SENTRY_DSN) return process.env.SENTRY_DSN;
  return null;
};

export const initSentry = () => {
  const dsn = getDsn();
  if (!dsn) {
    console.warn("Sentry not initialized: no DSN found. Set SENTRY_DSN in app config or env.");
    return { enabled: false };
  }

  Sentry.init({
    dsn,
    debug: true,
    tracesSampleRate: 1.0,
  });

  return { enabled: true };
};

export default Sentry;

import React from "react";
import { Platform } from "react-native";
import { StripeProvider } from "@stripe/stripe-react-native";

const PUBLISHABLE_KEY = "pk_test_51SXlPWAgGDXC3VOO9xZEk9AgWO86gJr17yjVodhQPFtgxnOAZ1DUin4ZciCLyd0VrNPch1clROe3OvPeWxzG9zxz00wmQGY7Yy"; // 

export default function StripeWrapper({ children }: { children: any }) {
  if (Platform.OS === "web") return <>{children}</>;
  return <StripeProvider publishableKey={PUBLISHABLE_KEY}>{children}</StripeProvider>;
}

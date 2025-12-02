import React from 'react';
import { Slot } from 'expo-router';
import StripeWrapper from '@/utils/StripeProviderWrapper';
import { initSentry } from '@/utils/SentryConfig';

initSentry();

export default function RootLayout() {
  return (
    <StripeWrapper>
      <Slot />
    </StripeWrapper>
  );
}

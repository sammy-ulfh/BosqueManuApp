import React from 'react';
import { Slot } from 'expo-router';
import StripeWrapper from '@/utils/StripeProviderWrapper';

export default function RootLayout() {
  return (
    <StripeWrapper>
      <Slot />
    </StripeWrapper>
  );
}

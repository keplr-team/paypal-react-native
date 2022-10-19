import React from 'react';
import { NativeModules, Platform, requireNativeComponent } from 'react-native';
import type {
  PaypalButtonOrder,
  PaypalButtonShipping,
  PaypalButtonVariant,
  PaypalConfig,
} from 'src/types';

interface Props {
  style: {
    flex?: number;
    width?: number;
    height: number;
  };
  variant: PaypalButtonVariant;
  order: PaypalButtonOrder;
  shipping: PaypalButtonShipping;
  onApprove: ({ nativeEvent }: { nativeEvent: { orderId: string } }) => void;
  onError: ({ nativeEvent }: { nativeEvent: { error: string } }) => void;
}

export const initPaypal = async ({
  clientId,
  returnUrl,
  live,
}: PaypalConfig) => {
  // Run setup only for IOS, ANDROID setup occurs at the initialization of the module
  if (Platform.OS === 'ios')
    await NativeModules.RNPaypal.setup(clientId, returnUrl, live);
};

export const PaypalButton = (props: Props) => <NativePaypalButton {...props} />;

const NativePaypalButton = requireNativeComponent<Props>('RNPaypalButton');

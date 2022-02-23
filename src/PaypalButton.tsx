import React from 'react';
import { NativeModules, requireNativeComponent } from 'react-native';
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
  return await NativeModules.RNPaypal.setup(clientId, returnUrl, live);
};

export const PaypalButton = (props: Props) => <NativePaypalButton {...props} />;

const NativePaypalButton = requireNativeComponent<Props>('RNPaypalButton');

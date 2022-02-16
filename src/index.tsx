import React, { useEffect, useState } from 'react';

import { NativeModules, requireNativeComponent } from 'react-native';

export interface PaypalButtonVariant {
  color: 'gold' | 'silver' | 'black' | 'white' | 'blue';
  size: 'expanded' | 'collapsed' | 'mini' | 'full';
  label: 'payWith' | 'buyNow' | 'checkout';
  shape: 'rounded' | 'hardEdges' | 'softEdges';
}

export interface PaypalButtonConfig {
  clientId: string;
  returnUrl: string;
  live: boolean;
}

export interface PaypalButtonShipping {
  address?: string;
  city?: string;
  postalCode?: string;
  countryCode: string;
}
export interface PaypalButtonOrder {
  referenceId: string;
  amount: string;
  currency: string;
}
interface Props {
  style: {
    flex?: number;
    width?: number;
    height: number;
  };
  config: PaypalButtonConfig;
  variant: PaypalButtonVariant;
  order: PaypalButtonOrder;
  shipping: PaypalButtonShipping;
  onApprove: ({ nativeEvent }: { nativeEvent: { orderId: string } }) => void;
  onError: ({ nativeEvent }: { nativeEvent: { error: string } }) => void;
}

type NativeProps = Omit<Props, 'config'>;

export const PaypalButton = ({ config, ...rest }: Props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await Paypal.init(config.clientId, config.returnUrl, config.live);
      setTimeout(() => setLoading(false), 1000);
    };
    init();
  }, [config]);

  return !loading ? <NativePaypalButton {...rest} /> : null;
};

const Paypal = {
  async init(clientId: string, returnUrl: string, live: boolean) {
    return await NativeModules.RNPaypal.setup(clientId, returnUrl, live);
  },
};

const NativePaypalButton =
  requireNativeComponent<NativeProps>('RNPaypalButton');

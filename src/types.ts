export type PaypalConfig = {
  clientId: string;
  returnUrl: string;
  live: boolean;
};

export type PaypalButtonVariant = {
  color: 'gold' | 'silver' | 'black' | 'white' | 'blue';
  size: 'expanded' | 'collapsed' | 'mini' | 'full';
  label: 'payWith' | 'buyNow' | 'checkout';
  shape: 'rounded' | 'hardEdges' | 'softEdges';
};

export type PaypalButtonShipping = {
  address?: string;
  city?: string;
  postalCode?: string;
  countryCode: string;
};
export type PaypalButtonOrder = {
  referenceId: string;
  invoiceId: string;
  amount: string;
  currency: string;
};

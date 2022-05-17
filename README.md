# Paypal React Native SDK

RN library using Paypal Checkout SDK

## Installation

```sh
yarn add @keplr/paypal-react-native
or
npm install @keplr/paypal-react-native
```

### Requirements

#### General 
1. Install `react-native-config`

```
yarn add `react-native-config`
```

2. Create an `.env` file to your react-native project root

Fill it with : 
```
ENV=local|production|development
PAYPAL_CLIENT_ID=Your Client ID
PAYPAL_RETURN_URL=Your return URL
```

#### Android

1. Add the required repository to the `android/build.gradle` (cf : https://developer.paypal.com/sdk/in-app/android/#link-addthesdktoyourapp).

```gradle
allprojects {
  repositories {
    mavenCentral()
    ...
    // This private repository is required to resolve the Cardinal SDK transitive dependency.
    maven {
      url "https://cardinalcommerceprod.jfrog.io/artifactory/android"
      credentials {
        // Be sure to add these non-sensitive credentials in order to retrieve dependencies from
        // the private repository.
        username "paypal_sgerritz"
        password "AKCp8jQ8tAahqpT5JjZ4FRP2mW7GMoFZ674kGqHmupTesKeAY2G8NcmPKLuTxTGkKjDLRzDUQ"
      }
    }
  }
}
```

2. Set `allowBackup` to true in your `android/app/src/main/AndroidManifest.xml` file. Paypal Checkout SDK requires the `allowBackup` to be true. (cf : https://developer.android.com/guide/topics/manifest/application-element#allowbackup)

```xml
<application android:allowBackup="true">
    ...
</application>
```

3. Android Paypal Initialisation repository

Add at the end of the method `onCreate()` in `MainApplication.java` the following code
```
RNPaypalModule.Companion.setup(this, BuildConfig.PAYPAL_CLIENT_ID, BuildConfig.PAYPAL_RETURN_URL, BuildConfig.ENV;
```


#### IOS

- Go in the `ios/` folder and install the pod dependencies :

```sh
pod install
or
arch -x86_64 pod install (for M1)
```

## Paypal initialisation -- Only for IOS

- Add in your `App.tsx` the call to `initPaypal` :

```ts
import { initPaypal } from '@keplr/paypal-react-native';

initPaypal({
  clientId: 'client_id_paypal',
  returnUrl: 'paypal_return_url',
  live: false, // true for production environment

});
```

## Usage

```tsx
import {
  PaypalButton,
  PaypalButtonOrder,
  PaypalButtonShipping,
  PaypalButtonVariant,
} from '@keplr/paypal-react-native';


const PaypalButton = () => {
  const paypalVariant: PaypalButtonVariant = {
    color: 'blue',
    label: 'payWith',
    size: 'full',
    shape: 'rounded',
  };
  const paypalOrder: PaypalButtonOrder = {
    referenceId: 'referenceId',
    invoiceId: 'invoiceId',
    amount: '10',
    currency: 'EUR',
  };
  const addressToPaypal: PaypalButtonShipping = {
    address: '10 rue du test',
    city: 'Paris',
    postalCode: '75000',
    countryCode: 'FR',
  };

  const handleApprove = ({ nativeEvent }: { nativeEvent: { orderId: string } }) => {
    // logic when the payment is approved by paypal
  };

  const handleError = () => {
    // logic when paypal is returning an error
  };

  return (
    <SafeAreaView>
      <View>
          <PaypalButton
            style={{ height: 52, width: 250 }}
            variant={paypalVariant}
            order={paypalOrder}
            shipping={addressToPaypal}
            onApprove={handleApprove}
            onError={handleError}
          />
      </View>
    </SafeAreaView>
  );
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

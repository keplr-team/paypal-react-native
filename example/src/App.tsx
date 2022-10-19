import React, { useState, useEffect } from 'react';

import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { initPaypal, PaypalButton } from '@keplr/paypal-react-native';
import Config from 'react-native-config';

// Only for IOS, For Android, env store in .env
const clientId = Config.PAYPAL_CLIENT_ID;
const returnUrl = Config.PAYPAL_RETURN_URL;

export default function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const initialize = async () => {
      await initPaypal({ clientId, returnUrl, live: false });
      setTimeout(() => setLoading(false), 1000);
    };

    // Only for IOS , for Android already initialized in OnCreate()
    if (Platform.OS === 'ios') {
      initialize();
    } else {
      setLoading(false);
    }
  }, []);

  return loading ? (
    <ActivityIndicator size="large" style={StyleSheet.absoluteFill} />
  ) : (
    <SafeAreaView style={styles.container}>
      <View>
        <PaypalButton
          style={{ height: 52, width: 250 }}
          variant={{
            color: 'white',
            label: 'payWith',
            size: 'full',
            shape: 'rounded',
          }}
          order={{
            referenceId: 'cart id',
            invoiceId: 'invoice id',
            amount: '100',
            currency: 'EUR',
          }}
          shipping={{
            address: '10 rue de rivoli',
            city: 'Paris',
            postalCode: '75000',
            countryCode: 'FR',
          }}
          onApprove={({ nativeEvent }) => {
            console.log('approved', nativeEvent.orderId);
            Alert.alert('Approved with id ' + nativeEvent.orderId);
          }}
          onError={({ nativeEvent }) => {
            console.log('error', nativeEvent.error);
            Alert.alert('error ' + nativeEvent.error);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});

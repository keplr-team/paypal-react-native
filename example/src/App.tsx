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

const clientId =
  Platform.OS === 'ios'
    ? 'AdBbb9q_DHJaUhnH5QyJ5LJNlhLxFicOOFp9ArVKmcGqIF1pNabw5uOHU-eP3T5MmeHLY9IuL0GvN1bz'
    : 'AeMqo0VZlBGYYT2Z8YVYLHD0OzGICs_dKuZFn2hqkVMckTji4f4vwABZMfB94_p2ajnZZromQdQTcv5L';
const returnUrl =
  Platform.OS === 'ios'
    ? 'org.reactjs.native.example.paypalhello://paypalpay'
    : 'com.paypalhello://paypalpay';

export default function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const initialize = async () => {
      await initPaypal({ clientId, returnUrl, live: false });
      setTimeout(() => setLoading(false), 1000);
    };
    initialize();
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

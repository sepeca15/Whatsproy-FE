import { useToastContext } from "@/contexts/ToastContext";
import api from "@/services/api/admin";
import { CardField, CardFieldInput, initStripe, useConfirmPayment, useStripe } from "@stripe/stripe-react-native";
import { Button } from "native-base";
import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native"


const CheckoutScreen = () => {
  const { showToast } = useToastContext();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const fetchPaymentSheetParams = async () => {
    console.log('llamare', );
    
    try {
      const resp = await api.stripe.createIntent({ amount: 100, currency: 'usd' });
      console.log('resp', resp);
      
      const { paymentIntent, ephemeralKey, customer } = resp

      return {
        paymentIntent,
        ephemeralKey,
        customer
      }
      
    } catch (error: any) {
      console.log(error.response.data.message);
      
      showToast({ title: 'Error', description: 'Error obteniendo clientSecret', status: 'error' });
      return {
        paymentIntent: '',
        ephemeralKey: '',
        customer: ''
      }
    }
  };

  const initializePaymentSheet = async () => {
    try {
      const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams()

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Subscription",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: 'jose'
        }
      })

      console.log('todo ok');
      

    } catch (error) {
      console.log(error);
    }
  }

  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet()
    
    if(error) {
      Alert.alert("Error code")
    } else {
      Alert.alert("Success")
    }
  }

  React.useEffect(()=> {
    const init = async() => {
      await initializePaymentSheet().then(async() => {
        openPaymentSheet()
      })
    }
    init()
  },[])

  return (
    <View style={{ flex: 1, padding: 20 }}>
    </View>
  );
};

export default CheckoutScreen
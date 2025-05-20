import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'native-base';
import { StripeProvider, useStripe, CardField, useConfirmPayment, CardFieldInput, initStripe } from '@stripe/stripe-react-native';
import api from '@/services/api/admin';
import { useToastContext } from '@/contexts/ToastContext';
import CheckoutScreen from './CheckoutScreen';

interface IStripe {
    amount: number;
    currency: string;
}

const Stripe = ({ amount, currency }: IStripe) => {
    return (
        <View>
            <CheckoutScreen/>
        </View>
    );
};

export default Stripe;

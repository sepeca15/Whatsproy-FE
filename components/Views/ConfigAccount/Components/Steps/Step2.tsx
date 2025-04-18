import React, { useRef, useEffect } from "react";
import { Alert, ScrollView as RNScrollView, View } from "react-native";
import { styles } from "../../ConfigAccountStyles";
import MethodOfPayCard from "../MethodOfpaycard";
import api from "@/services/api/admin";
import { IPlans } from "../MethodOfpaycard/MethodOfPayCardTypes";
import * as Progress from "react-native-progress";
import { Colors } from "@/constants/Colors";
import { ScrollView, Text } from "native-base";
import { FormattedMessage } from "react-intl"; 
import { initPaymentSheet, presentPaymentSheet } from "@stripe/stripe-react-native";
import { useToastContext } from "@/contexts/ToastContext";
import { useUser } from "@/hooks/redux/useUser";
import * as moment from "moment-timezone";


const Step2 = () => {
  const {handleAssignUserToPlan, user} = useUser()
  const [loading, setLoading] = React.useState<boolean>(false);
  const [plans, setPlans] = React.useState<IPlans[] | null>(null);
  const scrollViewRef = useRef<RNScrollView>(null);
  const [selectedPlan, setSelectedPlan] = React.useState<IPlans | null>(null)
  const { showToast } = useToastContext();
  const [loadingApi, setloadingApi] = React.useState<boolean>(false)

  const fetchPaymentSheetParams = async () => {
    try {
      const resp = await api.stripe.createIntent({ amount: 100, currency: 'usd' });
      const { paymentIntent, ephemeralKey, customer } = resp

      return {
        paymentIntent,
        ephemeralKey,
        customer
      }

    } catch (error: any) {
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

      if (error) {
        Alert.alert("Hubo un error al procesar su pago.")
      }

    } catch (error) {
      console.log(error);
    }
  }

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet()

    if (error) {
      Alert.alert("Error code")
    } else {
      Alert.alert("Success")
      assignPlan()
    }
  }

  React.useEffect(() => {
    if (selectedPlan) {
      const init = async () => {
        await initializePaymentSheet().then(async () => {
          openPaymentSheet()
        })
      }
      init()
    }
  }, [selectedPlan])


  const selectPlan = (plan: IPlans) => {
    setSelectedPlan(plan)
  }

  const loadPlans = async () => {
    setLoading(true);
    try {
      const allPlans = await api.plans.getAll();
      if (allPlans) {
        setPlans(allPlans);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 200, animated: false });
    }
  }, []);

  const assignPlan = async () => {
    try {
      if (loadingApi === false && selectedPlan) {
        setLoading(true);
        await handleAssignUserToPlan({
          fecha_inicio: moment.tz(user.timeZOne).toDate(),
          id_empresa: user.id_empresa,
          id_plan: selectedPlan.id,
        });
        showToast({
          title: <FormattedMessage id="planAssignedSuccess" />,
          status: "success",
        });      }
    } catch (error: any) {
      showToast({
        title:
          <FormattedMessage id="planAssignedError" /> +
          error.response.data.message,
        status: "error",
      });
      console.log(error);
    }finally {
      setloadingApi(false);
    }
  } 

  return loading ? (
    <Progress.Circle
      color={Colors.light.primary}
      style={{ margin: "auto", marginVertical: 10 }}
      indeterminate={true}
      size={50}
    />
  ) : (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={styles.containerStep2}
      ref={scrollViewRef}
    >
      <View style={styles.test}>
        {plans?.map((Plan, index) => (
          <MethodOfPayCard selectPlan={selectPlan} key={Plan.nombre + index} Plan={Plan} />
        ))}
      </View>
    </ScrollView>
  );
};

export default Step2;

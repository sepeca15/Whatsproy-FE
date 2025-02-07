import React, { useRef, useEffect } from "react";
import { ScrollView as RNScrollView, View } from "react-native";
import { styles } from "../../ConfigAccountStyles";
import MethodOfPayCard from "../MethodOfpaycard";
import api from "@/services/api/admin";
import { IPlans } from "../MethodOfpaycard/MethodOfPayCardTypes";
import * as Progress from "react-native-progress";
import { Colors } from "@/constants/Colors";
import { ScrollView } from "native-base";
import { FormattedMessage } from 'react-intl'; // Importa FormattedMessage

const Step2 = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [plans, setPlans] = React.useState<IPlans[] | null>(null);
  const scrollViewRef = useRef<RNScrollView>(null);

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

  return (
    loading ? (
      <Progress.Circle color={Colors.light.primary} style={{ margin: 'auto', marginVertical: 10 }} indeterminate={true} size={50} />
    ) : (
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.containerStep2}
        ref={scrollViewRef}
      >
        <View style={styles.test}>
          {plans?.map((Plan, index) => (
            <MethodOfPayCard key={Plan.nombre + index} Plan={Plan} />
          ))}
        </View>
      </ScrollView>
    )
  );
};

export default Step2;
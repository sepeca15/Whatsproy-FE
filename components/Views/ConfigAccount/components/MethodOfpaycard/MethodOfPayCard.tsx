import * as React from "react";
import { View } from "native-base";
import { styles } from "./MethodOfPayCardStyles";
import CustomText from "@/components/CustomText";
import ComunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CustomButton from "@/components/CustomButton";
import { FormattedMessage } from "react-intl";
import { Subscription } from "react-native-iap";

interface IMethodOfPayCard {
  Plan: any;
  selectPlan: (plan: Subscription) => void;
}

const subscriptionBenefits: any = {
  basicsubscriptionmeasy2025:
    "Mensajes ilimitados,Respuesta rapida,Cierre provisorio, Multiples cuentas,Calendario",
};

const MethodOfPayCard = ({ Plan, selectPlan }: IMethodOfPayCard) => {
  const getPrice = () => {
    if (Plan?.subscriptionOfferDetails?.length > 0) {
      const offerDetails = Plan.subscriptionOfferDetails[0];
      if (offerDetails?.pricingPhases?.pricingPhaseList?.length > 0) {
        const pricingPhase = offerDetails?.pricingPhases?.pricingPhaseList[0];
      }
    }
    return "Precio no disponible";
  };

  const price = getPrice();
  const benefits = subscriptionBenefits[Plan?.productId];
  const adventagesArray = benefits ? benefits?.split(",") : [];

  return (
    <View style={styles.MainContainer}>
      <View style={styles.containerCardMethodOfPay}>
        <View style={styles.ContainerHeader}>
          <CustomText style={styles.WhiteTextBold}>{Plan?.name}</CustomText>
          <View style={styles.ContainerRow}>
            {/* Aquí mostramos el precio correctamente */}
            <CustomText style={[styles.WhiteTextBold, { fontSize: 25 }]}>
              {price}
            </CustomText>
            <CustomText style={[styles.WhiteText, { fontSize: 20 }]}>
              /mo
            </CustomText>
          </View>
          <View style={styles.ContainerAdvantages}>
            {adventagesArray.map((advantage: string, index: number) => (
              <View key={index} style={styles.ContainerRowAdventage}>
                <View style={styles.ContainerCircle}>
                  <ComunityIcons name="check" color={"black"} size={10} />
                </View>
                <CustomText style={styles.WhiteText}>{advantage}</CustomText>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.ContainerFooter}>
          <CustomButton
            colorSpiner="white"
            style={{ alignContent: "flex-start" }}
            width={"100%"}
            background="#323232"
            onPress={() => selectPlan(Plan)} // Aquí estamos enviando el Plan entero
          >
            <FormattedMessage id="buyNow" />
          </CustomButton>
        </View>
      </View>
    </View>
  );
};

export default MethodOfPayCard;

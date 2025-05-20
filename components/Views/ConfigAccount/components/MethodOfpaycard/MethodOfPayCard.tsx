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
  planInfo: any;
}

const MethodOfPayCard = ({ Plan, selectPlan, planInfo }: IMethodOfPayCard) => {
  const getPrice = () => {
    if (Plan?.subscriptionOfferDetails?.length > 0) {
      const offerDetails = Plan.subscriptionOfferDetails[0];
      if (offerDetails?.pricingPhases?.pricingPhaseList?.length > 0) {
        const pricingPhase = offerDetails?.pricingPhases?.pricingPhaseList[0];
        return pricingPhase?.formattedPrice;
      }
    }
    return <FormattedMessage id="priceNotAvailable" defaultMessage="Precio no disponible" />;
  };

  const price = planInfo?.costoUSD ? `${planInfo?.costoUSD} USD` : getPrice();
  const adventagesArray = planInfo?.adventages ? planInfo?.adventages?.split(",") : [];

  return (
    <View style={styles.MainContainer}>
      {planInfo?.mostPopular && (
        <View style={styles.ContainerMostPopular}>
          <CustomText style={styles.PopularText}>
            🏅 <FormattedMessage id="mostPopular" defaultMessage="Más popular" />
          </CustomText>
        </View>
      )}
      <View style={styles.containerCardMethodOfPay}>
        <View style={styles.ContainerHeader}>
          <CustomText style={styles.WhiteTextBold}>{planInfo?.nombre ?? Plan?.name}</CustomText>
          <View style={styles.ContainerRow}>
            <CustomText style={styles.WhiteTextPrice}>{price}</CustomText>
            <CustomText style={styles.WhiteText}>/mo</CustomText>
          </View>
          <View style={styles.ContainerAdvantages}>
            {adventagesArray.map((advantage: string, index: number) => (
              <View key={index} style={styles.ContainerRowAdventage}>
                <View style={styles.ContainerCircle}>
                  <ComunityIcons name="check" color={"white"} size={14} />
                </View>
                <CustomText style={styles.WhiteText}>{advantage.trim()}</CustomText>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.ContainerFooter}>
          <CustomButton
            colorSpiner="white"
            style={styles.ButtonBuyNow}
            width={"100%"}
            background="#128c7e"
            onPress={() => selectPlan(Plan)}
          >
            <FormattedMessage id="buyNow" defaultMessage="Comprar ahora" />
          </CustomButton>
        </View>
      </View>
    </View>
  );
};

export default MethodOfPayCard;

import React, { useRef, useEffect } from "react";
import { Alert, ScrollView as RNScrollView, View } from "react-native";
import { styles } from "../../ConfigAccountStyles";
import MethodOfPayCard from "../MethodOfpaycard";
import * as Progress from "react-native-progress";
import { Colors } from "@/constants/Colors";
import { ScrollView } from "native-base";
import { FormattedMessage } from "react-intl";
import { useToastContext } from "@/contexts/ToastContext";
import { useUser } from "@/hooks/redux/useUser";
import * as moment from "moment-timezone";

import * as RNIap from "react-native-iap";
import { useIAPHandler } from "@/hooks/useInAppPurchease";

const itemSkus = ["basicsubscriptionmeasy2025"];

const Step2 = () => {
  const { handleAssignUserToPlan, user } = useUser();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [plans, setPlans] = React.useState<RNIap.Subscription[] | null>(null);
  const scrollViewRef = useRef<RNScrollView>(null);
  const [selectedPlan, setSelectedPlan] = React.useState<RNIap.Product | null>(
    null
  );
  const { showToast } = useToastContext();
  const [loadingApi, setloadingApi] = React.useState<boolean>(false);

  const [products, setProducts] = React.useState<RNIap.Subscription[]>([]);

  useIAPHandler(user?.id_empresa ?? "");

  React.useEffect(() => {
    RNIap.initConnection().then(() => {
      RNIap.getSubscriptions({ skus: itemSkus }).then((data) => {
        setProducts(data);
        setPlans(data);
      });
    });

    return () => {
      RNIap.endConnection();
    };
  }, []);

  const handleSubscribe = async (
    sku: string,
    offerToken: string,
    skuOffer: string
  ) => {
    try {
      if (products?.length > 0) {
        const purchase = (await RNIap.requestSubscription({
          sku,
          subscriptionOffers: [
            {
              sku: skuOffer,
              offerToken: offerToken,
            },
          ],
          developerPayload: user?.id_empresa,
        } as any)) as any;

        if (purchase?.purchaseToken) {
          showToast({
            title: "Suscripción iniciada correctamente",
            status: "success",
          });
        }
      }
    } catch (error) {
      console.error("Error al subscribirse:", error);
      showToast({
        title: "Error al subscribirse",
        description: "Error inesperado al subscribirse",
        status: "error",
      });
    }
  };

  const selectPlan = (plan: any) => {
    setSelectedPlan(plan);
  
    const offer = plan.subscriptionOfferDetails?.[0];
  
    if (!offer) {
      showToast({
        title: "Sin ofertas disponibles",
        status: "warning",
      });
      return;
    }
  
    const offerToken = offer.offerToken;
    handleSubscribe(plan?.productId, offerToken, plan?.productId);
  };

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
        {plans?.map((plan, index) => (
          <MethodOfPayCard
            selectPlan={selectPlan}
            key={plan.productId + index}
            Plan={plan}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default Step2;

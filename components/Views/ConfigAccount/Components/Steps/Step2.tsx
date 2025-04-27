import React, { useRef, useEffect } from "react";
import {
  Alert,
  ScrollView as RNScrollView,
  View,
  ActivityIndicator,
} from "react-native";
import { styles } from "../../ConfigAccountStyles";
import MethodOfPayCard from "../MethodOfpaycard";
import * as Progress from "react-native-progress";
import { Colors } from "@/constants/Colors";
import { ScrollView, Text } from "native-base";
import { useToastContext } from "@/contexts/ToastContext";
import { useUser } from "@/hooks/redux/useUser";
import * as RNIap from "react-native-iap";
import api from "@/services/api/admin";
import LottieView from "lottie-react-native";
import { FormattedMessage } from "react-intl";

const itemSkus = ["basicsubscriptionmeasy2025"];

const Step2 = () => {
  const { handleAssignUserToPlan, user, handlePayOk } = useUser();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [plans, setPlans] = React.useState<RNIap.Subscription[] | null>(null);
  const scrollViewRef = useRef<RNScrollView>(null);
  const [selectedPlan, setSelectedPlan] = React.useState<RNIap.Product | null>(
    null
  );
  const { showToast } = useToastContext();
  const [products, setProducts] = React.useState<RNIap.Subscription[]>([]);
  const handledTokensRef = useRef<Set<string>>(new Set());

  const purchaseListenerRef = useRef<any>(null);
  const errorListenerRef = useRef<any>(null);

  useEffect(() => {
    const init = async () => {
      await RNIap.initConnection();
      const subs = await RNIap.getSubscriptions({ skus: itemSkus });
      setProducts(subs);
      setPlans(subs);
    };

    init();

    purchaseListenerRef.current = RNIap.purchaseUpdatedListener(handlePurchase);
    errorListenerRef.current = RNIap.purchaseErrorListener(handlePurchaseError);

    return () => {
      purchaseListenerRef.current?.remove();
      errorListenerRef.current?.remove();
      RNIap.endConnection();
    };
  }, []);

  const handlePurchase = async (purchase: RNIap.Purchase) => {
    const { purchaseToken, productId } = purchase;

    if (!purchaseToken || handledTokensRef.current.has(purchaseToken)) return;
    handledTokensRef.current.add(purchaseToken);

    if (purchase?.isAcknowledgedAndroid && purchase?.purchaseStateAndroid !== 1)
      return;

    try {
      setLoading(true);

      const resp = await api.payments.createInitial({
        empresaId: user?.id_empresa,
        purcheaseToken: purchaseToken,
        sku: productId,
        purchease: purchase,
      });

      if (!resp?.success) {
        showToast({
          title: "No se pudo verificar la suscripción",
          descripcion: "Contacta con soporte para más información",
          status: "error",
        });
        return;
      }
      let success = false;
      for (let i = 0; i < 10; i++) {
        const res = await api.payments.verifyPaymentIsOk({
          empresaId: user?.id_empresa,
          purcheaseToken: purchaseToken,
        });

        if (res?.success) {
          success = true;
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      if (success) {
        showToast({
          title: "Suscripción realizada exitosamente",
          descripcion: "",
          status: "success",
        });

        handlePayOk();
      } else {
        showToast({
          title: "No se pudo verificar la suscripción",
          descripcion: "Intentos agotados. Contacta con soporte",
          status: "error",
        });
      }
    } catch (e) {
      console.error("Error al verificar compra con el backend:", e);
      showToast({
        title: "No se pudo verificar la suscripción",
        descripcion: "Contacta con soporte",
        status: "error",
      });
    } finally {
      await RNIap.finishTransaction({ purchase, isConsumable: false });
      setLoading(false);
    }
  };

  const handlePurchaseError = (error: RNIap.PurchaseError) => {
    console.warn("purchase error", error);
    showToast({
      title: "Error en la compra",
      description: error?.message || "Ocurrió un error inesperado",
      status: "error",
    });
  };

  const handleSubscribe = async (
    sku: string,
    offerToken: string,
    skuOffer: string
  ) => {
    try {
      setLoading(true);
      await RNIap.requestSubscription({
        sku,
        subscriptionOffers: [
          {
            sku: skuOffer,
            offerToken: offerToken,
          },
        ],
        developerPayload: user?.id_empresa,
      } as any);
    } catch (error) {
      console.error("Error al subscribirse:", error);
      showToast({
        title: "Error al subscribirse",
        description: "Error inesperado al subscribirse",
        status: "error",
      });
    } finally {
      setLoading(false);
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

    handleSubscribe(plan?.productId, offer.offerToken, plan?.productId);
  };

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      style={styles.containerStep2}
      ref={scrollViewRef}
    >
      <View style={styles.test}>
        {loading ? (
          <View
            style={{
              flex: 1,
              width: "100%",
              height: "auto",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text color="gray.800" fontWeight="semibold" fontSize={16}>
              {" "}
              <FormattedMessage id="procesingPayment" />
            </Text>
            <Text color="gray.500" paddingX={15} textAlign={"center"} fontWeight="semibold" fontSize={12}>
              {" "}
              <FormattedMessage id="procesingPaymentDesc" />
            </Text>
            <LottieView
              source={require("../../../../../constants/AnimationPaymentProcess.json")}
              loop={true}
              autoPlay={true}
              style={{
                width: 200,
                height: 160,
              }}
            />
          </View>
        ) : (
          plans?.map((plan, index) => (
            <MethodOfPayCard
              selectPlan={selectPlan}
              key={plan.productId + index}
              Plan={plan}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default Step2;

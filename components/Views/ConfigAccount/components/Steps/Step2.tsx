import type React from "react";
import { useRef, useEffect, useState } from "react";
import {
  View,
  Animated,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Text } from "native-base";
import { useToastContext } from "@/contexts/ToastContext";
import { useUser } from "@/hooks/redux/useUser";
import * as RNIap from "react-native-iap";
import api from "@/services/api/admin";
import LottieView from "lottie-react-native";
import { FormattedMessage } from "react-intl";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import Feather from "react-native-vector-icons/Feather";
import MethodOfPayCard from "../MethodOfpaycard";

const { width } = Dimensions.get("window");
const CARD_WIDTH = 280 + 12
interface SubscriptionPlansCarouselProps {
  onSuccess?: () => void;
  onNext?: () => void;
  onPlanSelect?: (plan: any) => void;
  showWarning?: boolean;
}

const Step2: React.FC<SubscriptionPlansCarouselProps> = ({
  onSuccess,
  onNext,
  onPlanSelect,
  showWarning = true,
}) => {
  const { user, handlePayOk } = useUser();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const [loading, setLoading] = useState<boolean>(false);
  const [plans, setPlans] = useState<RNIap.Subscription[] | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<RNIap.Product | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [defaultPayments, setDefaultPayments] = useState([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const purchaseListenerRef = useRef<any>(null);
  const errorListenerRef = useRef<any>(null);
  const handledTokensRef = useRef<Set<string>>(new Set());

  const { showToast } = useToastContext();
  const currentPayment = user?.payment;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLoadDefaultPayments = async () => {
    try {
      setLoading(true);
      const resp = await api.payments.getPlans();
      if (resp) {
        setDefaultPayments(resp);
      }
    } catch (error) {
      console.error(error);
      setCurrentIndex(0)
      showToast({
        title: "Error al cargar planes",
        descripcion: "No se pudieron cargar los planes de suscripción",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLoadDefaultPayments();
  }, []);

  const init = async () => {
    try {
      await RNIap.initConnection();
      const subs = await RNIap.getSubscriptions({
        skus: defaultPayments?.map((payment: any) => payment?.product_sku),
      });

      const plansWithInfo = subs.map((sub) => ({
        ...sub,
        planInfo:
          defaultPayments?.find(
            (itm: any) => itm?.product_sku === sub?.productId
          ) ?? null,
      }));

      setPlans(plansWithInfo);
    } catch (error) {
      console.error("Error initializing IAP:", error);
      showToast({
        title: "Error de inicialización",
        descripcion: "No se pudo inicializar el sistema de pagos",
        status: "error",
      });
    }
  };

  useEffect(() => {
    if (defaultPayments?.length > 0) {
      init();
    }

    purchaseListenerRef.current = RNIap.purchaseUpdatedListener(handlePurchase);
    errorListenerRef.current = RNIap.purchaseErrorListener(handlePurchaseError);

    return () => {
      purchaseListenerRef.current?.remove();
      errorListenerRef.current?.remove();
      RNIap.endConnection();
    };
  }, [defaultPayments?.length]);

  // Manejar compra
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
        if (onSuccess) {
          onSuccess();
        } else {
          handlePayOk();
        }
        if (onNext) {
          onNext();
        }
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
      descripcion: error?.message || "Ocurrió un error inesperado",
      status: "error",
    });
    setCurrentIndex(0)

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
      showToast({
        title: "Error al subscribirse",
        descripcion: "Error inesperado al subscribirse",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectPlan = (plan: any) => {
    setSelectedPlan(plan);
    onPlanSelect?.(plan);

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

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * CARD_WIDTH,
      animated: true,
    });
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (plans && currentIndex < plans.length - 1) {
      goToSlide(currentIndex + 1);
    }
  };

  console.log(currentIndex);

  if (loading || (!loading && !plans)) {
    return (
      <View style={styles.loadingContainer}>
        <Text color="white" fontWeight="bold" fontSize={18} textAlign="center">
          <FormattedMessage
            id="loadingPlans"
            defaultMessage="Cargando planes..."
          />
        </Text>
        <LottieView
          source={require("@/constants/AnimationPaymentProcess.json")}
          loop={true}
          autoPlay={true}
          style={styles.lottieAnimation}
        />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {showWarning && currentPayment && !currentPayment?.isActive && (
        <LinearGradient
          colors={["#FFF3CD", "#FCF4A3"]}
          style={styles.warningContainer}
        >
          <Text color="yellow.800" fontWeight="semibold" textAlign="center">
            ⚠️{" "}
            <FormattedMessage
              id="subscriptionExpired"
              defaultMessage="Tu suscripción actual expiró"
            />
          </Text>
        </LinearGradient>
      )}

      {loading ? (
        <View style={styles.processingContainer}>
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            style={styles.processingGradient}
          >
            <Text
              color="white"
              fontWeight="bold"
              fontSize={18}
              textAlign="center"
            >
              <FormattedMessage
                id="processingPayment"
                defaultMessage="Procesando pago..."
              />
            </Text>
            <Text
              color="rgba(255,255,255,0.8)"
              paddingX={15}
              textAlign="center"
              fontWeight="medium"
              fontSize={14}
              marginTop={2}
            >
              <FormattedMessage
                id="processingPaymentDesc"
                defaultMessage="Por favor espera mientras procesamos tu suscripción"
              />
            </Text>
            <LottieView
              source={require("@/constants/AnimationPaymentProcess.json")}
              loop={true}
              autoPlay={true}
              style={styles.lottieAnimation}
            />
          </LinearGradient>
        </View>
      ) : (
        <>
          {/* Carousel de planes - CORREGIDO */}
          <View style={styles.carouselContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              snapToInterval={CARD_WIDTH}
              snapToAlignment="center"
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              ref={scrollViewRef}
            >
              {plans?.map((plan: any, index) => (
                <MethodOfPayCard
                  selectPlan={selectPlan}
                  Plan={plan}
                  planInfo={plan?.planInfo}
                />
              ))}
            </ScrollView>

            {plans && plans.length > 1 && (
              <>
                <TouchableOpacity
                  style={[styles.navButton, styles.navButtonLeft]}
                  onPress={goToPrevious}
                  disabled={currentIndex === 0}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}

                >
                  <Feather
                    name="chevron-left"
                    size={24}
                    color={currentIndex === 0 ? "#ccc" : colors.primary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.navButton, styles.navButtonRight]}
                  onPress={goToNext}
                  disabled={currentIndex === plans.length - 1}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}

                >
                  <Feather
                    name="chevron-right"
                    size={24}
                    color={
                      currentIndex === plans.length - 1
                        ? "#ccc"
                        : colors.primary
                    }
                  />
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Indicadores de página */}
          {plans && plans.length > 1 && (
            <View style={styles.pageIndicators}>
              {plans.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.pageIndicator,
                    {
                      backgroundColor:
                        index === currentIndex ? colors.primary : "#ccc",
                    },
                  ]}
                  onPress={() => goToSlide(index)}
                />
              ))}
            </View>
          )}

          {plans && plans[currentIndex] && (
            <View
              style={[
                styles.planInfo,
                { backgroundColor: isDark ? "#2a2a2a" : "#f8f9fa" },
              ]}
            >
              <Text style={[styles.planInfoTitle, { color: colors.text }]}>
                {(plans as any)[currentIndex].planInfo?.nombre ||
                  plans[currentIndex]?.title}
              </Text>
              <Text
                style={[
                  styles.planInfoDescription,
                  { color: colors.textSecondary },
                ]}
              >
                <FormattedMessage
                  id="planSelected"
                  defaultMessage="Plan {index} de {total}"
                  values={{
                    index: currentIndex + 1,
                    total: plans.length,
                  }}
                />
              </Text>
            </View>
          )}
        </>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  loadingGradient: {
    width: "100%",
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    minHeight: 250,
  },
  processingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  processingGradient: {
    width: "100%",
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    minHeight: 250,
  },
  lottieAnimation: {
    width: 180,
    height: 140,
    marginTop: 16,
  },
  warningContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  carouselContainer: {
    position: "relative",
    height: "auto",
    marginBottom: 20,
  },
  scrollContent: {},
  slideContainer: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  navButton: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -20 }],
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 10,
  },
  navButtonLeft: {
    left: 10,
  },
  navButtonRight: {
    right: 10,
  },
  pageIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  pageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  planInfo: {
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
  planInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  planInfoDescription: {
    fontSize: 14,
  },
});

export default Step2;

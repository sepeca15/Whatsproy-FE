"use client";

import { useEffect, useState } from "react";
import {
  Text,
  View,
  Spinner,
  Box,
  VStack,
  HStack,
  Icon,
  Badge,
  Divider,
} from "native-base";
import CustomText from "@/components/CustomText";
import { FormattedMessage, useIntl } from "react-intl";
import LottieView from "lottie-react-native";
import CustomButton from "@/components/CustomButton";
import Step2 from "../ConfigAccount/components/Steps/Step2";
import { useUser } from "@/hooks/redux/useUser";
import {
  getSubscriptions,
  deepLinkToSubscriptions,
  deepLinkToSubscriptionsAndroid,
} from "react-native-iap";
import Animated from "react-native-reanimated";
import moment from "moment";
import {
  EMPRESA_PAYMENT_FREE_TIME_AFTER_CANCEL,
  subscriptionBenefits,
} from "@/constants/variables";
import { AntDesign, MaterialIcons, Feather } from "@expo/vector-icons";
import { Linking, Platform, TouchableOpacity, StyleSheet } from "react-native";
import { globalStyles } from "@/components/globalStyles";
import { ScrollView, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "react-native";
import GenericModal from "../ConfigAccount/components/GenericModal/GenericModal";

// Colores definidos por el usuario
const primaryColor = "#075e54";
const secondaryColor = "#128c7e";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    primary: primaryColor,
    secondary: secondaryColor,
    warning: "#F39C12",
    border: "#e1e1e1",
    success: "#2ECC71",
    textSecondary: "#000",
    danger: "#E74C3C",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: primaryColor,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    primary: primaryColor,
    border: "#e1e1e1",
    textSecondary: "#FFF",
    secondary: secondaryColor,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: primaryColor,
  },
};

const SubscriptionsView = () => {
  const intl = useIntl();
  const { user, handleAddUserData } = useUser();
  const [shouldSubscribe, setShouldSubscribe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productInfo, setProductInfo] = useState<any>(null);
  const currentPayment = user?.payment ? { ...user.payment } : null;

  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!currentPayment?.subscription_sku) return;
      try {
        const subs = await getSubscriptions({
          skus: [currentPayment.subscription_sku],
        });
        if (subs?.length > 0) {
          setProductInfo(subs[0]);
        }
      } catch (err) {
        console.warn("Error fetching subscription info", err);
      }
    };

    fetchProduct();
  }, [currentPayment]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const updatedUser = (await handleAddUserData()) as any;
      const currentPayment = updatedUser?.currentPayment;
      if (!currentPayment?.subscription_sku) return;
      const subs = await getSubscriptions({
        skus: [currentPayment.subscription_sku],
      });
      if (subs?.length > 0) {
        setProductInfo(subs[0]);
      }
    } catch (err) {
      console.warn("Error refreshing subscriptions", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCancelSubscription = async () => {
    await deepLinkToSubscriptions(currentPayment?.subscription_sku);
    if (Platform.OS === "ios") {
      Linking.openURL(
        "https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/manageSubscriptions"
      );
    } else {
      const result = await deepLinkToSubscriptionsAndroid({
        sku: currentPayment?.subscription_sku,
      });
    }
  };

  const renderActiveSubscription = () => {
    const expirationDate = currentPayment?.subscription_date
      ? moment(currentPayment.subscription_date)
      : null;

    const shouldShowExpiringSoon =
      expirationDate && expirationDate.diff(moment(), "days") <= 3;

    const isCancelled = currentPayment?.isCancelled;
    const cancelationInfo =
      isCancelled && expirationDate
        ? intl.formatMessage(
            {
              id: "subscriptionCancelledUntil",
              defaultMessage: "Cancelada, válida hasta {date}",
            },
            { date: expirationDate.format("LL") }
          )
        : null;
    const benefits = user?.payment?.plan?.adventages;
    const benefitsArray = (benefits ? benefits.split(",") : []) as string[];

    return (
      <Box style={styles.subscriptionCard}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.gradientHeader}
        >
          <HStack justifyContent="space-between" alignItems="center">
            <VStack>
              <Text style={styles.subscriptionTitle}>
                <FormattedMessage id="activeSubscription" />
              </Text>
              <Text style={styles.subscriptionSubtitle}>
                {productInfo?.title ?? currentPayment.subscription_sku}
              </Text>
            </VStack>
            <Box style={styles.statusBadge}>
              <Badge
                colorScheme={isCancelled ? "warning" : "success"}
                variant="solid"
                rounded="full"
              >
                <Text style={styles.badgeText}>
                  {isCancelled ? "CANCELADA" : "ACTIVA"}
                </Text>
              </Badge>
            </Box>
          </HStack>
        </LinearGradient>

        <Box style={styles.cardContent}>
          {shouldShowExpiringSoon && (
            <Box style={styles.warningBox}>
              <HStack space={2} alignItems="center">
                <Icon
                  as={Feather}
                  name="alert-triangle"
                  color="orange.500"
                  size={4}
                />
                <Text style={styles.warningText}>
                  <FormattedMessage id="subscriptionExpiring" />
                </Text>
              </HStack>
            </Box>
          )}

          {isCancelled && (
            <Box style={styles.cancelledBox}>
              <Text style={styles.cancelledText}>{cancelationInfo}</Text>
            </Box>
          )}

          <VStack space={4}>
            <HStack justifyContent="space-between" alignItems="center">
              <Text style={styles.detailLabel}>
                <FormattedMessage id="validUntil" />
              </Text>
              <Text style={styles.detailValue}>
                {currentPayment.subscription_date
                  ? moment(currentPayment.subscription_date)
                      .format("LL")
                  : "-"}
              </Text>
            </HStack>

            <Divider />

            {benefitsArray.length > 0 && (
              <VStack space={3}>
                <Text style={styles.benefitsTitle}>
                  <FormattedMessage id="benefits" />
                </Text>
                {benefitsArray.map((benefit, idx) => (
                  <HStack key={idx} space={3} alignItems="center">
                    <Box style={styles.checkIcon}>
                      <Icon
                        as={MaterialIcons}
                        name="check"
                        color="white"
                        size={3}
                      />
                    </Box>
                    <Text style={styles.benefitText}>{benefit.trim()}</Text>
                  </HStack>
                ))}
              </VStack>
            )}
          </VStack>

          <VStack space={3} mt={6}>
            {!currentPayment?.isCancelled ? (
              <CustomButton
                style={[styles.button, styles.cancelButton]}
                isDisabled={isLoading}
                onPress={handleCancelSubscription}
              >
                {isLoading ? (
                  <Spinner color="white" />
                ) : (
                  <Text style={styles.buttonText}>
                    <FormattedMessage id="cancelSubscription" />
                  </Text>
                )}
              </CustomButton>
            ) : (
              <CustomButton
                style={[styles.button, styles.renewButton]}
                onPress={() => setShouldSubscribe(true)}
              >
                <Text style={styles.buttonText}>
                  <FormattedMessage id="renewSuscription" />
                </Text>
              </CustomButton>
            )}
          </VStack>
        </Box>
      </Box>
    );
  };

  const renderEmptySubscription = () => (
    <Box style={styles.emptyContainer}>
      <LinearGradient
        colors={["rgba(7, 94, 84, 0.1)", "rgba(18, 140, 126, 0.1)"]}
        style={styles.emptyGradient}
      >
        <VStack space={6} alignItems="center">
          <Box style={styles.iconContainer}>
            <Icon as={Feather} name="star" size={12} color={colors.primary} />
          </Box>

          <VStack space={3} alignItems="center">
            <Text style={styles.emptyTitle}>
              <FormattedMessage id="noSubscriptions" />
            </Text>
            <Text style={styles.emptyDescription}>
              <FormattedMessage id="noSubscriptionsDesc" />
            </Text>
          </VStack>

          <LottieView
            source={require("../../../constants/Animation-nodata.json")}
            loop={false}
            autoPlay
            style={styles.lottieAnimation}
          />

          <CustomButton
            style={[styles.button, styles.subscribeButton]}
            onPress={() => setShouldSubscribe(true)}
          >
            <HStack space={2} alignItems="center">
              <Icon as={Feather} name="zap" color="white" size={4} />
              <Text style={styles.buttonText}>
                <FormattedMessage id="subscribe" />
              </Text>
            </HStack>
          </CustomButton>
        </VStack>
      </LinearGradient>
    </Box>
  );

  return (
    <View style={styles.container}>
      <Animated.View
        style={[globalStyles.header2, { backgroundColor: colors.primary }]}
      >
        <TouchableOpacity
          style={globalStyles.backButton}
          onPress={() => router.back()}
        >
          <AntDesign name="arrowleft" size={22} color="white" />
        </TouchableOpacity>
        <View style={globalStyles.headerContent}>
          <View style={globalStyles.headerLeft}>
            <CustomText
              style={globalStyles.businessName}
              accessibilityLabel="Subscription"
            >
              <FormattedMessage id="subscription" />
            </CustomText>
          </View>
        </View>
      </Animated.View>

      {shouldSubscribe && (
        <GenericModal
          visible={shouldSubscribe}
          onClose={() => setShouldSubscribe(false)}
          title={intl.formatMessage({
            id: "subscribe",
            defaultMessage: "Suscribirse",
          })}
        >
          <View style={styles.containerModal}>
            <View style={styles.ContainerHeader}>
              <Step2
                onNext={() => null}
                onSuccess={() => {
                  onRefresh();
                  setShouldSubscribe(false);
                }}
              />
            </View>
          </View>
        </GenericModal>
      )}

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentContainer}>
          {currentPayment?.isActive
            ? renderActiveSubscription()
            : renderEmptySubscription()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  ContainerHeader: {
    position: "relative",
    width: "100%",
    alignSelf: "flex-start",
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  containerModal: {
    width: "100%",
    backgroundColor: "white",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  subscriptionCard: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  gradientHeader: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  subscriptionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  subscriptionSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 4,
  },
  statusBadge: {
    alignItems: "center",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
  },
  cardContent: {
    padding: 20,
  },
  warningBox: {
    backgroundColor: "#FFF3CD",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    color: "#856404",
    fontSize: 14,
    fontWeight: "500",
  },
  cancelledBox: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  cancelledText: {
    color: "#6C757D",
    fontSize: 14,
    textAlign: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#6C757D",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#212529",
    fontWeight: "600",
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: primaryColor,
    justifyContent: "center",
    alignItems: "center",
  },
  benefitText: {
    fontSize: 14,
    color: "#495057",
    flex: 1,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
  },
  cancelButton: {
    backgroundColor: "#DC3545",
  },
  renewButton: {
    backgroundColor: primaryColor,
  },
  subscribeButton: {
    backgroundColor: primaryColor,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    width: "100%",
    maxWidth: 400,
  },
  emptyGradient: {
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212529",
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 16,
    color: "#6C757D",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  lottieAnimation: {
    width: 200,
    height: 160,
  },
});

export default SubscriptionsView;

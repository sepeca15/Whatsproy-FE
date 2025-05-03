import React, { useEffect, useState } from "react";
import { Text, View, Spinner, Box, VStack, HStack, Icon } from "native-base";
import CustomText from "@/components/CustomText";
import { FormattedMessage, useIntl } from "react-intl";
import LottieView from "lottie-react-native";
import CustomButton from "@/components/CustomButton";
import Step2 from "../ConfigAccount/components/Steps/Step2";
import GlobalModal from "@/components/Modal";
import { useUser } from "@/hooks/redux/useUser";
import {
  getSubscriptions,
  deepLinkToSubscriptions,
  deepLinkToSubscriptionsAndroid,
} from "react-native-iap";
import axios from "axios";
import Animated from "react-native-reanimated";
import { styles } from "../DateOrder/DateOrderStyles";
import moment from "moment";
import {
  EMPRESA_PAYMENT_FREE_TIME_AFTER_CANCEL,
  subscriptionBenefits,
} from "@/constants/variables";
import { MaterialIcons } from "@expo/vector-icons";
import { Linking, Platform } from "react-native";
import { globalStyles } from "@/components/globalStyles";
import { ScrollView, RefreshControl } from "react-native";

const SubscriptionsView = () => {
  const intl = useIntl();
  const { user, handleAddUserData } = useUser();
  const [shouldSubscribe, setShouldSubscribe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productInfo, setProductInfo] = useState<any>(null);
  const currentPayment = user?.payment ? { ...user.payment } : null;

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
      ? moment(currentPayment.subscription_date).add(
          EMPRESA_PAYMENT_FREE_TIME_AFTER_CANCEL,
          "days"
        )
      : null;

    const shouldShowExpiringSoon =
      currentPayment?.isCancelled &&
      expirationDate &&
      expirationDate.isAfter(moment());

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
    const benefits = subscriptionBenefits[currentPayment?.subscription_sku];
    const benefitsArray = (benefits ? benefits.split(",") : []) as string[];

    return (
      <Box
        p={5}
        borderRadius="lg"
        shadow={2}
        background="white"
        alignItems="center"
        w="90%"
      >
        {shouldShowExpiringSoon && (
          <Box
            background="yellow.100"
            borderRadius="md"
            p={2}
            mb={3}
            w="100%"
            alignItems="center"
          >
            <Text color="yellow.800" fontWeight="semibold">
              <FormattedMessage
                id="subscriptionExpiring"
                defaultMessage="Tu suscripción expirará pronto"
              />
            </Text>
          </Box>
        )}
        {isCancelled && (
          <Box
            background="gray.100"
            borderRadius="md"
            p={3}
            mt={4}
            w="100%"
            alignItems="center"
          >
            <Text color="gray.700" fontSize="sm">
              {cancelationInfo}
            </Text>
          </Box>
        )}
        {!currentPayment?.isCancelled && (
          <Text fontSize="lg" fontWeight="bold" mb={1}>
            <FormattedMessage
              id="activeSubscription"
              defaultMessage="Suscripción activa"
            />
          </Text>
        )}

        <Text
          fontSize="md"
          color="primary.600"
          textAlign={"center"}
          fontWeight="medium"
          mb={2}
        >
          {productInfo?.title ?? currentPayment.subscription_sku}
        </Text>

        <Text fontSize="sm" color="gray.500" mb={1}>
          <FormattedMessage id="validUntil" defaultMessage="Válida hasta" />:{" "}
          {currentPayment.subscription_date
            ? moment(currentPayment.subscription_date)
                .add(EMPRESA_PAYMENT_FREE_TIME_AFTER_CANCEL, "days")
                .format("LL")
            : "-"}
        </Text>

        {benefitsArray.length > 0 && (
          <VStack space={2} mt={4} w="100%">
            <Text fontWeight="semibold" fontSize="md" color="gray.700">
              <FormattedMessage id="benefits" defaultMessage="Beneficios" />
            </Text>
            {benefitsArray.map((benefit, idx) => (
              <HStack key={idx} space={2} alignItems="center">
                <Icon
                  as={MaterialIcons}
                  name="check-circle"
                  color="green.700"
                  size={4}
                />
                <Text fontSize="sm" color="gray.700">
                  {benefit.trim()}
                </Text>
              </HStack>
            ))}
          </VStack>
        )}

        {!currentPayment?.isCancelled && (
          <CustomButton
            mt={6}
            isDisabled={isLoading}
            onPress={handleCancelSubscription}
            colorSpiner="white"
          >
            {isLoading ? (
              <Spinner color="white" />
            ) : (
              <FormattedMessage id="cancelSubscription" />
            )}
          </CustomButton>
        )}
        {currentPayment?.isCancelled && (
          <CustomButton
            colorSpiner="white"
            onPress={() => setShouldSubscribe(true)}
          >
            <FormattedMessage id="renewSuscription" />
          </CustomButton>
        )}
      </Box>
    );
  };

  const renderEmptySubscription = () => (
    <>
      <Text color="gray.800" fontWeight="semibold" fontSize={24}>
        <FormattedMessage id="noSubscriptions" />
      </Text>
      <Text
        color="gray.500"
        paddingX={15}
        textAlign="center"
        fontWeight="semibold"
        fontSize={14}
      >
        <FormattedMessage id="noSubscriptionsDesc" />
      </Text>
      <LottieView
        source={require("../../../constants/Animation-nodata.json")}
        loop
        autoPlay
        style={{ width: 300, height: 250 }}
      />
      <CustomButton
        colorSpiner="white"
        onPress={() => setShouldSubscribe(true)}
      >
        <FormattedMessage id="subscribe" />
      </CustomButton>
    </>
  );

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={globalStyles.header}>
        <View style={globalStyles.headerContent}>
          <View style={globalStyles.headerLeft}>
            <CustomText
              style={globalStyles.businessName}
              accessibilityLabel="Subscriptions"
            >
              <FormattedMessage id="subscription" />
            </CustomText>
          </View>
        </View>
      </Animated.View>

      {shouldSubscribe && (
        <GlobalModal
          content={<Step2 onSuccess={() => setShouldSubscribe(false)} />}
          label={intl.formatMessage({
            id: "subscribe",
            defaultMessage: "Suscribirse",
          })}
          onClose={() => setShouldSubscribe(false)}
          isVisible
        />
      )}

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 16,
          gap: 12,
          flex: 1,
        }}
      >
        {" "}
        <View style={{ alignItems: "center", gap: 8, width: "100%" }}>
          {currentPayment?.active
            ? renderActiveSubscription()
            : renderEmptySubscription()}
        </View>
      </ScrollView>
    </View>
  );
};

export default SubscriptionsView;

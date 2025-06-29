import React, { useEffect } from "react";
import { SafeAreaView, ActivityIndicator, ScrollView } from "react-native";
import { Colors } from "../../../constants/Colors";
import CustomText from "./components/CustomText";
import MetricCard from "./components/MetricCard";
import LastActivityCard from "./components/LastActivityCard";
import QuickActionButton from "./components/QuickActionButton";
import styles from "./HomeStyles";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { FormattedMessage, useIntl } from "react-intl";
import * as Animatable from "react-native-animatable";
import { useUser } from "@/hooks/redux/useUser";
import { HStack, Icon, Image, Select, View } from "native-base";
import { globalStyles } from "@/components/globalStyles";
import SubscriptionInfo from "@/components/SubscriptionInfo";
import { useSubscriptionStatus } from "@/hooks/home_functions/useSubscriptionStatus";
import { ID_TIPOSERVICIO_RESERVA } from "@/services/api/tiposervicio/tiposervicio.type";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { useHomeData } from "@/hooks/redux/useHomeData";
import { getTimeAgo } from "@/hooks/home_functions/useLastOrders";

const Home: React.FC = () => {
  const intl = useIntl();
  const [filterType, setFilterType] = React.useState<string | undefined>(
    "lastMonth"
  );
  const firstLoadRef = React.useRef(true);

  const { user } = useUser();
  const {
    lastThreeOrders,
    numberClientes,
    numberIngresos,
    loaidngStatitics,
    numberPedidos,
    handleAddStatistics,
    loaded,
  } = useHomeData();
  const empresaName = user?.empresaName ?? "Empresa Name";
  const isReserva = user?.id_rol === 1;
  const currentPlan = user?.payment?.plan;
  const currentPayment = user?.payment;

  const lottieRef = React.useRef<LottieView>(null);

  const { subStatus } = useSubscriptionStatus();

  useEffect(() => {
    if (!loaded) {
      handleAddStatistics(filterType);
    }
  }, []);

  useEffect(() => {
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      return;
    }

    if (filterType) {
      handleAddStatistics(filterType);
    }
  }, [filterType]);

  const handleViewSubscriptionDetails = () => {
    router.push("/(tabs)/subscriptions");
  };

  const isCalendar = user?.tipo_servicio === ID_TIPOSERVICIO_RESERVA;

  React.useEffect(() => {
    return () => {
      lottieRef.current?.reset();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={globalStyles.header}>
        <View style={globalStyles.headerContent}>
          <View style={globalStyles.headerLeft}>
            <View w={16} h={16} borderRadius={100} background={"gray.200"}>
              {user.logo && (
                <Image
                  w={"full"}
                  h={"full"}
                  style={{ objectFit: "cover" }}
                  alt="logo"
                  rounded={"full"}
                  source={{ uri: user.logo }}
                />
              )}
            </View>
            <CustomText style={globalStyles.businessName}>
              {empresaName}
            </CustomText>
          </View>
        </View>
      </View>

      {!loaded ? (
        <ActivityIndicator
          size="large"
          color={Colors.light.primary}
          style={styles.loader}
        />
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator>
          <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={100}
            style={[styles.metricsContainer, { zIndex: 999 }]}
          >
            <HStack width={"100%"} flex={1}>
              <Select
                selectedValue={filterType}
                minWidth={120}
                width={"100%"}
                height={10}
                flex={1}
                marginBottom={5}
                accessibilityLabel={intl.formatMessage({
                  id: "selectPeriod",
                  defaultMessage: "Seleccionar Periodo",
                })}
                placeholder={intl.formatMessage({
                  id: "selectPeriod",
                  defaultMessage: "Seleccionar Periodo",
                })}
                onValueChange={(val) => {
                  setFilterType(val);
                }}
                style={{ zIndex: 999, width: "100%", flex: 1 }}
                borderRadius={10}
                fontSize={12}
                backgroundColor={"white"}
                _selectedItem={{
                  bg: `rgba(7, 94, 84, 0.1)`,
                  endIcon: (
                    <Icon
                      as={Ionicons}
                      name="checkmark"
                      size="xs"
                      color="#075e54"
                    />
                  ),
                }}
              >
                <Select.Item
                  label={intl.formatMessage({
                    id: "lastDay",
                    defaultMessage: "lastDay",
                  })}
                  value="lastDay"
                />
                <Select.Item
                  label={intl.formatMessage({
                    id: "lastWeek",
                    defaultMessage: "lastWeek",
                  })}
                  value="lastWeek"
                />
                <Select.Item
                  label={intl.formatMessage({
                    id: "lastMonth",
                    defaultMessage: "lastMonth",
                  })}
                  value="lastMonth"
                />
              </Select>
            </HStack>
            <MetricCard
              loading={loaidngStatitics}
              icon="cart-outline"
              title={intl.formatMessage({
                id: isReserva ? "reservasToday.home" : "ordersToday.home",
                defaultMessage: isReserva ? "Reservas Hoy" : "Pedidos Hoy",
              })}
              value={numberPedidos}
              onPress={() => {}}
            />

            <MetricCard
              loading={loaidngStatitics}
              icon="account-group"
              title={intl.formatMessage({
                id: "clients.home",
                defaultMessage: "Clientes",
              })}
              value={numberClientes}
              onPress={() => {}}
            />
            <MetricCard
              loading={loaidngStatitics}
              icon="cash-multiple"
              title={intl.formatMessage({
                id: "revenue.home",
                defaultMessage: "Ingresos",
              })}
              value={`$${Number(numberIngresos ?? 0).toFixed(2)}`}
              onPress={() => {}}
            />
          </Animatable.View>

          {currentPlan && subStatus && (
            <Animatable.View
              animation="fadeInUp"
              duration={800}
              delay={150}
              style={{ paddingHorizontal: 16 }}
            >
              <SubscriptionInfo
                currentPedidosMonthActual={subStatus?.currentMonthPedidos ?? 0}
                plan={currentPlan?.nombre ?? "-"}
                maxPedidos={subStatus?.maxPedidos}
                expiryDate={currentPayment?.subscription_date}
                isCancelled={currentPayment?.isCancelled}
                // benefits={nunguno}
                onViewDetails={handleViewSubscriptionDetails}
              />
            </Animatable.View>
          )}

          <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={200}
            style={styles.lastActivitiesContainer}
          >
            <CustomText style={styles.sectionTitle}>
              <FormattedMessage
                id={isReserva ? "lastReservas.home" : "lastOrders.home"}
                defaultMessage={
                  isReserva ? "Últimas 3 reservas" : "Últimos 3 pedidos"
                }
              />
            </CustomText>

            {lastThreeOrders.length > 0 ? (
              lastThreeOrders.map((order: any) => {
                return (
                  <LastActivityCard
                    key={order.id}
                    title={`${intl.formatMessage({
                      id: isReserva ? "reserva.card.home" : "pedido.card.home",
                      defaultMessage: isReserva ? "reserva" : "pedido",
                    })} #${order.id}`}
                    time={getTimeAgo(order?.createdAt, intl)}
                    id={order.id.toString()}
                    amount={order.amount || "$0"}
                    icon={order.icon || "receipt"}
                    address={
                      isCalendar
                        ? `${moment(order?.fecha).utc().format("YYYY-MM-DD HH:mm")}`
                        : order.address
                          ? `#${order.address}`
                          : "Dirección desconocida"
                    }
                    onPress={() =>
                      router.push({
                        pathname: "/(tabs)/orderDetails",
                        params: { orderId: order.id },
                      })
                    }
                  />
                );
              })
            ) : (
              <Animatable.View
                animation="fadeIn"
                duration={600}
                style={styles.emptyStateContainer}
              >
                <LottieView
                  ref={lottieRef}
                  source={require("../../../constants/Animation-non-order.json")}
                  autoPlay
                  loop
                  style={styles.emptyStateAnimation}
                />
                <CustomText style={styles.emptyStateTitle}>
                  <FormattedMessage
                    id="noOrden.home"
                    defaultMessage="No hay productos"
                  />
                </CustomText>
              </Animatable.View>
            )}

            <CustomText style={styles.sectionTitle}>
              <FormattedMessage
                id="quickActions.home"
                defaultMessage="Quick Actions"
              />
            </CustomText>

            <View style={styles.quickActionsGrid}>
              <QuickActionButton
                icon="calendar"
                title={intl.formatMessage({
                  id: isReserva ? "reservas.home" : "pedidos.home",
                  defaultMessage: isReserva ? "Reservas" : "Pedidos",
                })}
                onPress={() =>
                  router.push(
                    isReserva ? "/(tabs)/calendar" : "/(tabs)/pedidos"
                  )
                }
              />
              <QuickActionButton
                icon="cog"
                title={intl.formatMessage({
                  id: "settings.schedule",
                  defaultMessage: "Settings",
                })}
                onPress={() => router.push("/(tabs)/generalSettings")}
              />
            </View>
          </Animatable.View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Home;

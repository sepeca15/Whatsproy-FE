import React from "react";
import {
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from "react-native";
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
import { useOrdersDashboard } from "@/hooks/home_functions/useOrdersDashboard";
import { useUser } from "@/hooks/redux/useUser";
import { Image, View } from "native-base";
import { globalStyles } from "@/components/globalStyles";
import SubscriptionInfo from "@/components/SubscriptionInfo";
import { useSubscriptionStatus } from "@/hooks/home_functions/useSubscriptionStatus";
import { ID_TIPOSERVICIO_RESERVA } from "@/services/api/tiposervicio/tiposervicio.type";

const Home: React.FC = () => {
  const intl = useIntl();
  const { loading, ordersCount, dailyRevenue, refreshData, lastOrders } =
    useOrdersDashboard();
  const [refreshing, setRefreshing] = React.useState(false);
  const lottieRef = React.useRef<LottieView>(null);

  const { subStatus, refreshSubscriptionStatus } = useSubscriptionStatus();

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshData();
      await refreshSubscriptionStatus();
    } finally {
      setRefreshing(false);
    }
  };

  const { user } = useUser();
  const empresaName = user?.empresaName ?? "Empresa Name";
  const isReserva = user?.id_rol === 1;
  const currentPlan = user?.payment?.plan;
  const currentPayment = user?.payment;

  const isCalendar = user?.tipo_servicio === ID_TIPOSERVICIO_RESERVA;

  React.useEffect(() => {
    return () => {
      lottieRef.current?.reset();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={globalStyles.header}>
        <View style={globalStyles.headerContent}>
          <View style={globalStyles.headerLeft}>
            <View w={16} h={16} borderRadius={100} background={"gray.200"}>
              {user.logo && (
                <Image
                  w={"full"}
                  h={"full"}
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

      {/* Loading */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.light.primary}
          style={styles.loader}
        />
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.light.primary}
            />
          }
        >
          {/* Métricas */}
          <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={100}
            style={styles.metricsContainer}
          >
            <MetricCard
              icon="cart-outline"
              title={intl.formatMessage({
                id: isReserva ? "reservasToday.home" : "ordersToday.home",
                defaultMessage: isReserva ? "Reservas Hoy" : "Pedidos Hoy",
              })}
              value={ordersCount?.toString()}
              onPress={() => {}}
            />
            <MetricCard
              icon="account-group"
              title={intl.formatMessage({
                id: "clients.home",
                defaultMessage: "Clientes",
              })}
              value="120"
              onPress={() => {}}
            />
            <MetricCard
              icon="cash-multiple"
              title={intl.formatMessage({
                id: "revenue.home",
                defaultMessage: "Ingresos",
              })}
              value={`$${dailyRevenue}`}
              onPress={() => {}}
            />

            {currentPlan && (
              <SubscriptionInfo
                currentPedidosMonthActual={subStatus?.currentMonthPedidos ?? 0}
                plan={currentPlan?.nombre ?? "-"}
                maxPedidos={subStatus?.maxPedidos}
                expiryDate={currentPayment?.subscription_date}
              />
            )}
          </Animatable.View>

          {/* Últimas actividades */}
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

            {lastOrders.length > 0 ? (
              lastOrders.map((order) => {
                console.log(order);
                return (
                  <LastActivityCard
                    key={order.id}
                    title={`${intl.formatMessage({
                      id: isReserva ? "reserva.card.home" : "pedido.card.home",
                      defaultMessage: isReserva ? "reserva" : "pedido",
                    })} #${order.id}`}
                    time={order.time || "Desconocido"}
                    id={order.id.toString()}
                    amount={order.amount || "$0"}
                    icon={order.icon || "receipt"}
                    address={
                      isCalendar
                        ? `${order?.fecha}`
                        : (order.address ? `#${order.address}` : "Dirección desconocida")
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

            {/* Quick Actions */}
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

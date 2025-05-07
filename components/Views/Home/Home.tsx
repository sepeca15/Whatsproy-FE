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

const Home: React.FC = () => {
  const intl = useIntl();
  const { loading, ordersCount, dailyRevenue, refreshData, lastOrders } =
    useOrdersDashboard();
  const [refreshing, setRefreshing] = React.useState(false);
  // const [notificationsEnabled, setNotificationsEnabled] =
  React.useState<boolean>(false);
  const lottieRef = React.useRef<LottieView>(null);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshData();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  // React.useEffect(() => {
  //   const fetchPreference = async () => {
  //     const enabled = await getNotificationPreference();
  //     setNotificationsEnabled(enabled);
  //   };
  //   fetchPreference();
  // }, []);

  const { user } = useUser();
  const empresaName = user?.empresaName ?? "Empresa Name";


  if (user) {
    console.log("User:", user);
  }



  React.useEffect(() => {
    return () => {
      lottieRef.current?.reset();
    };
  }, []);

  // const toggleNotifications = () => {
  //   setNotificationsEnabled((prev) => {
  //     const newValue = !prev;
  //     saveNotificationPreference(newValue);
  //     return newValue;
  //   });
  // };

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
          {/* <TouchableOpacity
            onPress={toggleNotifications}
            style={[
              styles.iconButton,
              notificationsEnabled && {
                backgroundColor: Colors.light.secondary,
                borderRadius: 50,
              },
            ]}
          >
            <Ionicons
              name={
                notificationsEnabled
                  ? "notifications"
                  : "notifications-outline"
              }
              size={24}
              color="white"
            />
          </TouchableOpacity> */}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.light.primary}
          style={styles.loader}
        />
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.light.primary}
            />
          }
        >
          <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={100}
            style={styles.metricsContainer}
          >
            <MetricCard
              icon="cart-outline"
              title={intl.formatMessage({
                id: "ordersToday.home",
                defaultMessage: "Pedidos Hoy",
              })}
              value={ordersCount?.toString()}
              onPress={() => { }}
            />
            <MetricCard
              icon="account-group"
              title={intl.formatMessage({
                id: "clients.home",
                defaultMessage: "Clientes",
              })}
              value="120"
              onPress={() => { }}
            />
            <MetricCard
              icon="cash-multiple"
              title={intl.formatMessage({
                id: "revenue.home",
                defaultMessage: "Ingresos",
              })}
              value={`$${dailyRevenue}`}
              onPress={() => { }}
            />
          </Animatable.View>

          <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={200}
            style={styles.lastActivitiesContainer}
          >
            <CustomText style={styles.sectionTitle}>
              <FormattedMessage
                id="lastOrders.home"
                defaultMessage="Últimos 3 pedidos"
              />
            </CustomText>

            {lastOrders.length > 0 ? (
              lastOrders.map((order) => (
                <LastActivityCard
                  key={order.id}
                  title={`${intl.formatMessage({
                    id: "pedido.card.home",
                    defaultMessage: "pedido",
                  })} #${order.id}`}
                  time={order.time || "Desconocido"}
                  id={order.id?.toString() || "0"}
                  amount={order.amount || "$0"}
                  icon={order.icon || "receipt"}
                  address={order.address}
                  onPress={() => {
                    router.push({
                      pathname: "/(tabs)/orderDetails",
                      params: { orderId: order.id },
                    });
                  }}
                />
              ))
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
                  id: "pedidos.home",
                  defaultMessage: "Pedidos",
                })}
                onPress={() => router.push("/(tabs)/pedidos")}
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

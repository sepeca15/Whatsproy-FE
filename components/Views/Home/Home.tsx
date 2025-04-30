import React from "react";
import {
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Colors } from "../../../constants/Colors";
import CustomText from "./components/CustomText";
import MetricCard from "./components/MetricCard";
import LastActivityCard from "./components/LastActivityCard";
import QuickActionButton from "./components/QuickActionButton";
import styles from "./HomeStyles";
import { router } from "expo-router";
import Animated from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { FormattedMessage, useIntl } from "react-intl";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import {
  saveNotificationPreference,
  getNotificationPreference,
} from "../../../utils/notificaciones/notificationsStorage";
import { useOrdersDashboard } from "@/hooks/home_functions/useOrdersDashboard";
import { useUser } from "@/hooks/redux/useUser";
import { Image, View } from "native-base";

const Home: React.FC = () => {
  const intl = useIntl();
  const { loading, ordersCount, dailyRevenue, refreshData, lastOrders } =
    useOrdersDashboard();
  const [refreshing, setRefreshing] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] =
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

  React.useEffect(() => {
    let isMounted = true;
    const fetchPreference = async () => {
      const enabled = await getNotificationPreference();
      setNotificationsEnabled(enabled);
    };
    fetchPreference();
  }, []);

  const { user } = useUser();

  const empresaName = user?.empresaName ?? "Empresa Name";

  React.useEffect(() => {
    return () => {
      lottieRef.current?.reset(); 
    };
  }, []);

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => {
      const newValue = !prev
      saveNotificationPreference(newValue)
      return newValue
    })
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View w={20} h={20} borderRadius={100} background={'gray.200'} >
              {
                user.logo && 
                <Image w={'full'} h={'full'} alt="logo" rounded={'full'} source={{uri:user.logo}}/>
              }
            </View>
            <CustomText style={styles.businessName} accessibilityLabel="Nombre del negocio">
              {empresaName}
            </CustomText>
          </View>
          <TouchableOpacity
            onPress={toggleNotifications}
            style={[
              styles.iconButton,
              notificationsEnabled && {
                backgroundColor: Colors.light.secondary,
                borderRadius: 50,
              },
            ]}
            accessibilityLabel="Toggle notificaciones"
          >
            <Ionicons
              name={
                notificationsEnabled ? "notifications" : "notifications-outline"
              }
              size={24}
              color={notificationsEnabled ? "white" : "white"} // el ícono será blanco sobre el fondo verde
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.light.primary}
          style={styles.loader}
        />
      ) : (
        <>
          <Animated.ScrollView
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
            <Animated.View style={styles.metricsContainer}>
              <MetricCard
                icon="cart-outline"
                title={intl.formatMessage({
                  id: "ordersToday.home",
                  defaultMessage: "Peeeedidos Hoy",
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
            </Animated.View>
            <Animated.View style={styles.lastActivitiesContainer}>
              <CustomText
                style={styles.sectionTitle}
                accessibilityLabel="Últimos 3 pedidos"
              >
                <FormattedMessage
                  id="lastOrders.home"
                  defaultMessage="Últimos 3 pedidos"
                />
              </CustomText>
              {lastOrders.length > 0 ? (
                lastOrders.map((order) => (
                  <LastActivityCard
                    key={order.id}
                    title={`${intl.formatMessage({ id: "pedido.card.home", defaultMessage: "pedido" })} #${order.id}`}
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
                  style={styles.emptyStateContainer}
                >
                  <LottieView
                    ref={lottieRef}
                    source={
                      require("../../../constants/Animation-non-order.json")
                    }
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
                  onPress={() => {
                    router.push("/(tabs)/pedidos");
                  }}
                />
                <QuickActionButton
                  icon="cog"
                  title={intl.formatMessage({
                    id: "settings.schedule",
                    defaultMessage: "Settings",
                  })}
                  onPress={() => {
                    router.push("/(tabs)/generalSettings");
                  }}
                />
              </View>
            </Animated.View>
          </Animated.ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

export default Home;



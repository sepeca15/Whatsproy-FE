

import React, { useRef } from "react"
import { View, ScrollView, SafeAreaView, RefreshControl, ActivityIndicator, Text } from "react-native"
import { Colors } from "../../../constants/Colors"
import CustomText from "./components/CustomText"
import MetricCard from "./components/MetricCard"
import LastActivityCard from "./components/LastActivityCard"
import QuickActionButton from "./components/QuickActionButton"
import styles from "./HomeStyles"
import { router } from "expo-router"
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated"
import LottieView from "lottie-react-native"
import { FormattedMessage, useIntl } from "react-intl"
import * as Animatable from "react-native-animatable"
import { Ionicons } from "@expo/vector-icons"
import { Vibration, TouchableOpacity } from "react-native";
import { saveNotificationPreference, getNotificationPreference } from "../../../utils/notificaciones/notificationsStorage"
import { useOrdersDashboard } from "@/hooks/home_functions/useOrdersDashboard";
import { useUser } from "@/hooks/redux/useUser"

const Home: React.FC = () => {
  const intl = useIntl()
  const { loading, ordersCount, dailyRevenue, refreshData, lastOrders } = useOrdersDashboard()
  const [refreshing, setRefreshing] = React.useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = React.useState<boolean>(false);

  const onRefresh = async () => {
    try {
      setRefreshing(true)
      await refreshData()
    } catch (error) {
      console.error(error)
    } finally {
      setRefreshing(false)
    }
  }

  React.useEffect(() => {
    const fetchPreference = async () => {
      const enabled = await getNotificationPreference()
      setNotificationsEnabled(enabled)
    }
    fetchPreference()
  }, []);

  const { user } = useUser();

  const empresaName = user?.empresaName ?? "Empresa Name";

  if (empresaName) {
    console.log("Nombre de la empresa:", empresaName);

  }


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
            <CustomText style={styles.businessName} accessibilityLabel="Nombre del negocio">
              {empresaName}
            </CustomText>
            <CustomText style={styles.dateText} accessibilityLabel="Fecha actual">
              <FormattedMessage
                id="currentDate"
                defaultMessage="{date, date, ::EEEE, d 'de' MMMM}"
                values={{
                  date: new Date(),
                }}
              />
            </CustomText>
          </View>
          <TouchableOpacity
            onPress={toggleNotifications}
            style={[
              styles.iconButton,
              notificationsEnabled && { backgroundColor: Colors.light.secondary, borderRadius: 50 },
            ]}
            accessibilityLabel="Toggle notificaciones"
          >
            <Ionicons
              name={notificationsEnabled ? "notifications" : "notifications-outline"}
              size={24}
              color={notificationsEnabled ? "white" : "white"} // el ícono será blanco sobre el fondo verde
            />
          </TouchableOpacity>

        </View>
      </Animated.View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.light.primary} style={styles.loader} />
      ) : (
        <>
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={true}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.light.primary} />
            }
          >
            <Animated.View entering={FadeInDown.delay(100)} style={styles.metricsContainer}>
              <MetricCard
                icon="cart-outline"
                title={intl.formatMessage({ id: "ordersToday.home", defaultMessage: "Peeeedidos Hoy" })}
                value={ordersCount.toString()}
                onPress={() => { }}
              />
              <MetricCard
                icon="account-group"
                title={intl.formatMessage({ id: "clients.home", defaultMessage: "Clientes" })}
                value="120"
                onPress={() => { }}
              />
              <MetricCard
                icon="cash-multiple"
                title={intl.formatMessage({ id: "revenue.home", defaultMessage: "Ingresos" })}
                value={`$${dailyRevenue}`}
                onPress={() => { }}
              />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(200)} style={styles.lastActivitiesContainer}>
              <CustomText style={styles.sectionTitle} accessibilityLabel="Últimos 3 pedidos">
                <FormattedMessage id="lastOrders.home" defaultMessage="Últimos 3 pedidos" />
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
                    onPress={() => { router.push({pathname:'/(tabs)/orderDetails', params: { orderId: order.id }} )}}
                  />
                ))
              ) : (
                <Animatable.View animation="fadeIn" style={styles.emptyStateContainer}>
                  <LottieView
                    source={
                      require("../../../constants/Animation-non-order.json")
                    }
                    autoPlay
                    loop
                    style={styles.emptyStateAnimation}
                  />
                  <Text style={styles.emptyStateTitle}>
                    <FormattedMessage id="noOrden.home" defaultMessage="No hay productos" />
                  </Text>
                </Animatable.View>
              )}

              <CustomText style={styles.sectionTitle}>
                <FormattedMessage id="quickActions.home" defaultMessage="Quick Actions" />
              </CustomText>
              <View style={styles.quickActionsGrid}>
                <QuickActionButton
                  icon="calendar"
                  title={intl.formatMessage({ id: "pedidos.home", defaultMessage: "Pedidos" })}
                  onPress={() => {
                    router.push("/(tabs)/pedidos")
                  }}
                />
                <QuickActionButton
                  icon="cog"
                  title={intl.formatMessage({ id: "settings.schedule", defaultMessage: "Settings" })}
                  onPress={() => {
                    router.push("/(tabs)/generalSettings")
                  }}
                />
              </View>
            </Animated.View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  )
}

export default Home

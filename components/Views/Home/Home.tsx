"use client"

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
import useOrdersData from "../../../hooks/home_functions/useOrdersData"
import LottieView from "lottie-react-native"
import { FormattedMessage } from "react-intl"
import * as Animatable from "react-native-animatable"
import { Ionicons } from "@expo/vector-icons"
import { Vibration, TouchableOpacity } from "react-native";
import { saveNotificationPreference, getNotificationPreference } from "../../../utils/notificaciones/notificationsStorage"
import { useUser } from "@/hooks/redux/useUser"

const Home: React.FC = () => {
  const { loading, ordersCount, dailyRevenue, refreshData, lastOrders } = useOrdersData()
  const [refreshing, setRefreshing] = React.useState(false)
  const deleteAnimationRef = useRef(null)
  const [notificationsEnabled, setNotificationsEnabled] = React.useState<boolean>(false);
  const prevOrdersCount = React.useRef<number>(ordersCount);

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
              {new Date().toLocaleDateString("es-AR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
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
              <MetricCard icon="cart-outline" title="Pedidos Hoy" value={ordersCount.toString()} onPress={() => { }} />
              <MetricCard icon="account-group" title="Clientes" value="120" onPress={() => { }} />
              <MetricCard icon="cash-multiple" title="Ingresos" value={`$${dailyRevenue}`} onPress={() => { }} />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200)} style={styles.lastActivitiesContainer}>
              <CustomText style={styles.sectionTitle} accessibilityLabel="Últimos 3 pedidos">
                Últimos 3 Pedidos
              </CustomText>
              {lastOrders.length > 0 ? (
                lastOrders.map((order) => (
                  <LastActivityCard
                    key={order.id}
                    title={`Pedido #${order.id}`}
                    time={order.time || "Desconocido"}
                    id={order.id?.toString() || "0"}
                    amount={order.amount || "$0"}
                    icon={order.icon || "receipt"}
                    address={order.address}
                    onPress={() => { }}
                  />
                ))
              ) : (
                <Animatable.View animation="fadeIn" style={styles.emptyStateContainer}>
                  <LottieView
                    source={
                      require("../../../constants/Animation-non-order.json") // Para sin productos
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

              <CustomText style={styles.sectionTitle}>Gestión Rápida</CustomText>
              <View style={styles.quickActionsGrid}>
                <QuickActionButton
                  icon="calendar"
                  title="Reservas"
                  onPress={() => {
                    router.push("/(tabs)/pedidos")
                  }}
                />
                <QuickActionButton
                  icon="cog"
                  title="Ajustes"
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

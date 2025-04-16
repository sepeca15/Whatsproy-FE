import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Colors } from "../../../constants/Colors";
import CustomText from "./components/CustomText";
import MetricCard from "./components/MetricCard";
import LastActivityCard from "./components/LastActivityCard";
import QuickActionButton from "./components/QuickActionButton";
import styles from "./HomeStyles";
import { removeData } from "@/storage/localStorage";
import { router, useRouter } from "expo-router";
import api from "@/services/api/admin";

const Home: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [lastOrders, setLastOrders] = useState<any[]>([]);

  const isFetching = useRef(false); // Controla las solicitudes en curso

  const getFormattedDate = (): string => new Date().toISOString().split("T")[0];

  const getTimeAgo = (date: string): string => {
    const now = new Date();
    const createdAt = new Date(date);
    const diffInSeconds = Math.floor(
      (now.getTime() - createdAt.getTime()) / 1000,
    );

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `hace ${days} día${days > 1 ? "s" : ""}`;
    if (hours > 0) return `hace ${hours} hora${hours > 1 ? "s" : ""}`;
    if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? "s" : ""}`;
    return "hace unos segundos";
  };

  const getOrders = useCallback(async () => {
    if (isFetching.current) return;
    try {
      isFetching.current = true;
      setLoading(true);
      const response = await api.order.lastThreeOrders();
      const formattedOrders = response.data.map((order: any) => {
        const timeAgo = getTimeAgo(order.createdAt);
        let costo = 0;
        try {
          const infoExtra = JSON.parse(order.infoLinesJson);
          costo = infoExtra.Costo || 0;
        } catch (error) {
          console.error("Error parsing infoLinesJson:", error);
        }

        return {
          id: order.id,
          time: timeAgo,
          amount: `$${costo}`,
          icon: "receipt",
        };
      });
      setLastOrders(formattedOrders);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  }, []);

  const getOrdersByDate = useCallback(async () => {
    if (isFetching.current) return;
    try {
      isFetching.current = true;
      const today = getFormattedDate();
      const response = await api.order.getOrdersByDate(today);
      if (!response || !response.ok) {
        console.error("Error en la API (ordersByDate):", response);
        return;
      }
      setOrdersCount(response.ordersDay || 0);
    } catch (error) {
      console.error("Error al obtener pedidos por fecha:", error);
    } finally {
      isFetching.current = false;
    }
  }, []);

  const moneyinday = useCallback(async () => {
    if (isFetching.current) return;
    try {
      isFetching.current = true;
      const today = getFormattedDate();
      const response = await api.order.moneyinday(today);
      if (!response || !response.ok) {
        console.error("Error en la API (moneyinday):", response);
        return;
      }
      setDailyRevenue(response.ganancia ?? 0);
    } catch (error) {
      console.error("Error al obtener ingresos del día:", error);
    } finally {
      isFetching.current = false;
    }
  }, []);

  const handleRefresh = async () => {
    if (isFetching.current) return;
    setRefreshing(true);
    await Promise.all([getOrders(), getOrdersByDate(), moneyinday()]);
    setRefreshing(false);
  };

  useEffect(() => {
    getOrders();
    getOrdersByDate();
    moneyinday();
  }, [getOrders, getOrdersByDate, moneyinday]);

  const logout = () => {
    Alert.alert("Logout", "You have been logged out.");
    removeData("token");
    router.push("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeIn} style={styles.header}>
        <View>
          <CustomText
            style={styles.businessName}
            accessibilityLabel="Nombre del negocio"
          >
            Mi Negocio
          </CustomText>
          <CustomText style={styles.dateText} accessibilityLabel="Fecha actual">
            {new Date().toLocaleDateString("es-AR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </CustomText>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.light.primary}
          />
        }
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.light.primary}
            style={styles.loader}
          />
        ) : (
          <>
            <Animated.View
              entering={FadeInDown.delay(100)}
              style={styles.metricsContainer}
            >
              <MetricCard
                icon="cart-outline"
                title="Pedidos Hoy"
                value={ordersCount.toString()}
                onPress={() => {}}
              />
              <MetricCard
                icon="account-group"
                title="Clientes"
                value="120"
                onPress={() => {}}
              />
              <MetricCard
                icon="cash-multiple"
                title="Ingresos"
                value={`$${dailyRevenue}`}
                onPress={() => {}}
              />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(200)}
              style={styles.lastActivitiesContainer}
            >
              <CustomText
                style={styles.sectionTitle}
                accessibilityLabel="Últimos 3 pedidos"
              >
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
                    address="Desconocido"
                    onPress={() => {}}
                  />
                ))
              ) : (
                <CustomText>No hay pedidos recientes</CustomText>
              )}

              <CustomText style={styles.sectionTitle}>
                Gestión Rápida
              </CustomText>
              <View style={styles.quickActionsGrid}>
                <QuickActionButton
                  icon="calendar"
                  title="Reservas"
                  onPress={() => {
                    router.push("/(tabs)/pedidos");
                  }}
                />
                <QuickActionButton
                  icon="cog"
                  title="Ajustes"
                  onPress={() => {
                    router.push("/(tabs)/generalSettings");
                  }}
                />
              </View>
            </Animated.View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

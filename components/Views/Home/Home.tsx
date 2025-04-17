import React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  Text, // Ensure Text is imported from react-native
} from "react-native";
import { Colors } from "../../../constants/Colors";
import CustomText from "./components/CustomText";
import MetricCard from "./components/MetricCard";
import LastActivityCard from "./components/LastActivityCard";
import QuickActionButton from "./components/QuickActionButton";
import styles from "./HomeStyles";
import { router } from "expo-router";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import useOrdersData from "../../../hooks/home_functions/useOrdersData";
import LottieView from "lottie-react-native";
import { useIntl, FormattedMessage } from "react-intl";
import * as Animatable from "react-native-animatable";




const Home: React.FC = () => {
  const { loading, ordersCount, dailyRevenue, refreshData, lastOrders } = useOrdersData();
  const [refreshing, setRefreshing] = React.useState(false);
  const deleteAnimationRef = useRef(null);
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
console.log("ordersCount");
  console.log("lassssssss", lastOrders);
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeIn.delay(100)} style={styles.header}>
        <View>
          <CustomText style={styles.dateText} accessibilityLabel="Fecha actual">
            {new Date().toLocaleDateString("es-AR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </CustomText>
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
                    address={order.address}
                    onPress={() => {}}
                  />
                ))
              ) : (
                <Animatable.View animation="fadeIn" style={styles.emptyStateContainer}>
                  <LottieView
                    source={require("../../../constants/Animation-non-order.json") // Para sin productos
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
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

export default Home;

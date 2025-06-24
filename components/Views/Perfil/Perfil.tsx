import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { HStack, VStack, Avatar, IconButton, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "./PerfilStyles";
import { FormattedMessage } from "react-intl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { profileData as defaultProfileData } from "./components/profileData";
import SalesOverview from "./components/SaleOverview/SalesOverview";
import CategorySales from "./components/CategorySales";
import api from "@/services/api/admin";
import { Colors } from "../../../constants/Colors";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import SalesChart from "./components/SalesChart";
import QuickActions from "./components/QuickActions";
import { useUser } from "@/hooks/redux/useUser";

const Perfil: React.FC = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const { user } = useUser();
  const currentPlan = user?.payment?.plan;

  const [salesPeriod, setSalesPeriod] = useState("mensual");
  const [profileData, setProfileData] = useState(defaultProfileData);
  const [periodSalesByCategory, setPeriodSalesByCategory] = useState<
    "lastDay" | "lastWeek" | "lastMonth"
  >("lastMonth");
  const [pedidos, setPedidos] = useState(0);
  const [salesOverview, setSalesOverview] = useState({
    average: 0,
    previous: 0,
    total: 0,
    variation: 0,
  });

  const [salesByCategory, setSalesByCategory] = useState<
    {
      categoryId: number;
      categoryName: string;
      totalVentas: number;
      porcentaje: number;
    }[]
  >([]);

  const [salesChart, setSalesChartResp] = useState({
    monthlySales: [],
    labels: [],
    period: "mensual",
  });

  const [resumenVentas, setResumenVentas] = useState<{
    weekly: number;
    monthly: number;
    quarterly: number;
    yearly: number;
  } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const isFetching = useRef(false);
  const [loading, setLoading] = useState(true);

  const [valorPrueba, setValorPrueba] = useState<{
    labels: string[];
    sales: number[];
  }>({
    labels: [],
    sales: [],
  });

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await api.perfil.getResumenVentas();
      const respSalesOverview = await api.order.getSalesOverview();
      const respSalesByCategory = await api.order.getSalesByCategory(
        periodSalesByCategory
      );
      const salesChartResp = await api.order.getSalesChart();
      setSalesChartResp(salesChartResp);
      setSalesByCategory(respSalesByCategory);
      setSalesOverview(respSalesOverview);
      setResumenVentas(res);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (isFetching.current) return;
    setRefreshing(true);
    isFetching.current = true;

    await Promise.all([fetchProfileData()]);

    setRefreshing(false);
    isFetching.current = false;
  };

  useEffect(() => {
    fetchProfileData();

    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
        router.push("/login");
      }
    };

    fetchUser();
  }, [periodSalesByCategory]);

  return (
    <View style={styles.container}>
      {/* Header simplificado pero mejorado */}
      <Animated.View style={styles.header}>
        <View style={styles.headerRow}>
          <HStack alignItems="center">
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <View style={styles.avatarContainer}>
                <Avatar
                  size="md"
                  source={{
                    uri: user?.image,
                  }}
                />
              </View>
            </TouchableOpacity>
            <VStack marginLeft={3}>
              <Text style={styles.name}>{user?.nombre || "Usuario"}</Text>
              <Text style={styles.plan}>
                <FormattedMessage id="plan" defaultMessage="Plan" />:{" "}
                {currentPlan?.nombre ?? "-"}
              </Text>
            </VStack>
          </HStack>
          <IconButton
            icon={
              <Icon
                as={Ionicons}
                name="settings-outline"
                size="md"
                color="white"
              />
            }
            onPress={() => {
              router.push("/(tabs)/config");
            }}
          />
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
            contentContainerStyle={[
              styles.contentContainer,
              { paddingBottom: 20 },
            ]} // no demasiado grande
            showsVerticalScrollIndicator={true}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={Colors.light.primary}
              />
            }
          >
            <View style={styles.contentContainer}>
              <Animated.View
                entering={FadeInDown.delay(100)}
                style={{ minHeight: 200 }}
              >
                <SalesOverview
                  previous={Number(salesOverview.previous ?? 0).toFixed(0) as any}
                  totalSales={Number(salesOverview?.total ?? 0).toFixed(0) as any}
                  previousPeriodSales={Number(salesOverview.variation ?? 0).toFixed(0) as any}
                  averageSale={Number(salesOverview.average ?? 0).toFixed(0) as any}
                  currency="$"
                  period={"mensual"}
                />
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(200)}>
                <SalesChart
                  monthlySales={salesChart?.monthlySales}
                  labels={salesChart?.labels}
                  period={salesChart?.period}
                  onPeriodChange={(value) => setSalesPeriod(value)}
                />
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(300)}>
                <CategorySales
                  filterType={periodSalesByCategory}
                  setFilterType={setPeriodSalesByCategory}
                  currency="$"
                  totalSales={Math.round(salesByCategory.reduce(
                    (acc, category) => acc + category.totalVentas,
                    0
                  ))}
                  categories={
                    salesByCategory.map((category, index) => {
                      return {
                        id: `${category.categoryId}`,
                        name: category.categoryName,
                        sales: Number(Math.round(category.totalVentas).toFixed(2)),
                        percentage: Number(Math.round(category.porcentaje).toFixed(2)),
                        color: Colors.light.primary,
                        icon: "cart-outline",
                      };
                    }) ?? []
                  }
                />
              </Animated.View>
              <Animated.View entering={FadeInDown.delay(500)}>
                <QuickActions />
              </Animated.View>
            </View>
          </ScrollView>
        </>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Avatar
                size="2xl"
                source={{
                  uri: user?.image,
                }}
                style={styles.largeAvatar}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Perfil;

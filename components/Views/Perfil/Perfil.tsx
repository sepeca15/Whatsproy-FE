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
import SalesOverview from "./components/SaleOverview/SalesOverview";
import CategorySales from "./components/CategorySales";
import { Colors } from "../../../constants/Colors";
import Animated, { FadeInDown } from "react-native-reanimated";
import SalesChart from "./components/SalesChart";
import QuickActions from "./components/QuickActions";
import { useUser } from "@/hooks/redux/useUser";
import { useSalesSlice } from "@/hooks/redux/useSalesSlice";

const Perfil: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [salesPeriod, setSalesPeriod] = useState("mensual");
  const [periodSalesByCategory, setPeriodSalesByCategory] = useState<
    "lastDay" | "lastWeek" | "lastMonth"
  >("lastMonth");

  const [refreshing, setRefreshing] = useState(false);
  const isFetching = useRef(false);
  const isInitialLoad = useRef(false);

  const router = useRouter();
  const { user } = useUser();
  const currentPlan = user?.payment?.plan;

  const {
    handleLoadData,
    loadingApi: loading,
    resumeSales,
    dataLoaded,
    salesByCategory,
    salesChart,
    salesOverview,
  } = useSalesSlice();

  const safeLoadData = async (period: "lastDay" | "lastWeek" | "lastMonth") => {
    if (isFetching.current) return;
    isFetching.current = true;
    await handleLoadData(period);
    isFetching.current = false;
  };

  const handleRefresh = async () => {
    if (isFetching.current) return;
    setRefreshing(true);
    console.log('traere 2');

    await safeLoadData(periodSalesByCategory);
    setRefreshing(false);
  };

  useEffect(() => {
    if (!isInitialLoad.current && !dataLoaded) {
      isInitialLoad.current = true;
      console.log("traere primera vez");
      safeLoadData(periodSalesByCategory);
    }
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) {
      console.log("traere por cambio de periodo");
      safeLoadData(periodSalesByCategory);
    }
  }, [periodSalesByCategory]);

  return (
    <View style={styles.container}>
      <Animated.View style={styles.header}>
        <View style={styles.headerRow}>
          <HStack alignItems="center">
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <View style={styles.avatarContainer}>
                <Avatar size="md" source={{ uri: user?.image }} />
              </View>
            </TouchableOpacity>
            <VStack marginLeft={3}>
              <Text allowFontScaling={false} style={styles.name}>{user?.nombre || "Usuario"}</Text>
              <Text allowFontScaling={false} style={styles.plan}>
                <FormattedMessage id="plan" defaultMessage="Plan" />:{" "}
                {currentPlan?.nombre ?? "-"}
              </Text>
            </VStack>
          </HStack>
          <IconButton
            icon={<Icon as={Ionicons} name="settings-outline" size="md" color="white" />}
            onPress={() => router.push("/(tabs)/config")}
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
        <ScrollView
          style={styles.content}
          contentContainerStyle={[styles.contentContainer, { paddingBottom: 20 }]}
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
            <Animated.View entering={FadeInDown.delay(100)} style={{ minHeight: 200 }}>
              <SalesOverview
                previous={parseInt(salesOverview?.previous ?? 0)}
                totalSales={parseInt(salesOverview?.total ?? 0)}
                previousPeriodSales={parseInt(salesOverview?.variation ?? 0)}
                averageSale={parseInt(salesOverview?.average ?? 0)}
                currency="$"
                period="mensual"
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200)}>
              <SalesChart
                monthlySales={salesChart?.monthlySales}
                labels={salesChart?.labels}
                period={salesChart?.period}
                onPeriodChange={setSalesPeriod}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300)}>
              <CategorySales
                filterType={periodSalesByCategory}
                setFilterType={setPeriodSalesByCategory}
                currency="$"
                totalSales={Math.round(
                  salesByCategory?.reduce((acc: number, cat: any) => acc + (cat?.totalVentas ?? 0), 0)
                )}
                categories={
                  salesByCategory?.map((category: any) => ({
                    id: `${category?.categoryId}`,
                    name: category?.categoryName,
                    sales: Math.round(category?.totalVentas).toFixed(2),
                    percentage: Math.round(category?.porcentaje).toFixed(2),
                    color: Colors.light.primary,
                    icon: "cart-outline",
                  })) ?? []
                }
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(500)}>
              <QuickActions />
            </Animated.View>
          </View>
        </ScrollView>
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
              <Avatar size="2xl" source={{ uri: user?.image }} style={styles.largeAvatar} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Perfil;

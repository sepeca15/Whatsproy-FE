import * as React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  RefreshControl,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons.js";
import OrdersFinished from "./components/OrdersFinished";
import OrdersPending from "./components/OrdersPending";
import { useUser } from "@/hooks/redux/useUser";
import CreateOrderModal from "@/components/CreateOrderModal";
import { FormattedMessage } from "react-intl"; // Importa FormattedMessage
import CustomText from "@/components/CustomText";
import Animated from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { useOrders } from "@/hooks/redux/useOrders";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import OrdersActive from "./components/OrdersActive";
import { globalStyles } from "@/components/globalStyles";

type pagesOrder = "finished" | "pending" | "active";

const PedidosEIngresos: React.FC = () => {
  const [selected, setSelected] = React.useState<pagesOrder>("pending");
  const [openAddModal, setOpenAddModal] = React.useState<boolean>(false);
  const {
    loadingApi,
    handleLoadOrdersFinished,
    handleLoadOrdersPending,
    handleLoadingOrdersActive,
  } = useOrders();

  const { user } = useUser();
  const handleSelectPage = (key: pagesOrder) => {
    setSelected(key);
  };
  const [refreshing, setRefreshing] = React.useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={globalStyles.header}>
        <View style={globalStyles.headerContent}>
          <View style={globalStyles.headerLeft}>
            <CustomText
              style={globalStyles.businessName}
              accessibilityLabel="Pedidos"
            >
              <FormattedMessage id="orders" />
            </CustomText>
          </View>
        </View>
      </Animated.View>

      <View style={styles.tab}>
        {["pending", "active", "finished"].map((key) => (
          <View key={key} style={styles.containerTabItem}>
            <Pressable
              onPress={() => handleSelectPage(key as pagesOrder)}
              style={styles.pressable}
              accessibilityRole="button"
            >
              <View style={styles.column}>
                <View style={styles.row}>
                  {key === "pending" ? (
                    <MaterialCommunityIcons size={16} name="camera-timer" />
                  ) : key === "finished" ? (
                    <Feather size={16} name="check-square" />
                  ) : (
                    <Feather name="activity" size={16} />
                  )}
                  <Text style={styles.text}>
                    {key === "pending" ? (
                      <FormattedMessage id="pending" defaultMessage="Pending" />
                    ) : key === "finished" ? (
                      <FormattedMessage
                        id="finished"
                        defaultMessage="Finished"
                      />
                    ) : (
                      <FormattedMessage
                        id="activeOrdersTitle"
                        defaultMessage="Active"
                      />
                    )}
                  </Text>
                </View>
                {selected === key && <View style={styles.selected} />}
              </View>
            </Pressable>
          </View>
        ))}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={true}
        style={styles.orders}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              try {
                setRefreshing(true);
                if (selected === "finished") {
                  await handleLoadOrdersFinished();
                } else if (selected === "active") {
                  await handleLoadingOrdersActive();
                } else {
                  await handleLoadOrdersPending();
                }
              } catch (error) {

              } finally {
                setRefreshing(false);
              }
            }}
            tintColor={Colors.light.primary}
          />
        }
      >
        {selected === "finished" ? (
          <OrdersFinished />
        ) : selected === "pending" ? (
          <OrdersPending />
        ) : (
          <OrdersActive />
        )}
      </ScrollView>
      <View style={globalStyles.buttonContainer}>
        <Pressable
          style={globalStyles.addButton}
          onPress={() => {
            setOpenAddModal((prevState) => !prevState);
          }}
        >
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>
      {openAddModal && (
        <CreateOrderModal
          tipoServicio={user.tipo_servicio}
          onClose={() => setOpenAddModal((prevState) => !prevState)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: Colors.light.primary,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  businessName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  container: {
    flex: 1,
  },
  chartWrapper: {
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
  },
  orders: {
    marginTop: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flex: 1,
  },
  Corders: {
    flex: 1,
    height: "100%",
    backgroundColor: "red",
  },
  tab: {
    marginVertical: 12,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "#d4ece8",
    borderBottomWidth: 4,
  },
  containerTabItem: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    flex: 1 / 2,
  },
  pressable: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    width: "60%",
    paddingVertical: 12,
  },
  selected: {
    height: 4,
    width: "100%",
    backgroundColor: "#075e54",
    position: "absolute",
    bottom: -16,
    borderRadius: 12,
  },
  text: {
    textAlign: "center",
  },
  column: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "semibold",
  },
});

export default PedidosEIngresos;

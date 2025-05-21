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
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import OrdersActive from "./components/OrdersActive";
import { globalStyles } from "@/components/globalStyles";
import { styles } from "./PedidosStyles";

type pagesOrder = "finished" | "pending" | "active";

const PedidosEIngresos: React.FC = () => {
  const [selected, setSelected] = React.useState<pagesOrder>("pending");
  const [openAddModal, setOpenAddModal] = React.useState<boolean>(false);

  const { user } = useUser();
  const handleSelectPage = (key: pagesOrder) => {
    setSelected(key);
  };
  

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
      <View
        style={styles.orders}
      >

        {selected === "finished" ? (
          <OrdersFinished />
        ) : selected === "pending" ? (
          <OrdersPending />
        ) : (
          <OrdersActive />
        )}

      </View>
      <View style={globalStyles.buttonContainer}>
        <Pressable
          style={globalStyles.addButton}
          onPress={() => {
            setOpenAddModal((prevState) => !prevState);
          }}
        >
          <Ionicons name="add" style={globalStyles.addtext} color="#fff" />
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



export default PedidosEIngresos;

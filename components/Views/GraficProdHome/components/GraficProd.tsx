"use client";

import type React from "react";
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { BarChart } from "react-native-chart-kit";
import { styles } from "./DetailsProdrodStyles";
import { FormattedMessage } from "react-intl";
import type { ProductDetailProps } from "./types";
import { useUser } from "@/hooks/redux/useUser";

const GraficProddet: React.FC<ProductDetailProps> = ({
  product,
  salesData,
  categoryData,
  satisfactionData,
}) => {
  const screenWidth = Dimensions.get("window").width;

  const [currentView, setCurrentView] = useState<"daily" | "month">("daily");

  const { user } = useUser();
  const currencies = user?.currencies;

  const currenctCurrency = currencies?.find(
    (itm: any) => itm?.id == product?.currency_id
  ) ?? {
    simbolo: "$",
    codigo: "USD",
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: currentView === "daily" ? 0.7 : 0.3,
    whilePercentage: 10,
    useShadowColorFromDataset: false,
  };

  const daydata =
    typeof product.daydata === "string"
      ? JSON.parse(product.daydata)
      : product.daydata;
  const monthdata =
    typeof product.monthdata === "string"
      ? JSON.parse(product.monthdata)
      : product.monthdata;

  const toggleView = () => {
    setCurrentView(currentView === "daily" ? "month" : "daily");
  };

  const data = {
    daily: {
      labels: daydata.labels.map((label: string) => label.toString()),
      datasets: [
        {
          data: daydata.datasets[0].data.map((value: number) => Number(value)),
        },
      ],
    },
    month: {
      labels: monthdata.labels.map((label: string) => label.toString()),
      datasets: [
        {
          data: monthdata.datasets[0].data.map((value: number) =>
            Number(value)
          ),
        },
      ],
    },
  };
  console.log("Disponible_View:", product.disponible);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <Image
          source={{
            uri:
              product.imageUrl && product?.imageUrl !== "../errorimage.png"
                ? product.imageUrl
                : "https://ebschool.net/images/default-image.jpg",
          }}
          style={styles.productImage}
        />

        {product.disponible === "true" ? (
          <View
            style={{
              ...styles.badge,
              backgroundColor: "#2E7D32",
            }}
          >
            <Text style={styles.badgeText}>
              {" "}
              <FormattedMessage id="available" />{" "}
            </Text>
          </View>
        ) : (
          <View
            style={{
              ...styles.badge,
              backgroundColor: "#7d2e2e",
            }}
          >
            <Text style={styles.badgeText}>
              {" "}
              <FormattedMessage id="notAvailable" />{" "}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.productName}>{product.title}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {currenctCurrency?.simbolo}
              {product.price}
            </Text>
            <Text style={styles.currency}>{currenctCurrency.codigo}</Text>
          </View>
          {/* Eliminada la sección de reseñas */}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              <FormattedMessage id="currency" />
            </Text>
            <Text style={styles.infoValue}>
              {currenctCurrency?.codigo}({currenctCurrency?.simbolo})
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              <FormattedMessage id="duration" />
            </Text>
            <Text style={styles.infoValue}>{product.duration}</Text>
          </View>
          <Text style={styles.descriptionTitle}>
            <FormattedMessage id="description" />
          </Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.deliveryOptionsContainer}>
            <Text style={styles.deliveryOptionsTitle}>
              <FormattedMessage
                id="deliveryOptions"
                defaultMessage="Opciones de entrega"
              />
            </Text>
            <View style={styles.deliveryOptionsRow}>
              <View
                style={[
                  styles.deliveryOptionCard,
                  product.envioADomicilio
                    ? styles.deliveryOptionCardActive
                    : styles.deliveryOptionCardInactive,
                ]}
              >
                <View style={styles.deliveryOptionIcon}>
                  <AntDesign
                    name="car"
                    size={24}
                    color={product.envioADomicilio ? "#1976d2" : "#999"}
                  />
                </View>
                <Text
                  style={[
                    styles.deliveryOptionText,
                    product.envioADomicilio
                      ? styles.deliveryOptionTextActive
                      : styles.deliveryOptionTextInactive,
                  ]}
                >
                  <FormattedMessage
                    id="homeDelivery"
                    defaultMessage="Envío a domicilio"
                  />
                </Text>
              </View>

              <View
                style={[
                  styles.deliveryOptionCard,
                  product.retiroEnSucursal
                    ? styles.deliveryOptionCardActive
                    : styles.deliveryOptionCardInactive,
                ]}
              >
                <View style={styles.deliveryOptionIcon}>
                  <AntDesign
                    name="home"
                    size={24}
                    color={product.retiroEnSucursal ? "#1976d2" : "#999"}
                  />
                </View>
                <Text
                  style={[
                    styles.deliveryOptionText,
                    product.retiroEnSucursal
                      ? styles.deliveryOptionTextActive
                      : styles.deliveryOptionTextInactive,
                  ]}
                >
                  <FormattedMessage
                    id="storePickup"
                    defaultMessage="Retiro en sucursal"
                  />
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.tagContainer}>
            {product.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default GraficProddet;

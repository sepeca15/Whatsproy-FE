import React, { useState } from "react";
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
import { styles } from "./SalesChartsStyles";
import { FormattedMessage } from "react-intl"; // Importa FormattedMessage
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
    (itm: any) => itm?.id == product?.currency_id,
  ) ?? { simbolo: "$", codigo: "USD" };

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
            Number(value),
          ),
        },
      ],
    },
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
        <View style={{
          ...styles.badge,
          backgroundColor: product?.disponible ? "#2E7D32" : "#7d2e2e"
        }}>
          <Text style={styles.badgeText}>{product.disponible ? <FormattedMessage  id="available"/> : <FormattedMessage  id="notAvailable"/>}</Text>
        </View>
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
          <View style={styles.ratingContainer}>
            <AntDesign name="star" size={20} color="#FFD700" />
            <Text style={styles.ratingText}>
              ({product.reviews} <FormattedMessage id="reviews" />)
            </Text>
          </View>
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
        {/* <View style={styles.infoRow}>
            <Text style={styles.infoLabel}><FormattedMessage id="category" /></Text>
            <Text style={styles.infoValue}>{product.category}</Text>
          </View>  */}
          <Text style={styles.descriptionTitle}>
            <FormattedMessage id="description" />
          </Text>
          <Text style={styles.description}>{product.description}</Text>
          <View style={styles.tagContainer}>
            {product.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>
              <FormattedMessage id="sales" />
            </Text>
            <TouchableOpacity onPress={toggleView} style={styles.toggleButton}>
              <Text style={styles.toggleButtonText}>
                {currentView === "daily" ? (
                  <FormattedMessage id="viewMonthly" />
                ) : (
                  <FormattedMessage id="viewDaily" />
                )}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chartWrapperContainer}>
            <View style={styles.chartWrapper}>
              <BarChart
                data={data[currentView]}
                width={screenWidth - 60}
                height={220}
                yAxisLabel=""
                yAxisSuffix=" "
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                showValuesOnTopOfBars={true}
                fromZero={true}
                style={styles.chart}
              />
            </View>
          </View>
          <View style={styles.additionalInfo}>
            <Text style={styles.additionalInfoTitle}>
              <FormattedMessage id="additionalInfo" />
            </Text>
            <View style={styles.additionalInfoRow}>
              <Text style={styles.additionalInfoLabel}>
                <FormattedMessage id="totalSales" />:
              </Text>
              <Text style={styles.additionalInfoValue}>
                {data[currentView].datasets[0].data.reduce(
                  (a: number, b: number) => a + b,
                  0,
                )}
              </Text>
            </View>
            <View style={styles.additionalInfoRow}>
              <Text style={styles.additionalInfoLabel}>
                {currentView === "daily" ? (
                  <FormattedMessage id="dailyAverage" />
                ) : (
                  <FormattedMessage id="monthlyAverage" />
                )}
                :
              </Text>
              <Text style={styles.additionalInfoValue}>
                {(
                  data[currentView].datasets[0].data.reduce(
                    (a: number, b: number) => a + b,
                    0,
                  ) / data[currentView].labels.length
                ).toFixed(2)}
              </Text>
            </View>
            <View style={styles.additionalInfoRow}>
              <Text style={styles.additionalInfoLabel}>
                {currentView === "daily" ? (
                  <FormattedMessage id="bestSellingDay" />
                ) : (
                  <FormattedMessage id="bestSellingMonth" />
                )}
                :
              </Text>
              <Text style={styles.additionalInfoValue}>
                {
                  data[currentView].labels[
                    data[currentView].datasets[0].data.indexOf(
                      Math.max(...data[currentView].datasets[0].data),
                    )
                  ]
                }
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{satisfactionData.data[0]}%</Text>
            <Text style={styles.statLabel}>
              <FormattedMessage id="satisfaction" />
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>127</Text>
            <Text style={styles.statLabel}>
              <FormattedMessage id="sales" />
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{product.rating}</Text>
            <Text style={styles.statLabel}>
              <FormattedMessage id="rating" />
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default GraficProddet;

import React from "react";
import { View, Text, ScrollView, Image, Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { BarChart } from "react-native-chart-kit";
import { styles } from "./SalesChartsStyles";
import type { ProductDetailProps } from "./types";
import { border } from "native-base/lib/typescript/theme/styled-system";

const GraficProddet: React.FC<ProductDetailProps> = ({ product, salesData, categoryData, satisfactionData }) => {
  const screenWidth = Dimensions.get("window").width;

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    whilePercentage: 10,
    useShadowColorFromDataset: false,
   
  };

  // Parsear daydata
  const daydata = typeof product.daydata === 'string' ? JSON.parse(product.daydata) : product.daydata;




  const data = {
    labels: daydata.labels.map((label: string) => label.toString()),
    datasets: [
      {
        data: daydata.datasets[0].data.map((value: number) => Number(value)),
      },
    ],
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{product.category}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.productName}>{product.title}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{product.price}</Text>
            <Text style={styles.currency}>{product.currency}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <AntDesign name="star" size={20} color="#FFD700" />
            <Text style={styles.ratingText}>({product.reviews} reseñas)</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Duración</Text>
            <Text style={styles.infoValue}>{product.duration}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Categoría</Text>
            <Text style={styles.infoValue}>{product.category}</Text>
          </View>
          <Text style={styles.descriptionTitle}>Descripción</Text>
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
          <Text style={styles.chartTitle}>Ventas</Text>
            <View style={[styles.chartWrapper]}>
            <BarChart
              data={data}
              width={screenWidth - 55}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              showValuesOnTopOfBars={true}
              fromZero={true}
              style={styles.chart}
            />
            </View>
          <View style={styles.additionalInfo}>
            <Text style={styles.additionalInfoTitle}>Información adicional</Text>
            <View style={styles.additionalInfoRow}>
              <Text style={styles.additionalInfoLabel}>Total de ventas:</Text>
              <Text style={styles.additionalInfoValue}>{data.datasets[0].data.reduce((a: number, b: number) => a + b, 0)}</Text>
            </View>
            <View style={styles.additionalInfoRow}>
              <Text style={styles.additionalInfoLabel}>Promedio diario:</Text>
              <Text style={styles.additionalInfoValue}>
                {(data.datasets[0].data.reduce((a: number, b: number) => a + b, 0) / 7).toFixed(2)}
              </Text>
            </View>
            <View style={styles.additionalInfoRow}>
              <Text style={styles.additionalInfoLabel}>Día más vendido:</Text>
              <Text style={styles.additionalInfoValue}>
                {data.labels[data.datasets[0].data.indexOf(Math.max(...data.datasets[0].data))]}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{satisfactionData.data[0]}%</Text>
            <Text style={styles.statLabel}>Satisfacción</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>127</Text>
            <Text style={styles.statLabel}>Ventas</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{product.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default GraficProddet;
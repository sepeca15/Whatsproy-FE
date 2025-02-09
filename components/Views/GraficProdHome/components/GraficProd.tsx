import type React from "react"
import { useState } from "react"
import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import { BarChart } from "react-native-chart-kit"
import { styles } from "./SalesChartsStyles"
import type { ProductDetailProps } from "./types"
import { border, position } from "native-base/lib/typescript/theme/styled-system"

const GraficProddet: React.FC<ProductDetailProps> = ({ product, salesData, categoryData, satisfactionData }) => {
  const screenWidth = Dimensions.get("window").width

  const [currentView, setCurrentView] = useState<"daily" | "month">("daily")

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: currentView === "daily" ? 0.7 : 0.3, 
    whilePercentage: 10,
    useShadowColorFromDataset: false,
   
    
  }

  // Parsear daydata
  const daydata = typeof product.daydata === "string" ? JSON.parse(product.daydata) : product.daydata
  //Parsear monthdata
  const monthdata = typeof product.monthdata === "string" ? JSON.parse(product.monthdata) : product.monthdata

  const toggleView = () => {
    setCurrentView(currentView === "daily" ? "month" : "daily")
  }

  console.log('product', monthdata)

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
          data: monthdata.datasets[0].data.map((value: number) => Number(value)),
        },
      ],
    },
  }

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
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Ventas</Text>
            <TouchableOpacity onPress={toggleView} style={styles.toggleButton}>
              <Text style={styles.toggleButtonText}>{currentView === "daily" ? "Ver mansual" : "Ver diario"}</Text>
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
            <Text style={styles.additionalInfoTitle}>Información adicional</Text>
            <View style={styles.additionalInfoRow}>
              <Text style={styles.additionalInfoLabel}>Total de ventas:</Text>
              <Text style={styles.additionalInfoValue}>
                {data[currentView].datasets[0].data.reduce((a: number, b: number) => a + b, 0)}
              </Text>
            </View>
            <View style={styles.additionalInfoRow}>
              <Text style={styles.additionalInfoLabel}>
                {currentView === "daily" ? "Promedio diario:" : "Promedio mensual:"}
              </Text>
              <Text style={styles.additionalInfoValue}>
                {(
                  data[currentView].datasets[0].data.reduce((a: number, b: number) => a + b, 0) /
                  data[currentView].labels.length
                ).toFixed(2)}
              </Text>
            </View>
            <View style={styles.additionalInfoRow}>
              <Text style={styles.additionalInfoLabel}>
                {currentView === "daily" ? "Día más vendido:" : "Mes más vendido:"}
              </Text>
              <Text style={styles.additionalInfoValue}>
                {
                  data[currentView].labels[
                    data[currentView].datasets[0].data.indexOf(Math.max(...data[currentView].datasets[0].data))
                  ]
                }
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
  )
}

export default GraficProddet


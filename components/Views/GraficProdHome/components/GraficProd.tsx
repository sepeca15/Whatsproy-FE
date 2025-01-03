import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import {
  LineChart,
  PieChart,
  ProgressChart,
} from 'react-native-chart-kit';
import { styles } from './SalesChartsStyles';
import { ProductDetailProps } from './types';

const GraficProddet: React.FC<ProductDetailProps> = ({
  product,
  salesData,
  categoryData,
  satisfactionData
}) => {
  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const pieChartData = categoryData.labels.map((label, index) => ({
    name: label,
    population: categoryData.datasets[0].data[index],
    color: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},1)`,
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  const satisfactionPercentage = satisfactionData.data[0] / 100;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.productImage}
        />
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
          <Text style={styles.chartTitle}>Ventas Diarias</Text>
          <LineChart
            data={salesData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Ventas por Categoría</Text>
          <PieChart
            data={pieChartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Satisfacción del Cliente</Text>
          <ProgressChart
            data={[satisfactionPercentage]}
            width={screenWidth - 40}
            height={220}
            strokeWidth={16}
            radius={32}
            chartConfig={chartConfig}
            hideLegend={false}
          />
          <Text style={styles.satisfactionText}>{satisfactionData.data[0]}% Satisfecho</Text>
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

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default GraficProddet;


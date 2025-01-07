import React, { useState } from 'react';
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
  const [salesView, setSalesView] = useState<'week' | 'month'>('week');
  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

 


  // Datos de ejemplo para ventas semanales y mensuales
  const weeklySalesData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [{ data: [20, 45, 28, 80, 99, 43, 50] }]
  };

  const monthlySalesData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [{ data: [300, 450, 280, 800, 990, 430, 500, 600, 700, 500, 600, 800] }]
  };

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
          <Text style={styles.chartTitle}>Ventas</Text>
          <View style={styles.salesButtonContainer}>
            <TouchableOpacity
              style={[styles.salesButton, salesView === 'week' && styles.salesButtonActive]}
              onPress={() => setSalesView('week')}
            >
              <Text style={[styles.salesButtonText, salesView === 'week' && styles.salesButtonTextActive]}>Dia</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.salesButton, salesView === 'month' && styles.salesButtonActive]}
              onPress={() => setSalesView('month')}
            >
              <Text style={[styles.salesButtonText, salesView === 'month' && styles.salesButtonTextActive]}>Mes</Text>
            </TouchableOpacity>
          </View>
          <LineChart
            data={salesView === 'week' ? weeklySalesData : monthlySalesData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
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


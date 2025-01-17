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
} from 'react-native-chart-kit';
import { styles } from './SalesChartsStyles';
import { ProductDetailProps } from './types';
import { weeklySalesData, monthlySalesData } from '../../../../hooks/dataProduct';

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

  const data = salesView === 'week' ? weeklySalesData : monthlySalesData;

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
            data={data}
            width={screenWidth - 20} // Ajustar el ancho de la gráfica
            height={260} // Ajustar la altura de la gráfica
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            decorator={() => {
              return data.datasets[0].data.map((value, index) => {
                const x = (index * (screenWidth - 40) / (data.datasets[0].data.length - 1));
                const y = 260 - (value / Math.max(...data.datasets[0].data)) * 260;
                return (
                  <View key={index} style={{ position: 'absolute', top: y - 15, left: x - 15 }}>
                    <Text style={{ fontSize: 10, color: '#000' }}>{value}</Text>
                  </View>
                );
              });
            }}
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
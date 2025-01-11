import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';
import { styles } from './CardProduct/CardProdStyle';
import { Product, ProductBDD, SatisfactionData, CategoryData, SalesData, WeeklySalesData, MonthlySalesData } from '../../../../hooks/dataProduct';

interface ProductCardProps {
  productBDD: ProductBDD;
  product: Product;
  salesData: SalesData;
  categoryData: CategoryData;
  satisfactionData: SatisfactionData;
  monthlySalesData: MonthlySalesData;
  weeklySalesData: WeeklySalesData;
  onUpdateProduct: (updatedProduct: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  salesData,
  productBDD,
  categoryData,
  satisfactionData,
  monthlySalesData,
  weeklySalesData,
  onUpdateProduct
}) => {
  const router = useRouter();

  const commonParams = {
    id: productBDD.id,
    title: productBDD.nombre,
    price: productBDD.precio.toString(),
    currency: product.currency,
    duration: productBDD.plazoDuracionEstimadoMinutos.toString(),
    description: productBDD.descripcion,
    imageUrl: product.imageUrl,
    disponible: productBDD.disponible.toString(), 
    empresa_id: productBDD.empresa_id.toString(), 
  };

  const handleEdit = () => {
    if (!product) {
      console.error('Product is undefined');
      return;
    }
    router.push({
      pathname: '/(tabs)/editprod',
      params: { ...commonParams },
    });
  };

  const handleDet = () => {
    if (!product) {
      console.error('Product is undefined');
      return;
    }
    router.push({
      pathname: '/(tabs)/graficprodhom',
      params: {
        ...commonParams,
        category: product.category,
        rating: product.rating.toString(), 
        reviews: product.reviews.toString(),
        tags: product.tags.join(','), 
        monthlabels: monthlySalesData.labels,
        monthdatasets: JSON.stringify(monthlySalesData.datasets),
        dayslabels: weeklySalesData.labels,
        daysdatasets: JSON.stringify(weeklySalesData.datasets),
        disponible: productBDD.disponible.toString(), 
        empresa_id: productBDD.empresa_id.toString(), 
      },
    });
  };

  if (!product) {
    return null;
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={handleDet} style={styles.imageContainer}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{productBDD.nombre}</Text>
          <TouchableOpacity onPress={handleEdit} style={styles.shareButton}>
            <Icon name="edit" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <Text style={styles.price}>Precio: ${productBDD.precio}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {productBDD.descripcion}
        </Text>
      </View>
    </View>
  );
};

export default ProductCard;
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';
import { styles } from './CardProduct/CardProdStyle';
import { Product, SatisfactionData,ProductBDD, CategoryData, SalesData, WeeklySalesData, MonthlySalesData } from '../../../../hooks/dataProduct';

interface ProductCardProps {
    product: Product;
    productBDD: ProductBDD;
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
        id: productBDD.id.toString(),
        title: productBDD.nombre,
        price: productBDD.precio.toString(),
        currency: product.currency,
        duration: productBDD.plazoDuracionEstimadoMinutos.toString(),
        description: productBDD.descripcion,
        imageUrl: product.imageUrl,
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
            return;
        }
        router.push({
            pathname: '/(tabs)/graficprodhom',
            params: {
                ...commonParams,
                category: product.category,
                rating: product.rating,
                reviews: product.reviews,
                tags: product.tags,
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
        <TouchableOpacity style={styles.card} onPress={handleDet}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: product.imageUrl }}
                    style={styles.image}
                />
            </View>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.titlePriceContainer}>
                        <Text style={styles.title} numberOfLines={1}>{productBDD.nombre}</Text>
                        <Text style={styles.price}>${productBDD.precio.toFixed(2)} {product.currency}</Text>
                    </View>
                    <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                        <Icon name="edit-2" size={16} color="#666" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.description} numberOfLines={2}>{productBDD.descripcion}</Text>
                <View style={styles.footer}>
                    <Text style={styles.category} numberOfLines={1}>{product.category}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ProductCard;


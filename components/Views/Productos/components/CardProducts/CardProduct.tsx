import React, { useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';
import { styles } from './CardProdStyle';
import { Product, SatisfactionData, ProductBDD, CategoryData, SalesData, DayslySalesData, MonthlySalesData } from '../../../../../hooks/dataProduct';

interface ProductCardProps {
    product: Product;
    productBDD: ProductBDD;
    salesData: SalesData;
    categoryData: CategoryData;
    satisfactionData: SatisfactionData;
    monthlySalesData: MonthlySalesData;
    dayslySalesData: DayslySalesData;
    onUpdateProduct: (updatedProduct: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    salesData,
    productBDD,
    categoryData,
    satisfactionData,
    monthlySalesData,
    dayslySalesData,
    onUpdateProduct
}) => {
    const router = useRouter();
    const scale = useRef(new Animated.Value(1)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const pressTimeout = useRef<NodeJS.Timeout | null>(null);

    const handlePressIn = () => {
        pressTimeout.current = setTimeout(() => {
            Animated.parallel([
                Animated.spring(scale, {
                    toValue: 0.95,
                    useNativeDriver: true,
                }),
                Animated.timing(translateX, {
                    toValue: -300,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                // Acción después de que la animación se complete
                console.log('Tarjeta deslizada y encogida');
            });
        }, 2000); // 2 segundos
    };

    const handlePressOut = () => {
        if (pressTimeout.current) {
            clearTimeout(pressTimeout.current);
        }
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

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
            params: {
                ...commonParams,
                disponible: productBDD.disponible.toString(),
                empresa_id: productBDD.empresa_id,
            },
        });
    };

    const handleDet = () => {
        if (!product) {
            return;
        }
        router.push({
            pathname: '/(tabs)/graficprod',
            params: {
                ...commonParams,
                category: product.category,
                rating: product.rating,
                reviews: product.reviews,
                tags: product.tags,
                daydata: JSON.stringify(dayslySalesData),
                monthdata: JSON.stringify(monthlySalesData),
                disponible: productBDD.disponible.toString(),
                empresa_id: productBDD.empresa_id.toString(),
            },
        });
    };

    if (!product) {
        return null;
    }

    return (
        <Animated.View
            style={[
                styles.containerFatehr,
                { transform: [{ scale }, { translateX }] }
            ]}
        >
            <Pressable
                style={({ pressed }) => [
                    styles.containerFatehr,
                    { opacity: pressed ? 0.8 : 1 }
                ]}
                onPress={handleDet}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                {product.category === 'Vegetariana' && (
                    <View style={styles.categoryLabel}>
                        <Text style={styles.categoryText}>{product.category}</Text>
                    </View>
                )}

                <View style={styles.card}>
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
                        <Text style={styles.description} numberOfLines={3}>{productBDD.descripcion}</Text>
                    </View>
                </View>
            </Pressable>
        </Animated.View>
    );
};

export default ProductCard;
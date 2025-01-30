import React, { useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, Animated, PanResponder } from 'react-native';
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
    setIsDragging: (isDragging: boolean) => void;
    checkIfOverTrash: (gestureState: any) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    salesData,
    productBDD,
    categoryData,
    satisfactionData,
    monthlySalesData,
    dayslySalesData,
    onUpdateProduct,
    setIsDragging,
    checkIfOverTrash
}) => {
    const router = useRouter();
    const pan = useRef(new Animated.ValueXY()).current;
    const pressTimeout = useRef<NodeJS.Timeout | null>(null);
    const isLongPress = useRef(false);
    const hasMoved = useRef(false);
    const lastTap = useRef<number | null>(null);
    const zIndex = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false, // No responder al inicio del gesto
            onMoveShouldSetPanResponder: () => isLongPress.current, // Responder al movimiento solo si es una presión prolongada
            onPanResponderGrant: () => {
                setIsDragging(true);
                Animated.timing(zIndex, {
                    toValue: 1,
                    duration: 0,
                    useNativeDriver: false,
                }).start();
            },
            onPanResponderMove: (e, gestureState) => {
                if (Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10) {
                    hasMoved.current = true; // Marcar como desplazamiento si se mueve más de 10 píxeles
                }
                checkIfOverTrash(gestureState);
                Animated.event(
                    [null, { dx: pan.x, dy: pan.y }],
                    { useNativeDriver: false }
                )(e, gestureState);
            },
            onPanResponderRelease: () => {
                setIsDragging(false);
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                }).start();
                Animated.timing(zIndex, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: false,
                }).start();
                isLongPress.current = false;
                hasMoved.current = false;
            },
        })
    ).current;

    const handlePressIn = () => {
        isLongPress.current = false;
        hasMoved.current = false;
        pressTimeout.current = setTimeout(() => {
            isLongPress.current = true; // Marcar como presión prolongada después de 0.5 segundos
        }, 500); // 0.5 segundos
    };

    const handlePressOut = () => {
        if (pressTimeout.current) {
            clearTimeout(pressTimeout.current); // Cancelar el temporizador si se suelta antes de 0.5 segundos
        }
    };

    const handleDoubleTap = () => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;
        if (lastTap.current && (now - lastTap.current) < DOUBLE_PRESS_DELAY) {
            handleDet(); // Ejecutar la función de doble toque
        } else {
            lastTap.current = now;
        }
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
                { transform: [{ translateX: pan.x }, { translateY: pan.y }], zIndex }
            ]}
            {...panResponder.panHandlers}
        >
            <Pressable
                style={({ pressed }) => [
                    styles.containerFatehr,
                    { opacity: pressed ? 0.8 : 1 }
                ]}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handleDoubleTap}
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
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';
import { styles } from '@/components/Views/Productos/components/CardProduct/CardProdStyle';
import { Product } from '@/components/Views/Productos/components/dataProduct';

interface ProductCardProps {
    product: Product;
    onUpdateProduct: (updatedProduct: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onUpdateProduct
}) => {
    const router = useRouter();

    const handleEdit = () => {
        if (!product) {
            console.error('Product is undefined');
            return;
        }
        const params = {
            id: product.id,
            name: product.title,
            price: product.price.toString(),
            currency: 'USD',
            duration: '15mn',
            description: product.description,
            image: product.imageUrl,
        };
        router.push({
            pathname: '/(tabs)/editprod',
            params: params,
        });
    };

    if (!product) {
        return null; // or return some fallback UI
    }

    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: product.imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{product.title}</Text>
                    <TouchableOpacity onPress={handleEdit} style={styles.shareButton}>
                        <Icon name="edit" size={20} color="#666" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.price}>Precio: ${product.price}</Text>
                <Text style={styles.description} numberOfLines={2}>{product.description}</Text>
            </View>
        </View>
    );
};

export default ProductCard;
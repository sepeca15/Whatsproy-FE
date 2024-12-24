import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';
import { styles } from './CardProdStyle';

interface ProductCardProps {
    title: string;
    price: number;
    description: string;
    imageUrl: string;
    onShare?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    title,
    price,
    description,
    imageUrl,
    onShare
}) => {
    const router = useRouter();

    const handleEdit = () => {
        const params = {
            name: title,
            price: price.toString(),
            currency: 'USD',
            duration: '15mn',
            description: description,
            image: imageUrl,
        };
        
        router.push({
            pathname: '/(tabs)/editprod',
            params: params,
        });
    };

    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                    <TouchableOpacity onPress={handleEdit} style={styles.shareButton}>
                        <Icon name="edit" size={20} color="#666" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.price}>Precio: ${price}</Text>
                <Text style={styles.description} numberOfLines={2}>{description}</Text>
            </View>
        </View>
    );
};

export default ProductCard;
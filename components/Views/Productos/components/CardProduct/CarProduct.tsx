import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';
import { styles } from './CardProdStyle';
import { Product, SatisfactionData, CategoryData, SalesData, WeeklySalesData, MonthlySalesData } from './dataProduct';
import { salesData } from '@/components/Views/GraficProdHome/components/Data';


interface ProductCardProps {
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
    categoryData,
    satisfactionData,
    monthlySalesData,
    weeklySalesData,
    onUpdateProduct
}) => {
    const router = useRouter();

   
       

    // console.log("monthdata", monthlySalesData)    
    const commonParams = {
        id: product.id,
        title: product.title,
        price: product.price.toString(),
        currency: product.currency,
        duration: product.duration,
        description: product.description,
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
        console.log('Edit Params:', commonParams);
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
                rating: product.rating,
                reviews: product.reviews,
                tags: product.tags,
                monthlabels: monthlySalesData.labels,
                monthdatasets: JSON.stringify(monthlySalesData.datasets),
                dayslabels: weeklySalesData.labels,
                daysdatasets: JSON.stringify(weeklySalesData.datasets),
            },
        });
        // console.log('Detail Params:', {
        //     // monthlabels: monthlySalesData.labels,
        //     monthdatasets: monthlySalesData.datasets,
        // });
        //  console.log('Monthdatasets Data:', monthlySalesData.datasets.map(dataset => dataset.data));

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
                    <Text style={styles.title}>{product.title}</Text>
                    <TouchableOpacity onPress={handleEdit} style={styles.shareButton}>
                        <Icon name="edit" size={20} color="#666" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.price}>Precio: ${product.price}</Text>
                <Text style={styles.description} numberOfLines={2}>
                    {product.description}
                </Text>
            </View>
        </View>
    );
};

export default ProductCard;
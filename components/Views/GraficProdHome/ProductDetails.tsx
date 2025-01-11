import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import GraficProddet from './components/GraficProd';
import { productData, salesData, categoryData, satisfactionData } from '../GraficProdHome/components/Data';
import{ProductParams} from './components/types';



const ProductDetails: React.FC = () => {
  // Tipifica los parámetros recibidos
  const rawParams = useLocalSearchParams(); 
  const params = rawParams as unknown as ProductParams;
console.log('params', params)
  const monthdatasets = params.monthdatasets ? JSON.parse(params.monthdatasets) : [];
 
  const daysdatasets = params.daysdatasets ? JSON.parse(params.daysdatasets) : [];

  console.log (params.daysdatasets)
  // Construye el objeto `product`
  const product = {
    id: parseInt(params.id, 10),
    title: params.title,
    price: parseFloat(params.price),
    currency: params.currency,
    duration: params.duration,
    description: params.description,
    imageUrl: params.imageUrl,
    category: params.category,
    rating: parseFloat(params.rating),
    reviews: parseInt(params.reviews, 10),
    tags: params.tags ? params.tags.split(',') : [],
    monthlabels: params.monthlabels,
    monthdatasets,
    dayslabels: params.dayslabels,
    daysdatasets,
    empresa_id: parseInt(params.empresa_id, 10),
    disponible: params.disponible === 'true',
  };

  console.log('Processed Product:', product);

  return (
    <GraficProddet
      product={product}
      salesData={salesData}
      categoryData={categoryData}
      satisfactionData={satisfactionData}
    />
  );
};

export default ProductDetails;

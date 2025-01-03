import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import GraficProddet from './components/GraficProd';
import { productData, salesData, categoryData, satisfactionData  } from '../GraficProdHome/components/Data';
interface ProductDetailProps {
  product: {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
    labels: string[];
    datasets: {
      data: number[];
    }[];
    currency: string;
    duration: string;
    rating: number;
    reviews: number;
    tags: string[];
  };
  salesData: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
  categoryData: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
  satisfactionData: {
    data: number[];
  };
}

const ProductDetails: React.FC = () => {
  const params = useLocalSearchParams();
  console.log('Params:', params);

  const product = {
    id: parseInt(params.id as string, 10),
    title: params.title as string,
    price: parseFloat(params.price as string),
    currency: params.currency as string,
    duration: params.duration as string,
    description: params.description as string,
    imageUrl: params.imageUrl as string,
    category: params.category as string,
    rating: parseFloat(params.rating as string),
    reviews: parseInt(params.reviews as string, 10),
    tags: params.tags ? (params.tags as string).split(',') : [],
  };
  console.log('ProductosDetalle:', product);


  
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
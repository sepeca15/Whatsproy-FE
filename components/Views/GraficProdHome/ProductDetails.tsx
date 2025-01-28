import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import GraficProddet from './components/GraficProd';
import { productData, salesData, categoryData, satisfactionData } from '../GraficProdHome/components/Data';
import { ProductParams } from '../GraficProdHome/components/types';



const ProductDetails: React.FC = () => {
  // Tipifica los parámetros recibidos
  const rawParams = useLocalSearchParams();
  const params = rawParams as unknown as ProductParams;
  // console.log('params', params)
  // const monthdatasets = params.monthdatasets ? JSON.parse(params.monthdatasets) : [];
  // const simpleMonthData = monthdatasets.map((dataset: { data: number[] }) => dataset.data).flat();

  // const daysdatasets = params.daysdatasets ? JSON.parse(params.daysdatasets) : [];
  // const simpleDaysData = daysdatasets.map((dataset: { data: number[] }) => dataset.data).flat();

  // const day_data = {
  //   labels: params.dayslabels,
  //   datasets: [
  //     {
  //       data: simpleDaysData,
  //     },
  //   ],
  // };

  // const month_data = {
  //   labels: params.monthlabels,
  //   datasets: [
  //     {
  //       data: simpleMonthData,
  //     },
  //   ],
  // };

  console.log('paramssss', params.daydata)


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
    daydata: params.daydata,
    monthdata: params.monthdata,
    empresa_id: parseInt(params.empresa_id, 10),
    disponible: params.disponible === 'true',
  };

  console.log('monthdata :', product.monthdata);

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

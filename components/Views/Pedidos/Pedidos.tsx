import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import PedidosRealizados from './components/PedidosRealizados';
// import IngresosMensuales from './components/IngresosMensuales';
import DistribucionPedidos from './components/Ventasporcategorias';
import TendenciaVentas from './components/TendenciaVentas';

const PedidosEIngresos: React.FC = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.chartWrapper}>
                <PedidosRealizados />
            </View>
            <View style={styles.chartWrapper}>
              
                <TendenciaVentas />
            </View>
          
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    chartWrapper: {
        marginBottom: 20,
    },
});

export default PedidosEIngresos;
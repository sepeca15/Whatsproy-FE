import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-svg-charts';

const Ventasporcategorias: React.FC = () => {
    const data = [
        {
            key: 1,
            value: 50,
            svg: { fill: '#600080' },
            arc: { outerRadius: '130%', cornerRadius: 10 },
        },
        {
            key: 2,
            value: 30,
            svg: { fill: '#9900cc' },
        },
        {
            key: 3,
            value: 20,
            svg: { fill: '#c61aff' },
        },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Distribución de Pedidos</Text>
            <PieChart style={styles.chart} data={data} />
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#600080' }]} />
                    <Text>Completados (50%)</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#9900cc' }]} />
                    <Text>En Proceso (30%)</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#c61aff' }]} />
                    <Text>Cancelados (20%)</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        margin: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    chart: {
        height: 200,
    },
    legend: {
        marginTop: 15,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    legendColor: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 10,
    },
});

export default Ventasporcategorias;


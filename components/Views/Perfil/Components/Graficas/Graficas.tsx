import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import PedidosMensuales from '../PedidosMensuales';
import PedidosRealizados from '../PedidosRealizados';


const SimpleBarCharts: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <PedidosMensuales />
        </View>
      <View style={styles.content}>
        <PedidosRealizados />
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  content: {
    padding: 1,
    marginBottom: 30,
    // width: '100%',
  },
});

export default SimpleBarCharts;
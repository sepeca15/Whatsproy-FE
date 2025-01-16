import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; 

const settingsPage = [
  {
    title:'Usuario',
    href: '/(tabs)/usuarios'
  },
  {
    title:'Notificaciones',
    href: ''
  },
  {
    title:'Privacidad',
    href: ''
  },
  {
    title:'Membresia',
    href: ''
  },
  {
    title:'Datos de pedido',
    href: '/(tabs)/datosPedido'
  },
]

const Settings = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {
        settingsPage.map((item : any, index)=> {
          return <TouchableOpacity 
          key={index}
          style={styles.card} 
          onPress={()=> router.push(item.href)}
        >
          <Text style={styles.cardText}>{item.title}</Text>
        </TouchableOpacity>
        })
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Settings;
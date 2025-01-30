import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import IonIcons from 'react-native-vector-icons/Ionicons'
import CustomText from '@/components/CustomText';
import { Center } from 'native-base';

const settingsPage = [
  {
    title: 'Ajustes generales',
    href: '/(tabs)/generalSettings',
    description: 'Maneja horas de apertura, cierre, intervalos entre reservas y abre/cierra tu local.',
    icon: <Feather size={20} color={'white'} name='settings' />
  },
  {
    title: 'Usuario',
    href: '/(tabs)/usuarios',
    description: 'Crea usuarios para tu empresa los cuales puedes maneajar y llevar control de los mismos.',
    icon: <FontAwesome5 name='users' size={20} color={'white'} />
  },
  {
    title: 'Notificaciones',
    href: '',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus',
    icon: <IonIcons name='notifications-outline' size={20} color={'white'} />
  },
  {
    title: 'Privacidad y Seguridad',
    href: '',
    description: 'Privacidad y seguridad de tus datos',
    icon: <Feather size={20} color={'white'} name='shield' />
  },
  {
    title: 'Membresia',
    href: '',
    description: 'Gestiona tus pagos, paga por adelantado, cambia de plan o cancela tu suscripcion.',
    icon: <AntDesign name='creditcard' size={20} color={'white'} />
  },
  {
    title: 'Datos de pedido',
    href: '/(tabs)/datosPedido',
    description: 'Ingresa la informacion necesaria para tus pedidos o reservas.',
    icon: <IonIcons size={20} color={'white'} name='newspaper-outline' />
  }
]

const Settings = () => {
  const router = useRouter();
  return (
    <Center style={styles.father}>
      <View style={styles.container}>
        <View style={styles.title}>
            <CustomText style={{ textAlign: 'center', fontSize: 25, fontWeight: 'bold', color:'white' }} >Configuraciones</CustomText>
        </View>
        <View style={styles.containerItems}>
          {
            settingsPage.map((item: any, index) => {
              return <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => router.push(item.href)}
              >
                <View style={styles.row}>
                  <View style={styles.rounded}>
                    {item.icon}
                  </View>
                  <View style={styles.col}>
                    <Text style={styles.cardText}>{item.title}</Text>
                    <CustomText style={styles.textDesc}>{item.description}</CustomText>
                  </View>
                </View>
              </TouchableOpacity>
            })
          }
        </View>
      </View>
    </Center>
  );
};

const styles = StyleSheet.create({
  father: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', 
    paddingTop: 40,
  },
  containerItems: {
    width: '100%', 
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'flex-start', 
  },
  title: {
    backgroundColor: 'black',
    width: '60%',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  card: {
    backgroundColor: 'white',
    width: '100%',
    borderBottomWidth: 0.5,
    borderColor: '#dbdbdb',
    display: 'flex',
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  cardText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  textDesc: {
    flexWrap: 'wrap',
    maxWidth: '90%',
    color: '#939393',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  col: {
    flex: 1,
    marginLeft: 12,
  },
  rounded: {
    width: 45,
    height: 45,
    borderRadius: 100,
    backgroundColor: 'gray',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default Settings;
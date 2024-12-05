import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { HStack, VStack, Avatar, IconButton, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 
import { styles } from './PerfilStyles';
import Graficas from './components/Graficas';

const Perfil: React.FC = () => {
  const router = useRouter(); 

  return (
    <View style={styles.container}>
      <HStack style={styles.header} alignItems="center" justifyContent="space-between">
        <HStack alignItems="center">
          <Avatar
            size="md"
            source={{
              uri: 'https://example.com/avatar.jpg', // Reemplaza con la URL de tu avatar
            }}
          />
          <VStack marginLeft={3}>
            <Text style={styles.name}>Jorge Martinez</Text>
            <Text style={styles.plan}>Plan: Premium</Text>
          </VStack>
        </HStack>
        <IconButton
          icon={<Icon as={Ionicons} name="settings-outline" size="md" />}
          onPress={() => {
         
            router.push("/(tabs)/config")
          }}
        />
      </HStack>
      <View style={styles.content}>
       
        <Graficas />
      </View>
    </View>
  );
};

export default Perfil;
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import createStyles from './UsuariosStyles';
import usuariosData from './components/data';
import { User } from './components/User';
import { useRouter } from 'expo-router'; 

const UsuariosEmpresasScreen: React.FC = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(Colors.light);
  const [styles, setStyles] = useState(createStyles(Colors.light));
  const [usuarios, setUsuarios] = useState<User[]>(usuariosData);

  useEffect(() => {
    const newTheme = colorScheme === 'dark' ? Colors.dark : Colors.light;
    setTheme(newTheme);
    setStyles(createStyles(newTheme));
  }, [colorScheme]);

  // Función para eliminar un elemento de usuarios
  const deleteUser = (id: number) => {
    const newUsuarios = usuarios.filter((usuario) => usuario.id !== id);
    setUsuarios(newUsuarios);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuarios Empresas</Text>
      <ScrollView style={styles.scrollView}>
        {usuarios.map((usuario) => (
          <TouchableOpacity 
            key={usuario.id} 
            style={styles.card} 
            onPress={() => {
              router.push("/(tabs)/pedidos")
            }}
          >
            <Text style={styles.userName}>{usuario.nombre}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteUser(usuario.id)}>
              <Ionicons name="trash-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => {
          router.push("/(tabs)/addusu")
        }}
      >
      
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UsuariosEmpresasScreen;
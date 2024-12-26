import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, useColorScheme, Animated } from 'react-native';
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
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const newTheme = colorScheme === 'dark' ? Colors.dark : Colors.light;
    setTheme(newTheme);
    setStyles(createStyles(newTheme));

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [colorScheme]);

  const deleteUser = (id: number) => {
    const newUsuarios = usuarios.filter((usuario) => usuario.id !== id);
    setUsuarios(newUsuarios);
  };

  const renderItem = ({ item }: { item: User }) => (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => router.push("/(tabs)/pedidos")}
      >
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{item.nombre[0].toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{item.nombre}</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteUser(item.id)}>
          <Ionicons name="trash-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuarios Empresas</Text>
      <FlatList
        data={usuarios}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => router.push("/(tabs)/addusu")}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default UsuariosEmpresasScreen;


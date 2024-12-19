import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  useColorScheme
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import createStyles from './AddStyles'; // Importa la función para crear estilos

const AddUsuario: React.FC = () => {
  const [nombre, setNombre] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const styles = createStyles(theme);

  const validateInputs = () => {
    const isNameValid = nombre.length > 0;
    const isEmailValid = /\S+@\S+\.\S+/.test(email);
    setIsValid(isNameValid && isEmailValid);
  };

  const handleAddUsuario = () => {
    if (isValid) {
      console.log('Usuario añadido:', { nombre, email });
      Alert.alert('Éxito', 'Usuario añadido correctamente');
      setNombre('');
      setEmail('');
    } else {
      Alert.alert('Error', 'Por favor, complete todos los campos correctamente');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Image
        source={{ uri: 'https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg' }}
        style={styles.image}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
       
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={24} style={styles.icon} />
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={(text) => {
              setNombre(text);
              validateInputs();
            }}
            placeholder="Ingrese el nombre"
            placeholderTextColor={styles.placeholderText.color}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} style={styles.icon} />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validateInputs();
            }}
            placeholder="Ingrese el email"
            placeholderTextColor={styles.placeholderText.color}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            !isValid && styles.buttonDisabled
          ]}
          onPress={handleAddUsuario}
          disabled={!isValid}
        >
          <Text style={styles.buttonText}>Crear</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddUsuario;


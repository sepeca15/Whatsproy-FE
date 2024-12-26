import React, { useState, useRef } from 'react';
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
  useColorScheme,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import createStyles from './AddStyles';

const AddUsuario: React.FC = () => {
  const [nombre, setNombre] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const styles = createStyles(theme);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateInputs = () => {
    const isNameValid = nombre.length > 0;
    const isEmailValid = /\S+@\S+\.\S+/.test(email);
    setIsValid(isNameValid && isEmailValid);
  };

  const handleAddUsuario = () => {
    if (isValid) {
      console.log('Usuario añadido:', { nombre, email, image: selectedImage });
      Alert.alert('Éxito', 'Usuario añadido correctamente');
      setNombre('');
      setEmail('');
      setSelectedImage(null);
    } else {
      Alert.alert('Error', 'Por favor, complete todos los campos correctamente');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            <Image
              source={{
                uri: selectedImage || 'https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg'
              }}
              style={styles.image}
            />
            <View style={styles.imagePicker}>
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.title}>Agregar Usuario</Text>
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
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddUsuario;


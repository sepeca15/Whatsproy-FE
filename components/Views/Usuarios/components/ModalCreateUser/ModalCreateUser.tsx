

import React, { useState, useEffect } from 'react';
import { Pressable, View, Text, TouchableOpacity, ScrollView, Animated, Image } from 'react-native';
import styles from './ModalCreateUserStyles';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import { Button, FormControl, Input, Modal } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

type keyValues = 'nombre' | 'apellido' | 'correo' | 'contraseña'

interface CreateUser {
    nombre: string;
    apellido: string;
    correo: string;
    contraseña: string
}

interface IModalCreateUser {
    onToogleModal: ()=> void,
    isOpen : boolean
}

const initialValues = {
    nombre: "",
    apellido: "",
    correo: '',
    contraseña: ''
}

const ModalCreateUser = ({ onToogleModal, isOpen }: IModalCreateUser) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [createUser, setCreateUser] = useState<CreateUser>(initialValues);
    const [errors, setErrors] = useState<any>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const setValueForm = (key: keyValues, value: string) => {
        setCreateUser((prevState) => ({
            ...prevState,
            [key]: value,
        }));
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

    const validate = () => {
        const newErrors: any = {};
        if (!createUser.nombre) newErrors.nombre = "Ingrese un nombre válido";
        if (!createUser.apellido) newErrors.apellido = "Ingrese un apellido válido";
        if (!createUser.correo || !/\S+@\S+\.\S+/.test(createUser.correo))
            newErrors.correo = "Ingrese un correo válido";
        if (!createUser.contraseña) newErrors.contraseña = "Ingrese una contraseña válida";
        return newErrors;
    };

    const handleSubmit = () => {
        const validationErrors = validate();
        setErrors(validationErrors);
        setIsSubmitted(true); // Marcar como enviado

        if (Object.keys(validationErrors).length === 0) {
            console.log("Formulario válido:", createUser);
        } else {
            console.log("Errores en el formulario:", validationErrors);
        }
    };

    return (
        <Modal onClose={onToogleModal} isOpen={isOpen}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Crear Usuario</Modal.Header>
                <Modal.Body>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                        <ScrollView contentContainerStyle={styles.scrollContainer}>
                            <Animated.View style={[styles.formContainer]}>
                                <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                                    <Image
                                        source={{
                                            uri:
                                                selectedImage ||
                                                "https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",
                                        }}
                                        style={styles.image}
                                    />
                                    <View style={styles.imagePicker}>
                                        <Ionicons name="camera" size={12} color="#fff" />
                                    </View>
                                </TouchableOpacity>

                                <FormControl isInvalid={isSubmitted && !!errors.nombre} width={"100%"}>
                                    <FormControl.Label>Nombre</FormControl.Label>
                                    <Input
                                        InputLeftElement={<AntDesign size={16} name='user' color={'gray'}/>}
                                        onChangeText={(value: string) => setValueForm("nombre", value)}
                                        value={createUser.nombre}
                                        style={styles.input}
                                        type="text"
                                        placeholder="Ingrese un nombre"
                                    />
                                    <FormControl.ErrorMessage>{errors.nombre}</FormControl.ErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={isSubmitted && !!errors.apellido} width={"100%"}>
                                    <FormControl.Label>Apellido</FormControl.Label>
                                    <Input
                                        InputLeftElement={<AntDesign size={16} name='user' color={'gray'}  />}
                                        onChangeText={(value: string) => setValueForm("apellido", value)}
                                        value={createUser.apellido}
                                        style={styles.input}
                                        type="text"
                                        placeholder="Ingrese un apellido"
                                    />
                                    <FormControl.ErrorMessage leftIcon={<MaterialIcons size={12} name='error' color={'red'}/>}>{errors.apellido}</FormControl.ErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={isSubmitted && !!errors.correo} width={"100%"}>
                                    <FormControl.Label >Correo</FormControl.Label>
                                    <Input
                                        InputLeftElement={<MaterialCommunityIcons size={16} name='gmail' color={'gray'}/>}
                                        onChangeText={(value: string) => setValueForm("correo", value)}
                                        value={createUser.correo}
                                        style={styles.input}
                                        type="text"
                                        placeholder="Ingrese su correo"
                                    />
                                    <FormControl.ErrorMessage>{errors.correo}</FormControl.ErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={isSubmitted && !!errors.contraseña} width={"100%"}>
                                    <FormControl.Label>Contraseña</FormControl.Label>
                                    <Input
                                        InputLeftElement={<AntDesign name='lock' size={12} color={'gray'}/>}
                                        onChangeText={(value: string) => setValueForm("contraseña", value)}
                                        value={createUser.contraseña}
                                        style={styles.input}
                                        type="password"
                                        placeholder="Ingrese su contraseña"
                                    />
                                    <FormControl.ErrorMessage>{errors.contraseña}</FormControl.ErrorMessage>
                                </FormControl>
                            </Animated.View>
                        </ScrollView>
                    </GestureHandlerRootView>
                </Modal.Body>
                <Modal.Footer>
                    <Button onPress={handleSubmit} style={styles.buttonCreate}>
                        Crear
                    </Button>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};


export default ModalCreateUser;




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
import { IUser } from '../../UsuariosType';
import api from '@/services/api/admin';
import { useUser } from '@/hooks/redux/useUser';
import CustomButton from '@/components/CustomButton';
import { useToastContext } from '@/contexts/ToastContext';

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
    addNewUser: (user : IUser)=> void
}

const initialValues = {
    nombre: "",
    apellido: "",
    correo: '',
    contraseña: ''
}

const ModalCreateUser = ({ onToogleModal, isOpen, addNewUser }: IModalCreateUser) => {
    const {user} = useUser()
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [createUser, setCreateUser] = useState<CreateUser>(initialValues);
    const [errors, setErrors] = useState<any>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loadingApi, setLoadingApi] = useState(false);
    const { showToast } = useToastContext()

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

    const createUserApi = async() => {
        setLoadingApi(true)
        const {apellido,contraseña,correo,nombre} = createUser
        try {
            const resp = await api.user.create({
                nombre,
                correo,
                password: contraseña,
                apellido,
                id_empresa: user.id_empresa
            })
            if(resp.ok) {
                showToast({
                    description:'Usuario creado exitosamente',
                    title: "Exitoso",
                    status: "error",
                });
                addNewUser(resp.data)
                onToogleModal()
                setCreateUser(initialValues)
            }
        } catch (error : any) {
            showToast({
                title: "Error",
                description:error.response.data.message,
                status: "error",
            });
            console.log('error',error.response.data.message);
        } finally { 
            setLoadingApi(false)
        }
    }

    const handleSubmit = () => {
        const validationErrors = validate();
        setErrors(validationErrors);
        setIsSubmitted(true);

        if (Object.keys(validationErrors).length === 0) {
            createUserApi()
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
                                        InputLeftElement={<AntDesign style={styles.marginCont}  size={16} name='user' color={'gray'}/>}
                                        onChangeText={(value: string) => setValueForm("nombre", value)}
                                        value={createUser.nombre}
                                        style={styles.input}
                                        type="text"
                                        placeholder="Ingrese un nombre"
                                        _focus={styles.focused}

                                    />
                                    <FormControl.ErrorMessage>{errors.nombre}</FormControl.ErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={isSubmitted && !!errors.apellido} width={"100%"}>
                                    <FormControl.Label >Apellido</FormControl.Label>
                                    <Input
                                        InputLeftElement={<AntDesign style={styles.marginCont} size={16} name='user' color={'gray'}  />}
                                        onChangeText={(value: string) => setValueForm("apellido", value)}
                                        value={createUser.apellido}
                                        style={styles.input}
                                        type="text"
                                        placeholder="Ingrese un apellido"
                                        _focus={styles.focused}
                                    />
                                    <FormControl.ErrorMessage leftIcon={<MaterialIcons size={12} name='error' color={'red'}/>}>{errors.apellido}</FormControl.ErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={isSubmitted && !!errors.correo} width={"100%"}>
                                    <FormControl.Label >Correo</FormControl.Label>
                                    <Input
                                        InputLeftElement={<MaterialCommunityIcons style={styles.marginCont}  size={16} name='gmail' color={'gray'}/>}
                                        onChangeText={(value: string) => setValueForm("correo", value)}
                                        value={createUser.correo}
                                        style={styles.input}
                                        type="text"
                                        placeholder="Ingrese su correo"
                                        _focus={styles.focused}
                                    />
                                    <FormControl.ErrorMessage>{errors.correo}</FormControl.ErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={isSubmitted && !!errors.contraseña} width={"100%"}>
                                    <FormControl.Label>Contraseña</FormControl.Label>
                                    <Input
                                        InputLeftElement={<AntDesign style={styles.marginCont}  name='lock' size={12} color={'gray'}/>}
                                        onChangeText={(value: string) => setValueForm("contraseña", value)}
                                        value={createUser.contraseña}
                                        style={styles.input}
                                        type="password"
                                        placeholder="Ingrese su contraseña"
                                        _focus={styles.focused}
                                    />
                                    <FormControl.ErrorMessage>{errors.contraseña}</FormControl.ErrorMessage>
                                </FormControl>
                            </Animated.View>
                        </ScrollView>
                    </GestureHandlerRootView>
                </Modal.Body>
                <Modal.Footer>
                    <CustomButton colorSpiner='white' loading={loadingApi} onPress={handleSubmit} style={styles.buttonCreate}>
                        Crear
                    </CustomButton>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};


export default ModalCreateUser;


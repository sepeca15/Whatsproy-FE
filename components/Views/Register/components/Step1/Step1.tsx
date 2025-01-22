import { View, VStack } from "native-base";
import { styles } from "./Step1Styles";
import InputField from "@/components/InputField";
import CustomText from "@/components/CustomText";
import * as ImagePicker from "expo-image-picker";
import { Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import AlertText from "../AlertText";

interface IDataStep1 {
    nombre: string;
    descripcion: string;
    logo: string;
}

interface IStep1 {
    formData: IDataStep1;
    handleInputChange: (key: string, value: any) => void;
    errors: any;
}

const Step1 = ({ formData, handleInputChange, errors }: IStep1) => {

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            handleInputChange("logo", result.assets[0].uri);
        }
    };

    return (
        <VStack space={2} style={styles.container}>
            <View style={styles.containerImage}>
                <TouchableOpacity onPress={pickImage}>
                    <Image
                        source={{
                            uri: formData.logo || "https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",
                        }}
                        style={styles.image}
                    />
                    <Ionicons name="camera" size={30} color="#fff" style={styles.imagePicker} />
                </TouchableOpacity>
            </View>
            <CustomText style={styles.textCenterLg}>
                Registra tu empresa y comienza a llevar control de tus pedidos y
                reservas
            </CustomText>
            <View>
                <InputField
                    label="Nombre de la empresa"
                    placeholder="Ingresa el nombre de tu empresa"
                    value={formData.nombre}
                    onChangeText={(value) => handleInputChange("nombre", value)}
                />
                {errors.nombre && (
                    <AlertText text={errors.nombre} />
                )}
            </View>
            <View>
                <InputField
                    label="Descripción"
                    placeholder="Breve descripción"
                    value={formData.descripcion}
                    onChangeText={(value) => handleInputChange("descripcion", value)}
                    isTextArea={true}
                    rows={4}
                />
                {errors.descripcion && (
                    <AlertText text={errors.descripcion} />
                )}
            </View>
        </VStack>
    );
};

export default Step1;

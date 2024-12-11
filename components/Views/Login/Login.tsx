import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Center, View, VStack } from "native-base";
import { useRouter } from "expo-router";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import LogoContainer from "@/components/LogoContainer";
import CustomText from "@/components/CustomText";
import api from "@/services/api/admin";
import { StoreData } from "@/storage/localStorage";
import { styles } from "./LoginStyles";

const initialValues = {
  email: "",
  password: "",
};

const LoginScreen: React.FC = () => {
  const [formValues, setFormValues] = React.useState(initialValues);
  const router = useRouter();

  const handleChangeValue = (key: string, value: string) => {
    setFormValues((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const Login = async () => {
    try {
      const res = await api.auth.login(formValues);

      if (res.access_token) {
        StoreData("token", res.access_token);
        router.push("/(tabs)/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Center>
        <VStack space={4} w="90%" maxW="300px">
          <View style={styles.containerImage}>
            <LogoContainer />
          </View>

          <InputField
            onChangeText={(text) => handleChangeValue("email", text)}
            label="Correo"
            placeholder="Ingresa tu correo"
          />
          <InputField
            onChangeText={(text) => handleChangeValue("password", text)}
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            type="password"
          />

          <CustomText
            style={styles.textPrimary}
            onPress={() => {
              /* función de reset */
            }}
          >
            ¿Has olvidado tu contraseña?
            <CustomText style={styles.textSecondary}> Reset</CustomText>
          </CustomText>

          <CustomText
            onPress={() => router.push("/(auth)/sign-up")}
            style={styles.textPrimary}
          >
            ¿No tienes cuenta?
            <CustomText style={styles.textSecondary}> Crear una</CustomText>
          </CustomText>

          <CustomButton onPress={() => Login()}>Iniciar Sesión</CustomButton>

          <CustomButton
            onPress={() => {
              router.push("/(tabs)/home");
            }}
          >
            Entrar
          </CustomButton>
        </VStack>
      </Center>
    </ScrollView>
  );
};

export default LoginScreen;

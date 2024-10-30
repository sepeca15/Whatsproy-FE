import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Center, VStack } from "native-base";
import { useRouter } from "expo-router";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import LogoContainer from "@/components/LogoContainer";
import CustomText from "@/components/CustomText";

const LoginScreen: React.FC = () => {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Center>
        <VStack space={4} w="90%" maxW="300px">
          <LogoContainer />

          <InputField label="Correo" placeholder="Ingresa tu correo" />
          <InputField
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            type="password"
          />

          <CustomText
            style={styles.textBlue500}
            onPress={() => {
              /* función de reset */
            }}
          >
            ¿Has olvidado tu contraseña?
            <CustomText style={styles.textBlue600}> Reset</CustomText>
          </CustomText>

          <CustomText
            onPress={() => router.push("/(auth)/sign-up")}
            style={styles.textBlue500}
          >
            ¿No tienes cuenta?
            <CustomText style={styles.textBlue600}> Crear una</CustomText>
          </CustomText>

          <CustomButton
            onPress={() => {
              /* función de login */
            }}
          >
            Iniciar Sesión
          </CustomButton>
        </VStack>
      </Center>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    justifyContent: "center",
  },
  textBlue500: {
    color: "#075e54",
  },
  textBlue600: {
    color: "#128c7e",
  },
});

export default LoginScreen;

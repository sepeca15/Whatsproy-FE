import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Center, VStack, Checkbox } from "native-base";
import { useRouter } from "expo-router";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import LogoContainer from "@/components/LogoContainer";
import CustomText from "@/components/CustomText";

const SignUpScreen: React.FC = () => {
  const router = useRouter();
  const [isCompany, setIsCompany] = useState<boolean>(false);

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Center>
        <VStack space={4} w="90%" maxW="300px">
          <LogoContainer />

          <CustomText style={styles.textCenterLg}>
            Registra tu empresa y comienza a llevar control de tus pedidos y
            reservas
          </CustomText>

          <InputField label="Correo" placeholder="Ingresa tu correo" />
          <InputField
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            type="password"
          />

          <Checkbox
            value=""
            isChecked={isCompany}
            onChange={() => setIsCompany(!isCompany)}
          >
            Soy empresa
          </Checkbox>

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
            onPress={() => router.push("/(auth)/login")}
            style={styles.textBlue500}
          >
            ¿Ya tienes cuenta?
            <CustomText style={styles.textBlue600}> Iniciar sesión</CustomText>
          </CustomText>

          <CustomButton
            onPress={() => {
              /* función de registro */
            }}
          >
            Registrarse
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
  textCenterLg: {
    textAlign: "center",
    fontSize: 18,
  },
  textBlue500: {
    color: "#075e54",
  },
  textBlue600: {
    color: "#128c7e",
  },
});

export default SignUpScreen;

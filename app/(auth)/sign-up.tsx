import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Center, VStack, Checkbox } from "native-base";
import { useRouter } from "expo-router";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import LogoContainer from "@/components/LogoContainer";
import CustomText from "@/components/CustomText";
import { Colors } from "@/constants/Colors";

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
            style={styles.textPrimary}
            onPress={() => {
              /* función de reset */
            }}
          >
            ¿Has olvidado tu contraseña?
            <CustomText style={styles.textSecondary}> Reset</CustomText>
          </CustomText>

          <CustomText
            onPress={() => router.push("/(auth)/login")}
            style={styles.textPrimary}
          >
            ¿Ya tienes cuenta?
            <CustomText style={styles.textSecondary}> Iniciar sesión</CustomText>
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
  textPrimary: {
    color: Colors.light.primary,
  },
  textSecondary: {
    color: Colors.light.secondary,
  },
});

export default SignUpScreen;

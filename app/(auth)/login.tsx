import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Center, VStack } from "native-base";
import { useRouter } from "expo-router";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import LogoContainer from "@/components/LogoContainer";
import CustomText from "@/components/CustomText";
import { Colors } from "@/constants/Colors";

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
  textPrimary: {
    color: Colors.light.primary,
  },
  textSecondary: {
    color: Colors.light.secondary,
  },
});

export default LoginScreen;

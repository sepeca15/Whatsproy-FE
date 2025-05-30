import React, { useState, useCallback } from "react";
import {
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { Center, View, VStack, Text } from "native-base";
import { useRouter } from "expo-router";
import { FormattedMessage, useIntl } from "react-intl";
import CustomButton from "@/components/CustomButton";
import LogoContainer from "@/components/LogoContainer";
import api from "@/services/api/admin";
import { StoreData } from "@/storage/localStorage";
import { styles } from "./LoginStyles";
import { useToastContext } from "@/contexts/ToastContext";
import RoundedInputField from "@/components/RoundedInputField";
import { AntDesign, EvilIcons, FontAwesome5 } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";

const LoginScreen: React.FC = () => {
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const intl = useIntl();
  const router = useRouter();
  const { showToast } = useToastContext();

  const handleChangeValue = useCallback((key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const Login = useCallback(async () => {
    if (!formValues.email || !formValues.password) {
      showToast({
        title: "Error",
        description: "Completa los campos requeridos",
        status: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await api.auth.login(formValues);
      if (res.access_token) {
        StoreData("token", res.access_token);
        const userData = await api.auth.me();
        StoreData("user", JSON.stringify(userData));
        router.push("/(tabs)/home");
      }
    } catch (error: any) {
      showToast({
        title: (
          <FormattedMessage
            id="authErrorTitle"
            defaultMessage="Authentication Error"
          />
        ),
        description: error.response?.data?.message || (
          <FormattedMessage
            id="authErrorDescription"
            defaultMessage="Error logging in."
          />
        ),
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [formValues, router, showToast]);



  const handleBiometricAuth = useCallback(async () => {
    // verificar si el dispositivo tiene hardware de autenticación biométrica y si hay huellas registradas
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    // si no hay hardware o no hay huellas registradas, mostrar un mensaje de error
    if (!hasHardware || !isEnrolled) {
      showToast({
        title: "Huella no disponible",
        description: "Tu dispositivo no tiene lector o no hay huellas registradas.",
        status: "error",
      });
      return;
    }
    // si hay hardware y huellas registradas, proceder con la autenticación biométrica
    // solicitar autenticación biométrica
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Ingresá con tu huella digital",
      fallbackLabel: "Usar contraseña",
      disableDeviceFallback: true,
    });
    // si la autenticación es exitosa, llamar a la función de login
    if (result.success) {
      Login();
    } else {
      showToast({
        title: "Huella incorrecta",
        description: "No se pudo verificar tu identidad",
        status: "error",
      });
    }
  }, [Login, showToast]);

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, height: '100%' }}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        <Center w={'full'} h={'full'} flexDir={'column'} backgroundColor={'teal.700'}>
          <View w={'full'} height={'30%'} flex={1} background={'teal.700'} style={styles.containerImage}>
            <LogoContainer />
          </View>

          <VStack bg={'white'} roundedTop={30} space={4} w="full" alignItems={'center'} height={'70%'}>
            <View w={'90%'} mt={8} style={{ gap: 12 }}>
              <Text textAlign={'center'} fontSize={35} fontWeight={'semibold'}>
                <FormattedMessage id="titleLogin" />
              </Text>

              <Text mb={2} textAlign={'center'} fontSize={20} fontWeight={'semibold'}>
                <FormattedMessage id="loginButton" />
              </Text>

              {["email", "password"].map((field) => (
                <RoundedInputField
                  key={field}
                  isRequired={true}
                  onChangeText={(text) => handleChangeValue(field, text)}
                  icon={field === 'email' ? <AntDesign size={16} name="user" /> : <EvilIcons name="lock" size={20} />}
                  marginTop={8}
                  placeholder={intl.formatMessage({
                    id: `${field}Placeholder`,
                    defaultMessage: `Enter your ${field}`,
                  })}
                  type={field === "password" ? "password" : "text"}
                />
              ))}

              <TouchableOpacity
                onPress={() => router.push("/(auth)/sendLinkEmail")}
                style={styles.textPrimary}
              >
                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                  <Text color={'teal.700'}>
                    <FormattedMessage
                      id="forgotPassword"
                      defaultMessage="Forgot your password?"
                    />
                  </Text>
                </View>
              </TouchableOpacity>

              <CustomButton loading={loading} onPress={Login} colorSpiner="white" borderRadius={1000}>
                <FormattedMessage id="loginButton" defaultMessage="Login" />
              </CustomButton>

              <CustomButton onPress={handleBiometricAuth} colorSpiner="white" borderRadius={1000}>
                <FontAwesome5 name="fingerprint" size={20} />
                <Text ml={2}>Ingresar con huella</Text>
              </CustomButton>

              <TouchableOpacity
                onPress={() => router.push("/(auth)/sign-up")}
                style={styles.textPrimary}
              >
                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                  <Text>
                    <FormattedMessage
                      id="noAccount"
                      defaultMessage="Don't have an account?"
                    />
                  </Text>
                  <Text color={'teal.700'}>
                    <FormattedMessage
                      id="createAccount"
                      defaultMessage=" Create one"
                    />
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </VStack>
        </Center>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

import React, { useState, useCallback, useEffect } from "react";
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
import * as SecureStore from "expo-secure-store";
import { styles } from "./LoginStyles";
import { useToastContext } from "@/contexts/ToastContext";
import RoundedInputField from "@/components/RoundedInputField";
import { AntDesign, EvilIcons, FontAwesome5 } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";

const EMAIL_KEY = "userEmail";
const PASSWORD_KEY = "userPassword";

const LoginScreen: React.FC = () => {
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const intl = useIntl();
  const router = useRouter();
  const { showToast } = useToastContext();

  // Cargar email y password guardados al montar el componente
  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedEmail = await SecureStore.getItemAsync(EMAIL_KEY);
        const savedPassword = await SecureStore.getItemAsync(PASSWORD_KEY);
        if (savedEmail && savedPassword) {
          setFormValues({ email: savedEmail, password: savedPassword });
        }
      } catch (e) {
        // Podés loguear si querés, pero no es crítico
      }
    };
    loadCredentials();
  }, []);

  const handleChangeValue = useCallback((key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const saveCredentials = async (email: string, password: string) => {
    try {
      await SecureStore.setItemAsync(EMAIL_KEY, email);
      await SecureStore.setItemAsync(PASSWORD_KEY, password);
    } catch (e) {
      // Podés mostrar error si querés, no crítico
    }
  };

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
        // Guardar token y datos usuario
        await saveCredentials(formValues.email, formValues.password);
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
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      showToast({
        title: "Huella no disponible",
        description: "Tu dispositivo no tiene lector o no hay huellas registradas.",
        status: "error",
      });
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Ingresá con tu huella digital",
      fallbackLabel: "Usar contraseña",
      disableDeviceFallback: true,
    });

    if (result.success) {
      // Leer credenciales guardadas
      const savedEmail = await SecureStore.getItemAsync(EMAIL_KEY);
      const savedPassword = await SecureStore.getItemAsync(PASSWORD_KEY);

      if (savedEmail && savedPassword) {
        setFormValues({ email: savedEmail, password: savedPassword });
        // Ejecutar login con datos guardados
        try {
          setLoading(true);
          const res = await api.auth.login({ email: savedEmail, password: savedPassword });
          if (res.access_token) {
            router.push("/(tabs)/home");
          }
        } catch (error: any) {
          showToast({
            title: "Error al iniciar sesión",
            description: "No se pudo iniciar sesión con las credenciales guardadas.",
            status: "error",
          });
        } finally {
          setLoading(false);
        }
      } else {
        showToast({
          title: "Credenciales no guardadas",
          description: "Primero iniciá sesión con tu email y contraseña para usar la huella.",
          status: "warning",
        });
      }
    } else {
      showToast({
        title: "Huella incorrecta",
        description: "No se pudo verificar tu identidad",
        status: "error",
      });
    }
  }, [router, showToast]);

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

              {(["email", "password"] as Array<keyof typeof formValues>).map((field) => (
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
                  value={formValues[field]}
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

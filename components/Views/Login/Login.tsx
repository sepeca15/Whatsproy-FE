import React, { useState, useCallback } from "react";
import { ScrollView, Text, KeyboardAvoidingView } from "react-native";
import { Center, View, VStack } from "native-base";
import { useRouter } from "expo-router";
import { FormattedMessage, useIntl } from "react-intl";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import LogoContainer from "@/components/LogoContainer";
import CustomText from "@/components/CustomText";
import api from "@/services/api/admin";
import { StoreData } from "@/storage/localStorage";
import { styles } from "./LoginStyles";
import { useToastContext } from "@/contexts/ToastContext";

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
    if (!formValues.email || !formValues.password) return;

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

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        <Center>
          <VStack space={4} w="90%" maxW="300px">
            <View style={styles.containerImage}>
              <LogoContainer />
            </View>

            {["email", "password"].map((field) => (
              <InputField
                key={field} // Asegúrate de que la key sea única
                onChangeText={(text) => handleChangeValue(field, text)}
                label={
                  <Text>
                    <FormattedMessage
                      id={`${field}Label`}
                      defaultMessage={
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }
                    />
                  </Text>
                }
                placeholder={intl.formatMessage({
                  id: `${field}Placeholder`,
                  defaultMessage: `Enter your ${field}`,
                })}
                type={field === "password" ? "password" : "text"}
              />
            ))}

            <CustomText style={styles.textPrimary}>
              <FormattedMessage
                id="forgotPassword"
                defaultMessage="Forgot your password?"
              />
              <CustomText style={styles.textSecondary}>
                <FormattedMessage id="resetPassword" defaultMessage=" Reset" />
              </CustomText>
            </CustomText>

            <CustomText
              onPress={() => router.push("/(auth)/sign-up")}
              style={styles.textPrimary}
            >
              <FormattedMessage
                id="noAccount"
                defaultMessage="Don't have an account?"
              />
              <CustomText style={styles.textSecondary}>
                <FormattedMessage
                  id="createAccount"
                  defaultMessage=" Create one"
                />
              </CustomText>
            </CustomText>

            <CustomButton loading={loading} onPress={Login} colorSpiner="white">
              <FormattedMessage id="loginButton" defaultMessage="Login" />
            </CustomButton>
          </VStack>
        </Center>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

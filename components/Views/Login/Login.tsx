import React from "react";
import { ScrollView, Text } from "react-native";
import { Center, View, VStack } from "native-base";
import { useRouter } from "expo-router";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import LogoContainer from "@/components/LogoContainer";
import CustomText from "@/components/CustomText";
import api from "@/services/api/admin";
import { StoreData } from "@/storage/localStorage";
import { styles } from "./LoginStyles";
import { useToastContext } from "@/contexts/ToastContext";
import { KeyboardAvoidingView } from "react-native";
import { FormattedMessage, useIntl } from 'react-intl'; // Importa FormattedMessage y useIntl

const initialValues = {
  email: "",
  password: "",
};

const LoginScreen: React.FC = () => {
  const [formValues, setFormValues] = React.useState(initialValues);
  const intl = useIntl();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const { showToast } = useToastContext();

  const handleChangeValue = (key: string, value: string) => {
    setFormValues((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const Login = async () => {
    try {
      setLoading(true);
      const res = await api.auth.login(formValues);

      if (res.access_token) {
        if (!formValues.email || !formValues.password) {
          return;
        }
        StoreData("token", res.access_token);
        router.push("/(tabs)/home");
      }
    } catch (error: any) {
      showToast({
        title: <Text><FormattedMessage id="authErrorTitle" defaultMessage="Authentication Error" /></Text>,
        description: <Text>{error.response.data.message || <FormattedMessage id="authErrorDescription" defaultMessage="Error logging in." />}</Text>,
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Center>
          <VStack space={4} w="90%" maxW="300px">
            <View style={styles.containerImage}>
              <LogoContainer />
            </View>

            <InputField
              onChangeText={(text) => handleChangeValue("email", text)}
              label={<Text><FormattedMessage id="emailLabel" defaultMessage="Email" /></Text>}
              placeholder={intl.formatMessage({ id: "emailPlaceholder", defaultMessage: "Enter your email" })}
            />
            <InputField
              onChangeText={(text) => handleChangeValue("password", text)}
              label={<Text><FormattedMessage id="passwordLabel" defaultMessage="Password" /></Text>}
              placeholder={intl.formatMessage({ id: "passwordPlaceholder", defaultMessage: "Enter your password" })}
              type="password"
            />

            <CustomText
              style={styles.textPrimary}
              // onPress={() => {
              //   router.push("/(auth)/forgot-password");
              // }}
            >
              <FormattedMessage id="forgotPassword" defaultMessage="Forgot your password?" />
              <CustomText style={styles.textSecondary}>
                <FormattedMessage id="resetPassword" defaultMessage=" Reset" />
              </CustomText>
            </CustomText>

            <CustomText
              onPress={() => router.push("/(auth)/sign-up")}
              style={styles.textPrimary}
            >
              <FormattedMessage id="noAccount" defaultMessage="Don't have an account?" />
              <CustomText style={styles.textSecondary}>
                <FormattedMessage id="createAccount" defaultMessage=" Create one" />
              </CustomText>
            </CustomText>
            <CustomButton
              loading={loading}
              onPress={() => Login()}
              colorSpiner="white"
            >
              <FormattedMessage id="loginButton" defaultMessage="Login" />
            </CustomButton>
          </VStack>
        </Center>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
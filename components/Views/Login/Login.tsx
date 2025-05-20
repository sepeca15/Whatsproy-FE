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
import { AntDesign, EvilIcons } from "@expo/vector-icons";

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
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, height: '100%' }}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        <Center w={'full'} h={'full'} display={'flex'} flexDir={'column'} backgroundColor={'teal.700'}>
          <View w={'full'} height={'30%'} flex={1} background={'teal.700'} style={styles.containerImage}>
            <LogoContainer />
          </View>
          <VStack bg={'white'} roundedTop={30} space={4} w="full" display={'flex'} flexDir={'column'} alignItems={'center'} justifyItems={'center'} height={'70%'}>
            <View w={'90%'} mt={8} style={{ gap: 12 }}>
              <Text textAlign={'center'} fontSize={35} fontWeight={'semibold'} >
                <FormattedMessage id="titleLogin" />
              </Text>

              <Text mb={2} textAlign={'center'} fontSize={20} fontWeight={'semibold'} >
                <FormattedMessage id="loginButton" />
              </Text>
              {["email", "password"].map((field) => (
                <RoundedInputField
                  key={field}
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
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 4,
                    justifyContent: "flex-end",
                  }}
                >
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

              <TouchableOpacity
                onPress={() => router.push("/(auth)/sign-up")}
                style={styles.textPrimary}
              >
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 4,
                    justifyContent: "center",
                  }}
                >
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

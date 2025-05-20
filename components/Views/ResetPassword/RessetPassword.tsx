import React, { useState } from "react";
import { Platform, StyleSheet, TextInput } from "react-native";
import { useLocalSearchParams, useRouter, useSearchParams } from "expo-router/build/hooks";
import api from "@/services/api/admin";
import { Box, Button, Center, KeyboardAvoidingView, ScrollView, Text, View } from "native-base";
import LogoContainer from "@/components/LogoContainer";
import { Colors } from "@/constants/Colors";
import InputField from "@/components/InputField";
import { FormattedMessage, useIntl } from "react-intl";
import { useToastContext } from "@/contexts/ToastContext";

export const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState({
        password1: "",
        password2: ""
    });
    const [loadingApi, setLoadingApi] = useState<boolean>(false);
    const { showToast } = useToastContext();
    const router = useRouter()    

    const changeValue = (key: 'password1' | 'password2', value: string) => {
        setNewPassword((prev) => ({
            ...prev,
            [key]: value
        }))
    }

    const params = useLocalSearchParams();
    const token: string = params?.token as string;
    const intl = useIntl()

    console.log('el token es',token);

    const handleResetPassword = async () => {
        if (!newPassword) {
            showToast({
                title: "Error",
                description: intl.formatMessage({
                    id: "passwordResetedNoValue",
                    defaultMessage: "Por favor ingrese una contraseña valida"
                }),
                status: "success",
            }); return;
        }
        if (newPassword.password1 !== newPassword.password2) {
            showToast({
                title: "Error",
                description: intl.formatMessage({
                    id: "passwordResetedNoEquals",
                    defaultMessage: "Las contraseñas no cooinciden"
                }),
                status: "success",
            }); return;
        }

        setLoadingApi(true)
        try {
            const resp = await api.auth.resetPassword(token, newPassword.password1)

            if (resp.ok) {
                router.push(`/(auth)/login`);
                showToast({
                    title: intl.formatMessage({
                        id: "passwordResetedSuccessTitle",
                        defaultMessage: "Contraseña restablecida"
                    }),
                    description: intl.formatMessage({
                        id: "passwordResetedSuccessDesc",
                    }),
                    status: "success",
                });
            }
        } catch (error: any) {
            showToast({
                title: "Error",
                description: error.response.data.message,
                status: "error",
            });
        } finally {
            setLoadingApi(false)
        }
    };

    return (

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }
        }>
            <View display={'flex'} flexDir={'column'} flex={1} bg={'teal.700'}>
                <Center w={'full'} flex={0.4} display={'flex'} flexDir={'column'} backgroundColor={'teal.700'}>
                    <View w={'full'} height={'30%'} flex={1} background={'teal.700'} style={styles.containerImage}>
                        <LogoContainer />
                    </View>
                </Center>
                <ScrollView bg={'white'} roundedTop={30} flex={0.6} >
                    <Box mt={8} display={'flex'} flexDir={'column'} style={{ gap: 0 }} px={4} w="100%" >
                        <Text textAlign={'center'} fontWeight={'bold'} fontSize={30} mb={4} > <FormattedMessage id="sendLinkTitle" /></Text>
                        < InputField
                            label={intl.formatMessage({
                                id: "resetPasswordinput1",
                                defaultMessage: "Contraseña"
                            })}
                            placeholder="12345"
                            autoCapitalize="none"
                            type={"password"}
                            value={newPassword.password1}
                            onChangeText={(text: string) => changeValue('password1', text)}

                        />
                        <View mt={4}></View>
                        < InputField
                            label={intl.formatMessage({
                                id: "resetPasswordinput2",
                                defaultMessage: "Repetir contraseña"
                            })}
                            placeholder="12345"
                            type={"password"}
                            autoCapitalize="none"
                            value={newPassword.password2}
                            onChangeText={(text: string) => changeValue('password2', text)}
                        />
                        <Button mt={8} bg={Colors.light.secondary} onPress={handleResetPassword} isLoading={loadingApi} >
                            <Text color={'white'}>
                                <FormattedMessage id="resetPasswordButtonSend" />
                            </Text>
                        </Button>
                    </Box>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    containerImage: {
        alignItems: "center",
        display: 'flex',
        justifyContent: 'center'
    },
})


export default ResetPassword
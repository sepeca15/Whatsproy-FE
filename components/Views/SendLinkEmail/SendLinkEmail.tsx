import InformativeText from "@/components/InformativeText";
import InputField from "@/components/InputField";
import LogoContainer from "@/components/LogoContainer";
import { Colors } from "@/constants/Colors";
import api from "@/services/api/admin";
import { Box, Button, Center, KeyboardAvoidingView, ScrollView, Text, Toast, View } from "native-base";
import { useState } from "react";
import { useIntl } from "react-intl";
import { Platform, StyleSheet } from "react-native";

const SendLinkEmail = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const intl = useIntl()
    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };


    const handleSendCode = async () => {
        if (!isValidEmail(email)) {
            Toast.show({ description: "Correo no válido", bgColor: "red.500" });
            return;
        }

        try {
            setLoading(true);
            const resp = await api.auth.sendLink(email)
            
            if (resp.ok) {
                Toast.show({ description: "Código enviado a tu correo", bgColor: "green.500" });
            } else {
                Toast.show({ description: resp?.message || "Error al enviar código", bgColor: "red.500" });
            }
        } catch (error: any) {
            Toast.show({ description: "Error de red", bgColor: "red.500" });
            console.log(error.response.data.message);
            
        } finally {
            setLoading(false);
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
                        <Text textAlign={'center'} fontWeight={'bold'} fontSize={30} mb={4} > Restablecer contraseña</Text>
                        <InformativeText text={'Ingrese su correo y enviaremos un link para que pueda restablecer su contraseña'} />
                        < InputField
                            label={intl.formatMessage({
                                id: "email",
                                defaultMessage: "email"
                            })}
                            placeholder="ejemplo@gmail.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                        < Button mt={8} bg={Colors.light.secondary} onPress={handleSendCode} isLoading={loading} >
                            Enviar código
                        </Button>
                    </Box>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    containerImage: {
        alignItems: "center",
        display: 'flex',
        justifyContent: 'center'
    },
})


export default SendLinkEmail
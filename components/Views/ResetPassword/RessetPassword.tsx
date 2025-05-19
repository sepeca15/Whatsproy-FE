import React, { useState } from "react";
import { Text, View, TextInput, Button } from "react-native";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";
import api from "@/services/api/admin";

export const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const params = useLocalSearchParams();
    const token: string = params?.token as string;

    const handleResetPassword = async () => {
        if (!newPassword) {
            alert("Por favor, ingresa una nueva contraseña.");
            return;
        }
        try {
            const resp = await api.auth.resetPassword(token, newPassword)

            if (resp.ok) {
                console.log('contraseña restablecida');

            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View>
            <Text>Restablecer Contraseña</Text>
            <TextInput
                placeholder="Ingresa tu nueva contraseña"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
            />
            <Button title="Restablecer Contraseña" onPress={handleResetPassword} />
        </View>
    );
}

export default ResetPassword
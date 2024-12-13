import React, { useState } from "react";
import { Center, VStack, Checkbox, Select, View } from "native-base";
import { useRouter } from "expo-router";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import LogoContainer from "@/components/LogoContainer";
import CustomText from "@/components/CustomText";
import { styles } from "./RegisterStyles";
import CheckBox from '@react-native-community/checkbox';

const Register: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    logo: "",
    menu: "",
    hora_apertura: "",
    hora_cierre: "",
    notificarReservaHoras: false,
    tipoServicioId: "",
    userEmail: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleRegister = () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    console.log("Datos del formulario:", formData);
  };

  return (
    <Center paddingY={20} id="center">
      <VStack space={4} w="90%" maxW="300px">
        <View style={styles.containerImage}>
          <LogoContainer />
        </View>

        <CustomText style={styles.textCenterLg}>
          Registra tu empresa y comienza a llevar control de tus pedidos y
          reservas
        </CustomText>

        <InputField
          label="Nombre de la empresa"
          placeholder="Ingresa el nombre de tu empresa"
          value={formData.nombre}
          onChangeText={(value) => handleInputChange("nombre", value)}
        />
        <InputField
          label="Descripción"
          placeholder="Breve descripción"
          value={formData.descripcion}
          onChangeText={(value) => handleInputChange("descripcion", value)}
        />
        <InputField
          label="Correo"
          placeholder="Ingresa tu correo"
          value={formData.userEmail}
          onChangeText={(value) => handleInputChange("userEmail", value)}
        />
        <InputField
          label="Contraseña"
          placeholder="Ingresa tu contraseña"
          type="password"
          value={formData.password}
          onChangeText={(value) => handleInputChange("password", value)}
        />
        <InputField
          label="Confirmar Contraseña"
          placeholder="Reingresa tu contraseña"
          type="password"
          value={formData.confirmPassword}
          onChangeText={(value) => handleInputChange("confirmPassword", value)}
        />
        <InputField
          label="Logo"
          placeholder="URL del logo (opcional)"
          value={formData.logo}
          onChangeText={(value) => handleInputChange("logo", value)}
        />
        <InputField
          label="Menú"
          placeholder="URL del menú (opcional)"
          value={formData.menu}
          onChangeText={(value) => handleInputChange("menu", value)}
        />
        <InputField
          label="Hora de apertura"
          placeholder="Ej: 09:00 AM"
          value={formData.hora_apertura}
          onChangeText={(value) => handleInputChange("hora_apertura", value)}
        />
        <InputField
          label="Hora de cierre"
          placeholder="Ej: 10:00 PM"
          value={formData.hora_cierre}
          onChangeText={(value) => handleInputChange("hora_cierre", value)}
        />

        <CheckBox
          value={formData.notificarReservaHoras}
          onValueChange={(value) =>
            handleInputChange("notificarReservaHoras", value)
          }
        >
          Notificar reservas por hora
        </CheckBox>

        <Select
          selectedValue={formData.tipoServicioId}
          placeholder="Selecciona un tipo de servicio"
          onValueChange={(value) => handleInputChange("tipoServicioId", value)}
        >
          <Select.Item label="Servicio 1" value="1" />
          <Select.Item label="Servicio 2" value="2" />
          <Select.Item label="Servicio 3" value="3" />
        </Select>

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

        <CustomButton onPress={handleRegister}>Registrarse</CustomButton>
      </VStack>
    </Center>
  );
};

export default Register;

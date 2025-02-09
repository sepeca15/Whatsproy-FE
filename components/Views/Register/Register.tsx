import React, { useState } from "react";
import {
  Center,
  VStack,
  Checkbox,
  Select,
  View,
  ScrollView,
  KeyboardAvoidingView,
} from "native-base";
import { Link, useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { styles } from "./RegisterStyles";
import Step1 from "./components/Step1";
import Step3 from "./components/Step3";
import Step2 from "./components/Step2";
import { useToastContext } from "@/contexts/ToastContext";
import api from "@/services/api/admin";
import CustomText from "@/components/CustomText";
import { useIntl } from 'react-intl'; // Importa useIntl

interface IDataRegister {
  nombre: string;
  descripcion: string;
  hora_apertura: string;
  logo: string;
  hora_cierre: string;
  notificarReservaHoras: boolean;
  tipoServicioId: number | null;
  userEmail: string;
  password: string;
  confirmPassword: string;
  timeZone: string;
}

const Register: React.FC = () => {
  const router = useRouter();;
  const intl = useIntl(); // Usa useIntl para obtener la instancia de intl

  const [steps, setSteps] = useState<number>(1);
  const [errors, setErrors] = useState<any>({});
  const { showToast } = useToastContext();
  const [loadingApi, setLoadingApi] = useState<boolean>(false);

  const nextStep = () => {
    const errorsData = validateError(steps);
    setErrors(errorsData);

    switch (steps) {
      case 1:
        Object.keys(errorsData).length === 0 && setSteps((prevState) => (prevState + 1));
        break;
      case 2:
        Object.keys(errorsData).length === 0 && setSteps((prevState) => (prevState + 1));
        break;
      case 3:
        Object.keys(errorsData).length === 0 && handleRegister()
        break
    }
  };

  const [formData, setFormData] = useState<IDataRegister>({
    nombre: "",
    descripcion: "",
    hora_apertura: "",
    logo: "",
    hora_cierre: "",
    notificarReservaHoras: false,
    tipoServicioId: null,
    userEmail: "",
    password: "",
    confirmPassword: "",
    timeZone: "",
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateError = (currentStep: number) => {
    let error: any = {};

    if (currentStep === 1) {
      if (!formData.nombre.trim()) error.nombre = intl.formatMessage({ id: "validName", defaultMessage: "Please enter a valid name" });
      if (!formData.descripcion.trim()) error.descripcion = intl.formatMessage({ id: "validDescription", defaultMessage: "Please enter a valid description" });
      if (!formData.timeZone.trim()) error.timeZone = intl.formatMessage({ id: "validTimeZone", defaultMessage: "Please select a valid time zone" });
    }

    if (currentStep === 2) {
      if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(formData.hora_apertura))
        error.hora_apertura = intl.formatMessage({ id: "validOpeningTime", defaultMessage: "Please enter a valid opening time (HH:mm format)" });
      if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(formData.hora_cierre))
        error.hora_cierre = intl.formatMessage({ id: "validClosingTime", defaultMessage: "Please enter a valid closing time (HH:mm format)" });
      if (!formData.tipoServicioId)
        error.tipoServicioId = intl.formatMessage({ id: "validServiceType", defaultMessage: "Please select a valid service type" });
    }


    if (currentStep === 3) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail))
        error.userEmail = intl.formatMessage({ id: "validEmail", defaultMessage: "Please enter a valid email address" });
      if (formData.password.length < 8)
        error.password = intl.formatMessage({ id: "validPassword", defaultMessage: "Password must be at least 8 characters long" });
      if (formData.confirmPassword !== formData.password)
        error.confirmPassword = intl.formatMessage({ id: "passwordMismatch", defaultMessage: "Password confirmation does not match password" });
    }


    return error;
  };

  const handleRegister = async  () => {
    console.log(formData);

    setLoadingApi(true);


    try {
      const data = await api.company.create(formData);
      if (data.ok) {
        router.push('/(auth)/login');
        showToast({
          title: intl.formatMessage({ id: "companyCreated", defaultMessage: "Company created successfully" }),
          status: 'success'
        });
      }
    } catch (error: any) {
  
      showToast({
        title: intl.formatMessage({ id: "error", defaultMessage: "Error" }),
        description: error.response.data.message,
        status: 'error'
      });
    } finally {
      setLoadingApi(false);;
    }
  };

  return (
    <View alignItems={'center'} style={{ flex: 1 }} >
      <VStack flex={1} w="90%" maxW="350px">
        <View style={styles.containerSteps}>
          {
            steps === 1 ?
              <Step1 errors={errors} formData={formData} handleInputChange={handleInputChange} />
              :
              steps === 2 ?
                <Step2 errors={errors} formData={formData} handleInputChange={handleInputChange} />
                :
                <Step3 tipoServicio={formData.tipoServicioId} errors={errors} formData={formData} handleInputChange={handleInputChange} />
          }
          <CustomButton colorSpiner="white" loading={loadingApi} style={{ marginTop: 20 }} onPress={nextStep}>
            {steps === 3 ? intl.formatMessage({ id: "createAccount", defaultMessage: "Create Account" }) : intl.formatMessage({ id: "continue", defaultMessage: "Continue" })}
          </CustomButton>
        </View>
      </VStack>
    </View>
  );
};

export default Register;
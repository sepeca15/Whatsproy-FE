import React, { useState } from "react";
import { Center, VStack, Checkbox, Select, View, ScrollView } from "native-base";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { styles } from "./RegisterStyles";
import Step1 from "./components/Step1";
import Step3 from "./components/Step3";
import Step2 from "./components/Step2";
import { useToastContext } from "@/contexts/ToastContext";
import api from "@/services/api/admin";

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
}

const Register: React.FC = () => {
  const router = useRouter()

  const [steps, setSteps] = useState<number>(1)
  const [errors, setErrors] = useState<any>({})
  const { showToast } = useToastContext()
  const [loadingApi, setLoadingApi] = useState<boolean>(false)

  const nextStep = () => {
    const errorsData = validateError(steps)
    setErrors(errorsData)   
    
    switch (steps) {
      case 1:
        Object.keys(errorsData).length === 0 && setSteps((prevState)=> (prevState + 1))
        break;
      case 2:
        Object.keys(errorsData).length === 0 && setSteps((prevState)=> (prevState + 1))
        break;
      case 3:
        Object.keys(errorsData).length === 0 && handleRegister()
        break
    }
  }

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
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateError = (currentStep: number) => {
    let error: any = {};
  
    if (currentStep === 1) {
      if (!formData.nombre.trim()) error.nombre = "Por favor ingrese un nombre válido";
      if (!formData.descripcion.trim()) error.descripcion = "Por favor ingrese una descripción válida";
    }
  
    if (currentStep === 2) {
      if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(formData.hora_apertura))
        error.hora_apertura = "Por favor ingrese una hora de apertura válida (formato HH:mm)";
      if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(formData.hora_cierre))
        error.hora_cierre = "Por favor ingrese una hora de cierre válida (formato HH:mm)";
      if (!formData.tipoServicioId)
        error.tipoServicioId = "Por favor seleccione un tipo de servicio válido";
    }
  
    if (currentStep === 3) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail))
        error.userEmail = "Por favor ingrese un correo electrónico válido";
      if (formData.password.length < 8)
        error.password = "La contraseña debe tener al menos 8 caracteres";
      if (formData.confirmPassword !== formData.password)
        error.confirmPassword = "La confirmación de la contraseña no coincide con la contraseña";
    }
  
    return error;
  };

  const handleRegister = async() => {
    console.log(formData);
    
    setLoadingApi(true)
    try {
      const data = await api.company.create(formData)
      if(data.ok) {
        router.push('/(auth)/login')
        showToast({
          title:'Empresa creada exitosamente',
          status:'success'
        })      
      }
    } catch (error : any) {
      showToast({
        title:'Error',
        description:error.response.data.message,
        status:'error'
      })      
    } finally {
      setLoadingApi(false)
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
          <CustomButton colorSpiner="white" loading={loadingApi} style={{ marginTop: 20 }} onPress={nextStep}>{steps === 3? 'Create Account' : 'Continue'}</CustomButton>
        </View>
      </VStack>
    </View>
  );
};

export default Register;

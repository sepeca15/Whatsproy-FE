import * as React from "react";
import CustomText from "@/components/CustomText";
import { View } from "native-base";
import { styles } from "./ConfigAccountStyles";
import Step1 from "./Components/Steps/Step1";
import Step2 from "./Components/Steps/Step2";
import Step3 from "./Components/Steps/Step3";
import Step4 from "./Components/Steps/Step4";
import { useUser } from "@/hooks/redux/useUser";

const ConfigAccount = () => {
  const { user } = useUser();
  const [currentStep, setCurrentStep] = React.useState<number>(0); // Controlamos el índice del paso actual

  const steps = React.useMemo(() => {    
    const stepList = [];
    if (!user.userConfigured) stepList.push(1);
    if (!user.paymentMade) stepList.push(2);
    if (!user.apiConfigured) stepList.push(3);
    if (!user.greenApiConfigured) stepList.push(4);
    return stepList;
  }, [user]);

  const renderStep = () => {
    const step = steps[currentStep];
    switch (step) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
    }
  };

  return (
    <View style={styles.containerTransparent}>
      <View style={styles.container}>
        <View style={styles.ContainerHeader}>
          <CustomText
            style={{ fontSize: 22, textAlign: "center", marginBottom:10, fontWeight: "bold" }}
          >
            Por favor termina de configurar tu cuenta
          </CustomText>
          {renderStep()}
        </View>
      </View>
    </View>
  );
};

export default ConfigAccount;

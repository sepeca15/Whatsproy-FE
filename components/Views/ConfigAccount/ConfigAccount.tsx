import * as React from "react";
import CustomText from "@/components/CustomText";
import { View } from "native-base";
import { styles } from "./ConfigAccountStyles";
import Step1 from "./components/Steps/Step1";
import Step2 from "./components/Steps/Step2";
import Step3 from "./components/Steps/Step3";
import Step4 from "./components/Steps/Step4";
import { useUser } from "@/hooks/redux/useUser";
import { FormattedMessage } from "react-intl";

const ConfigAccount = () => {
  const { user } = useUser();

  const steps = React.useMemo(() => {
    const stepList = [];
    if (!user.userConfigured) stepList.push(1);
    if (!user.paymentMade) stepList.push(2);
    if (!user.apiConfigured) stepList.push(3);
    if (!user.greenApiConfigured) stepList.push(4);
    return stepList;
  }, [user]);
  
  const [currentStep, setCurrentStep] = React.useState<number | null>(null);
  
  React.useEffect(() => {
    if (steps.length > 0 && steps[0] !== currentStep) {
      setCurrentStep(steps[0]);
    } else if (steps.length === 0 && currentStep !== null) {
      setCurrentStep(null);
    }
  }, [steps, currentStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.containerTransparent}>
      <View style={styles.container}>
        <View style={styles.ContainerHeader}>
          <CustomText
            style={{
              fontSize: 22,
              textAlign: "center",
              marginBottom: 10,
              fontWeight: "bold",
            }}
          >
            <FormattedMessage id="pleaseFinishConfig" />
          </CustomText>
          {renderStep()}
        </View>
      </View>
    </View>
  );
};

export default ConfigAccount;

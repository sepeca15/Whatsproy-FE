import * as React from "react";
import CustomText from "@/components/CustomText";
import { Text, View } from "native-base";
import { styles } from "./ConfigAccountStyles";
import Step1 from "./components/Steps/Step1";
import Step2 from "./components/Steps/Step2";
import Step3 from "./components/Steps/Step3";
import Step4 from "./components/Steps/Step4";
import { useUser } from "@/hooks/redux/useUser";
import { FormattedMessage, useIntl } from "react-intl";
import StepHeader from "./StepHeader";
import GenericModal from "./components/GenericModal/GenericModal";
import { removeData } from "@/storage/localStorage";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";

const ConfigAccount = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { user,  } = useUser();
  const { formatMessage } = useIntl();

  const totalSteps = 4;
  const [currentStep, setCurrentStep] = React.useState<number>(0);
  const [maxStep, setMaxStep] = React.useState<number>(0);

    const handleLogout = async () => {
      await removeData("token");
      dispatch({ type: "RESET" }); 
      router.replace("/(auth)/login");
    };
   

  React.useEffect(() => {
    if (user?.id) {
      let step = 0;
 
      if (!user.userConfigured) step = 1;
      else if (!user.paymentMade) step = 2;
      else if (!user.apiConfigured) step = 3;
      else if (!user.greenApiConfigured) step = 4;

      setCurrentStep(step);
      setMaxStep(step);
    }
  }, [user]);

  const goToNextStep = () => {
    if (currentStep < maxStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 onNext={goToNextStep} />;
      case 2:
        return <Step2 onNext={goToNextStep} />;
      case 3:
        return <Step3 onNext={goToNextStep} />;
      case 4:
        return <Step4 />;
      default:
        return null;
    }
  };

  return (
    <GenericModal
      visible={true}
      onClose={() => handleLogout()}
      title={formatMessage({ id: "configAccount" })}
      actions={[]}
    >
      <View style={styles.container}>
        <StepHeader step={currentStep} total={totalSteps} />
        <View style={styles.ContainerHeader}>{renderStep()}</View>
      </View>
    </GenericModal>
  );
};

export default ConfigAccount;

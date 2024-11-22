
import * as React from "react"
import CustomText from "@/components/CustomText";
import { View } from "native-base";
import { styles } from "./ConfigAccountStyles";
import CustomButton from "@/components/CustomButton";
import Step1 from "./Components/Steps/Step1";
import Step2 from "./Components/Steps/Step2";
import Step3 from "./Components/Steps/Step3";
import { useUser } from "@/hooks/redux/useUser";

const titles = ['Configura tu cuenta', 'Elige medio de pago', 'Estamos configurando todo para ti']

const ConfigAccount = () => {
    const { isConfig } = useUser()
    const [steps, setSteps] = React.useState<number>(1)

    const onContinue = () => {
        setSteps((prevState) => prevState + 1)
    }

    return (
        <View style={styles.containerTransparent}>
            <View style={styles.container}>
                <View style={styles.ContainerHeader}>
                    <CustomText style={{ fontSize: 22, textAlign: 'center', marginTop: 12, fontWeight:'bold' }}>Por favor termina de configurar tu cuenta</CustomText>
                    <CustomText style={{ fontSize: 16, textAlign: 'center', marginVertical: 6 }}>{titles[steps - 1]}</CustomText>
                    {
                        steps == 1 ?
                            <Step1 />
                        :
                        steps == 2 ?
                            <Step2 onContinue={onContinue} />
                        :
                            <Step3 />
                    }
                </View>
                {
                    steps != 2 &&
                    (<View style={styles.ContainerFooter}>
                        <CustomButton isDisabled={steps === 3 && isConfig === false} onPress={() => onContinue()}>Continuar</CustomButton>
                    </View>)
                }

            </View>
        </View>
    );
}

export default ConfigAccount

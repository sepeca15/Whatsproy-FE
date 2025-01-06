import * as React from "react";
import { View } from "native-base";
import { styles } from "./MethodOfPayCardStyles";
import CustomText from "@/components/CustomText";
import ComunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CustomButton from "@/components/CustomButton";
import { IPlans } from "./MethodOfPayCardTypes";
import { useUser } from "@/hooks/redux/useUser";

interface IMethodOfPayCard {
    Plan: IPlans;
}

const MethodOfPayCard = ({ Plan }: IMethodOfPayCard) => {
    const { handleAssignUserToPlan, user } = useUser()
    const [loadingApi, setloadingApi] = React.useState<boolean>(false)
    const adventagesArray = Plan.adventages.split(',')

    const assignPlan = async () => {
        try {
            if (loadingApi === false) {
                setloadingApi(true)
                await handleAssignUserToPlan({
                    fecha_inicio: new Date(),
                    id_empresa: user.id_empresa,
                    id_plan: Plan.id
                })
                setloadingApi(false)
            }
        } catch (error) {
            console.log(error);

        }
    }

    return (
        <View style={styles.MainContainer}>
            {
                Plan.mostPoppular &&
                <View style={styles.ContainerMostPopular}>
                    <CustomText style={styles.WhiteTextBold}>MOST POPULAR</CustomText>
                </View>
            }
            <View style={styles.containerCardMethodOfPay}>
                <View style={styles.ContainerHeader}>
                    <CustomText style={styles.WhiteTextBold}>{Plan.nombre}</CustomText>
                    <View style={styles.ContainerRow}>
                        <CustomText style={[styles.WhiteTextBold, { fontSize: 25 }]}>
                            USD {Plan.costoUSD}
                        </CustomText>
                        <CustomText style={[styles.WhiteText, { fontSize: 20 }]}>/mo</CustomText>
                    </View>
                    <View style={styles.ContainerAdvantages}>
                        {adventagesArray.map((advantage, index) => (
                            <View key={index} style={styles.ContainerRowAdventage}>
                                <View style={styles.ContainerCircle}>
                                    <ComunityIcons name="check" color={'black'} size={10} />
                                </View>
                                <CustomText style={styles.WhiteText}>{advantage}</CustomText>
                            </View>
                        ))}
                    </View>
                </View>
                <View style={styles.ContainerFooter}>
                    <CustomButton colorSpiner="white" loading={loadingApi} style={{ alignContent: 'flex-start' }} width={'100%'} background="#323232" onPress={assignPlan} >
                        Buy Now
                    </CustomButton>
                </View>
            </View>
        </View>

    );
};

export default MethodOfPayCard;

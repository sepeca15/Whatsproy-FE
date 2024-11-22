import * as React from "react";
import { View } from "native-base";
import { styles } from "./MethodOfPayCardStyles";
import CustomText from "@/components/CustomText";
import ComunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CustomButton from "@/components/CustomButton";

interface IPlan {
    name: string;
    price: string;
    adventages: string[];
    isPopular?: boolean
}

interface IMethodOfPayCard {
    Plan: IPlan;
    next: () => any;
}

const MethodOfPayCard = ({ Plan, next }: IMethodOfPayCard) => {

    return (
        <View style={styles.MainContainer}>
            {
                Plan.isPopular &&
                <View style={styles.ContainerMostPopular}>
                    <CustomText style={styles.WhiteTextBold}>MOST POPULAR</CustomText>
                </View>
            }
            <View style={styles.containerCardMethodOfPay}>
                <View style={styles.ContainerHeader}>
                    <CustomText style={styles.WhiteTextBold}>{Plan.name}</CustomText>
                    <View style={styles.ContainerRow}>
                        <CustomText style={[styles.WhiteTextBold, { fontSize: 25 }]}>
                            {Plan.price}
                        </CustomText>
                        <CustomText style={[styles.WhiteText, { fontSize: 20 }]}>/mo</CustomText>
                    </View>
                    <View style={styles.ContainerAdvantages}>
                        {Plan.adventages.map((advantage, index) => (
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
                    <CustomButton style={{ alignContent: 'flex-start' }} width={'100%'} background="#323232" onPress={next} >
                        Buy Now
                    </CustomButton>
                </View>
            </View>
        </View>

    );
};

export default MethodOfPayCard;

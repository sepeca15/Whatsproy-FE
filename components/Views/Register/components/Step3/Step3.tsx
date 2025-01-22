import { Switch, View, VStack } from "native-base"
import { styles } from "./Step3Styles"
import InputField from "@/components/InputField";
import CustomText from "@/components/CustomText";
import { useState } from "react";
import AlertText from "../AlertText";

interface IStep3 {
    formData: any,
    handleInputChange: (key: string, value: any) => void;
    errors: any
    tipoServicio: number | null
}

const Step3 = ({ formData, errors, handleInputChange, tipoServicio }: IStep3) => {

    return (
        <VStack space={4}>
            <View>
                <InputField
                    label="Email"
                    placeholder="Ingresa el email de tu empresa"
                    value={formData.userEmail}
                    onChangeText={(value) => handleInputChange("userEmail", value)}
                />
                {errors.userEmail && (
                    <AlertText text={errors.userEmail} />
                )}
            </View>

            <View>
                <InputField
                    type={'password'}
                    label="Password"
                    placeholder=""
                    value={formData.password}
                    onChangeText={(value) => handleInputChange("password", value)}
                />
                {errors.password && (
                    <AlertText text={errors.password} />
                )}
            </View>

            <View>
                <InputField
                    type={'password'}
                    label="Confirm password"
                    placeholder=""
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange("confirmPassword", value)}
                />
                {errors.confirmPassword && (
                    <AlertText text={errors.confirmPassword}/>
                )}
            </View>
            {
                tipoServicio === 2 &&
                <View display={'flex'} flexDir={'row'} alignItems={'center'} >
                    <CustomText style={{marginRight:6}}>¿Desea notificcar las horas de las reservas?</CustomText>
                    <Switch
                        isChecked={formData.notificarReservaHoras}
                        onToggle={()=> handleInputChange('notificarReservaHoras',!formData.notificarReservaHoras)}
                        size="lg"
                        colorScheme="primary" 
                    />
                </View>
            }
        </VStack>
    )

}

export default Step3 
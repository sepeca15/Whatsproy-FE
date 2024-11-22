
import * as React from "react"
import { View } from "native-base";
import { styles } from "../../ConfigAccountStyles";
import InputField from "@/components/InputField";

const Step1 = () => {
  return (
    <View   style={styles.containerStep1}>
        <View style={styles.containerForm}>
            <InputField marginTop={20}  type="text" label="Ingrese su nombre" placeholder="Name"/>
            <InputField marginTop={20} type="text" label="Ingrese su apellido" placeholder="Last name"/>
        </View>
    </View>
  );
}

export default Step1

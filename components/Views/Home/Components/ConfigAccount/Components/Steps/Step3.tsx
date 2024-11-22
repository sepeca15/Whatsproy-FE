
import * as React from "react"
import { View } from "native-base";
import { styles } from "../../ConfigAccountStyles";
import * as Progress from 'react-native-progress';


const Step3 = () => {
  return (
    <View style={styles.containerStep3}>
      <Progress.Circle indeterminate={true} size={100}/>
    </View>
  );
}

export default Step3

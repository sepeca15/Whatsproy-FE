import { MaterialIcons } from "@expo/vector-icons"
import CustomText from "./CustomText"
import { View } from "native-base"
import { StyleSheet } from "react-native"
import { Colors } from "@/constants/Colors"

interface InformativeText{
    text:any
}

const InformativeText = ({text} : InformativeText ) => {
    return (<View style={styles.message}>
        <MaterialIcons
            style={{ marginTop: 3 }}
            color={Colors.light.secondary}
            size={16}
            name="error-outline"
        />
        <CustomText style={{ flex: 1, color: Colors.light.secondary }}>
            {text}
            {/* <FormattedMessage id="manageOrderData" /> */}
        </CustomText>
    </View>)
}

const styles = StyleSheet.create({
    message: {
        backgroundColor: "rgba(18, 140, 126, 0.08)",
        borderRadius: 16,
        width: "100%",
        padding: 12,
        display: "flex",
        flexDirection: "row",
        gap: 4,
        alignItems: "flex-start",
        alignSelf: "center",
        borderColor: Colors.light.secondary,
        borderWidth: 0.6,
    },
})

export default InformativeText


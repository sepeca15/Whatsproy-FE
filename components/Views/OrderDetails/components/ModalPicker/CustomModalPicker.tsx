import { Pressable, ScrollView, Text, View } from "native-base";
import { Modal } from "react-native";
import { styles } from './CustomModalPickerStyles'
import { FormattedMessage } from "react-intl";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { IEstado } from "@/components/Views/Status/Status";
import moment from "moment-timezone";
import { useUser } from "@/hooks/redux/useUser";

interface ICustomModalPicker {
    onClose: () => void;
    isVisible: boolean;
    elements: any[];
    lastStatusOrder: number;
    changeStatusOrder: (newStatus: IEstado) => void;
    createOrderDate: string;

}

const CustomModalPicker = ({ isVisible, onClose, elements, lastStatusOrder, changeStatusOrder, createOrderDate }: ICustomModalPicker) => {      
    const {user} = useUser()
    
    return (
        <Modal
            transparent
            animationType="slide"
            visible={isVisible}
            style={{ zIndex: 1 }}
            onRequestClose={onClose}
        >
            <Pressable onPress={(onClose)} style={styles.container}>
                <View style={styles.containerContent}>
                    <View style={styles.header}>
                        <Text fontWeight={'bold'} fontSize={20} color={'white'}>
                            <FormattedMessage id="changeStatusOrderTitle" />
                        </Text>
                    </View>

                    <ScrollView style={styles.elements}>
                        {
                            elements.map((item, index) => {
                                const isStatusFinished = item.order <= lastStatusOrder
                                return <Pressable onPress={() => changeStatusOrder(item)} backgroundColor={isStatusFinished ? 'gray.200' : 'white'} style={styles.element} key={index}>
                                    <View display={'flex'} flexDir={'column'} alignItems={'flex-start'}>
                                        <Text fontWeight={'bold'} color={isStatusFinished ? 'gray.400' : 'black'} >{item.nombre}</Text>
                                        {
                                            isStatusFinished &&
                                            <Text marginLeft={4} color={'black'}>{moment.tz(createOrderDate, user.timeZone).format('D [de] MMMM, YYYY, HH:MM').toString()}</Text>
                                        }
                                    </View>
                                    {
                                        isStatusFinished ?
                                            <AntDesign name="checkcircle" size={25} color={Colors.light.secondary} />
                                            :
                                            <FontAwesome name="hourglass-half" size={20} color={'gray'} />
                                    }
                                </Pressable>
                            })
                        }
                    </ScrollView>
                </View>
            </Pressable>
            <View className=""></View>

        </Modal>

    )
}

export default CustomModalPicker
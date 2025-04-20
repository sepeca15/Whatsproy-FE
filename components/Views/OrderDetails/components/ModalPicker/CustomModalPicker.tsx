import { Pressable, ScrollView, Spinner, Text, View } from "native-base";
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
    changeStatus: any;
    loading: boolean

}

const CustomModalPicker = ({ isVisible, onClose, elements, lastStatusOrder, changeStatusOrder, createOrderDate, changeStatus, loading }: ICustomModalPicker) => {
    const { user } = useUser()

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

                    {loading && (
                        <View
                            style={{
                                position: 'absolute',
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 2,
                                width: '100%',
                                height: '100%',
                                borderRadius: 10,
                            }}
                        >
                            <Spinner color="white" size="lg" />
                        </View>
                    )}

                    <ScrollView style={styles.elements}>
                        {
                            elements.map((item, index) => {
                                const isStatusFinished = item.order <= lastStatusOrder
                                const findCambioEstado = changeStatus.find((itm: any) => itm.estado.id === item.id)
                                return <Pressable onPress={() => changeStatusOrder(item)} backgroundColor={isStatusFinished ? 'gray.200' : 'white'} style={styles.element} key={index}>
                                    <View display={'flex'} flexDir={'column'} alignItems={'flex-start'}>
                                        <Text fontWeight={'bold'} color={isStatusFinished ? 'gray.400' : 'black'} >{item.nombre}</Text>
                                        {
                                            isStatusFinished &&
                                            <Text marginLeft={4} color={'black'}>{moment.tz((index === 0 ? createOrderDate : findCambioEstado?.createdAt), user.timeZone).format('D [de] MMMM, YYYY, HH:MM').toString()}</Text>
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
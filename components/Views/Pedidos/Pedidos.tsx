import * as React from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable } from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons.js';
import OrdersFinished from './components/OrdersFinished';
import OrdersPending from './components/OrdersPending';
import { useUser } from "@/hooks/redux/useUser";
import CreateOrderModal from '@/components/CreateOrderModal';
import { FormattedMessage } from 'react-intl'; // Importa FormattedMessage

type pagesOrder = 'finished' | 'pending';

const PedidosEIngresos: React.FC = () => {
    const [selected, setSelected] = React.useState<pagesOrder>('pending');
    const [openAddModal, setOpenAddModal] = React.useState<boolean>(false);

    const { user } = useUser();
    const handleSelectPage = (key: pagesOrder) => {
        setSelected(key);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {
                    user.tipo_servicioNombre === 'Delivery' ? <FormattedMessage id="orders" defaultMessage="Orders" /> : <FormattedMessage id="reservations" defaultMessage="Reservations" />
                }
            </Text>
            <View style={styles.tab}>
                {['pending', 'finished'].map((key) => (
                    <View key={key} style={styles.containerTabItem}>
                        <Pressable
                            onPress={() => handleSelectPage(key as pagesOrder)}
                            style={styles.pressable}
                            accessibilityRole="button"
                        >
                            <View style={styles.column}>
                                <View style={styles.row}>
                                    {
                                        key === 'pending' ?
                                            <MaterialCommunityIcons size={16} name='camera-timer' />
                                            :
                                            <SimpleLineIcons size={16} name='notebook' />
                                    }
                                    <Text style={styles.text}>
                                        {key === 'pending' ? <FormattedMessage id="pending" defaultMessage="Pending" /> : <FormattedMessage id="finished" defaultMessage="Finished" />}
                                    </Text>
                                </View>
                                {
                                    selected === key &&
                                    <View style={styles.selected} />
                                }
                            </View>
                        </Pressable>
                    </View>
                ))}
            </View>
            <ScrollView style={styles.orders}>
                {
                    selected === 'finished' ?
                        <OrdersFinished />
                        :
                        <OrdersPending />
                }
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Pressable
                    style={styles.addButton}
                    onPress={() => {
                        setOpenAddModal((prevState) => (!prevState));
                    }}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </Pressable>
            </View>
            {
                openAddModal && <CreateOrderModal tipoServicio={user.tipo_servicio} onClose={() => setOpenAddModal((prevState) => (!prevState))} />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    chartWrapper: {
        marginBottom: 20,
    },
    title: {
        fontSize: 30,
        textAlign: 'center'
    },
    orders: {
        marginTop: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        flex: 1
    },
    Corders: {
        flex: 1,
        height: '100%',
        backgroundColor: 'red'
    },
    tab: {
        marginVertical: 12,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#d4ece8',
        borderBottomWidth: 4,
    },
    containerTabItem: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        flex: 1 / 2
    },
    pressable: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        width: '60%',
        paddingVertical: 12,
    },
    selected: {
        height: 4,
        width: '100%',
        backgroundColor: "#075e54",
        position: 'absolute',
        bottom: -16,
        borderRadius: 12,
    },
    text: {
        textAlign: 'center'
    },
    column: {
        width: "100%",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    addButton: {
        backgroundColor: '#075e54',
        width: 45,
        height: 45,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',

    },
    addButtonText: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'semibold',
    },
});

export default PedidosEIngresos;
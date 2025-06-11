import React, { useState, useMemo } from 'react'
import { FlatList } from 'react-native'
import {
    Box,
    Input,
    Text,
    Heading,
    VStack,
    HStack,
    Select,
    CheckIcon,
    Button,
    Badge,
    Modal,
    Divider,
    ScrollView,
    Icon,
    View,
    Center,
} from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import { FormattedMessage } from 'react-intl'
import Animated from 'react-native-reanimated'
import { globalStyles } from '@/components/globalStyles'
import CustomText from '@/components/CustomText'
import api from '@/services/api/admin'
import { Cliente } from './types'
import { Colors } from '@/constants/Colors'
import InputField from '@/components/InputField'
import * as Progress from "react-native-progress";
import CardClient from './components/CardClient.tsx'
import { useRouter } from 'expo-router'

type typeKeys = 'clients' | 'offset' | 'limit' | 'totalItems'

interface IValues {
    offset: number;
    limit: number;
    clients: Cliente[];
    totalItems: number;
}

const initialState = {
    offset: 0,
    limit: 10,
    clients: [],
    totalItems: 0
}

const Clients = () => {
    const [filtroNombre, setFiltroNombre] = useState('')
    const [loadingApi, setLoadingApi] = React.useState(false)
    const [values, setValues] = useState<IValues>(initialState)
    const router = useRouter()

    const handleLoadClients = async (offset = values.offset, limit = values.limit, nombre = filtroNombre, reset = false) => {
        setLoadingApi(true)
        try {
            console.log(filtroNombre);

            const resp = await api.client.findWithOrders({ offset, limit, query: nombre })

            if (resp.ok) {
                setValues((prev) => ({
                    ...prev,
                    clients: reset ? resp.data : [...prev.clients, ...resp.data],
                    offset: offset + limit,
                    totalItems: resp.totalItems ?? prev.totalItems,
                }))
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoadingApi(false)
        }
    }

    React.useEffect(() => {
        handleLoadClients()
    }, [])

    React.useEffect(() => {
        const delayDebounce = setTimeout(() => {
            handleLoadClients(0, initialState.limit, filtroNombre, true)
        }, 500)

        return () => clearTimeout(delayDebounce)
    }, [filtroNombre])

    const handleSendPageDetails = (clientData: Cliente) => {
        router.push({
            pathname: "/(tabs)/clientDetails",
            params: { clientDataString: JSON.stringify(clientData)  },
        });
    };

    return (
        <Box flex={1} bg="white">
            <Animated.View style={globalStyles.header}>
                <View style={globalStyles.headerContent}>
                    <View style={globalStyles.headerLeft}>
                        <CustomText
                            style={globalStyles.businessName}
                            accessibilityLabel="Pedidos"
                        >
                            <FormattedMessage id="manageClients" />
                        </CustomText>
                    </View>
                </View>
            </Animated.View>
            <Box flex={1} p={4} m={2} >
                <Text color="teal.600">Administra y visualiza la información de tus clientes</Text>
                <VStack my={4} space={3}>
                    <InputField
                        placeholder="Buscar por nombre..."
                        value={filtroNombre}
                        onChangeText={setFiltroNombre}
                        InputLeftElement={<Icon as={Ionicons} name="search" size={5} ml="2" color={Colors.light.secondary} />}
                    />
                </VStack>
                {
                    values.clients.length > 0 &&
                    <FlatList
                        data={values.clients}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <CardClient setClienteSeleccionado={()=> handleSendPageDetails(item)} item={item} />}
                        onEndReached={() => {
                            if (values.clients.length < values.totalItems && !loadingApi) {
                                console.log('🚀 Cargando más clientes...')
                                handleLoadClients()
                            }
                        }}
                        onEndReachedThreshold={0.2}
                        ListFooterComponent={
                            (loadingApi && values.clients.length > 0)
                                ? (
                                    <Center>
                                        <Progress.Circle color={"#075e54"} indeterminate={true} size={40} />
                                    </Center>
                                )
                                : null
                        }
                    />

                }
                {
                    (values.clients.length === 0 && loadingApi) &&
                    <Center flex={1} display={'flex'} flexDir={'row'} alignItems={'center'}>
                        <Progress.Circle color={"#075e54"} indeterminate={true} size={40} />
                    </Center>
                }

                {(values.clients.length === 0 && !loadingApi) && (
                    <Center flex={1} display={'flex'} flexDir={'row'} alignItems={'center'}>
                        <Text textAlign="center" color="teal.600">No se encontraron clientes.</Text>
                    </Center>
                )}
            </Box>
        </Box>
    )
}


export default Clients
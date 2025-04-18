import * as React from 'react'
import { Button, ScrollView, Text, View } from "native-base"
import api from '@/services/api/admin'
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import ModalCreateOrEditStatus from './components/ModalCreateOrEditStatus';


export interface IEstado {
    id: number;
    nombre: string;
    es_defecto: boolean;
    finalizador: boolean;
    tipoServicioId: number;
    order: number | null;
    createdAt: string;
    updatedAt: string;
}

const StatusView = () => {
    const [status, setStatus] = React.useState<IEstado[]>([])
    const [loadingApi, setLoadingApi] = React.useState<boolean>(false)
    const [stateModal, setStateModal] = React.useState<boolean>(false)

    const toggleMoadl = () => setStateModal((prev) => !prev)

    const addStatus = (newItem : IEstado) => {
        setStatus((prev : IEstado[])=> ([...prev,  newItem]))
    }

    const loadAllStatus = async () => {
        setLoadingApi(true)
        try {
            const resp = await api.status.findAll()

            if (resp.ok) {

                setStatus(resp.data)
            }

        } catch (error) {
            console.log(error);
        }
        setLoadingApi(false)
    }


    React.useEffect(() => {
        loadAllStatus()
    }, [])

    return (
        <View w={'full'} position={'relative'} px={4} py={4} h={'full'} display={'flex'} flexDir={'column'} alignItems={'center'} >
            <Text fontSize={24}>Estados</Text>

            <ScrollView w={'full'} mt={4} h={'full'} horizontal={false}>
                <View px={4} w={'full'} display={'flex'} flexDir={'row'}>
                    <View flex={0.2}>
                        <Text>Orden</Text>
                    </View>
                    <View flex={0.3}>
                        <Text>Nombre</Text>
                    </View>
                    <View flex={0.25}>
                        <Text>Finalizador</Text>
                    </View>
                    <View flex={0.25}>ss
                        <Text>Acciones</Text>
                    </View>
                </View>
                {
                    status.length > 0 &&
                    status.map((statusData, index) => {
                        return <View key={statusData.id} mb={4} display={'flex'} px={4} flexDir={'row'} rounded={'md'} w={'full'} bg={'gray.300'} py={4}>
                            <View flexDir={'row'} display={'flex'} alignItems={'center'} flex={0.2}>
                                <FontAwesome name='reorder' color={'black'} />
                                <Text marginLeft={2}>{statusData.order}</Text>
                            </View>
                            <View flex={0.3}>
                                <Text>{statusData.nombre}</Text>
                            </View>
                            <View flex={0.25}>
                                <Text>{statusData.finalizador === true ? "SI" : "NO"}</Text>
                            </View>
                            <View flex={0.25}>
                                <Text>Acciones</Text>
                            </View>
                        </View>
                    })
                }
            </ScrollView>

            <Button onPress={toggleMoadl} w={'50px'} h={'50px'} display={'flex'} justifyContent={'center'} alignItems={'center'} bg={'teal.600'} rounded={'full'} position={'absolute'} bottom={4} right={4}>
                <Ionicons name='add' color={'white'} size={30} />
            </Button>

            <ModalCreateOrEditStatus addNewStatus={addStatus} isOpen={stateModal} onClose={toggleMoadl} />
        </View>
    )
}

export default StatusView